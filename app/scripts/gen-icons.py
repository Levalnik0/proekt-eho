#!/usr/bin/env python3
"""
Собирает PNG-иконки приложения из того же знака, что лежит в
src/components/EchoLogo.tsx и public/icon.svg.

Запуск:  python3 scripts/gen-icons.py
Зависимостей нет — растеризация построчная, поэтому быстрая.

Если знак изменится, поправить нужно только MARK ниже.
"""

import math
import os
import struct
import zlib

TEAL = (0x45, 0xA9, 0xA8)
NAVY = (0x1E, 0x3F, 0x68)

# Знак в координатах viewBox 0..100 — один в один с EchoLogo.tsx
MARK = {
    "adult": {"color": NAVY, "turn": -9, "pivot": (32, 72),
              "head": (32, 27, 11),
              "body": ((15, 72), (15, 49), (49, 49), (49, 72))},
    "kid": {"color": TEAL, "turn": 9, "pivot": (68, 72),
            "head": (68, 41, 8),
            "body": ((55, 72), (55, 55), (81, 55), (81, 72))},
}


def bezier(p0, c1, c2, p1, n=48):
    pts = []
    for i in range(n + 1):
        t = i / n
        u = 1 - t
        pts.append((
            u**3 * p0[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t**3 * p1[0],
            u**3 * p0[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t**3 * p1[1],
        ))
    return pts


def transform(pt, turn, pivot, scale, offset):
    """Поворот вокруг точки, затем масштаб и сдвиг всей группы."""
    a = math.radians(turn)
    dx, dy = pt[0] - pivot[0], pt[1] - pivot[1]
    x = pivot[0] + dx * math.cos(a) - dy * math.sin(a)
    y = pivot[1] + dx * math.sin(a) + dy * math.cos(a)
    return (offset[0] + x * scale, offset[1] + y * scale)


def poly_spans(poly, y):
    """Интервалы по x, где строка y попадает внутрь многоугольника."""
    xs = []
    n = len(poly)
    for i in range(n):
        x1, y1 = poly[i]
        x2, y2 = poly[(i + 1) % n]
        if (y1 <= y < y2) or (y2 <= y < y1):
            xs.append(x1 + (y - y1) * (x2 - x1) / (y2 - y1))
    xs.sort()
    return [(xs[i], xs[i + 1]) for i in range(0, len(xs) - 1, 2)]


def circle_span(c, y):
    cx, cy, r = c
    d = r * r - (y - cy) ** 2
    if d <= 0:
        return []
    h = math.sqrt(d)
    return [(cx - h, cx + h)]


def rounded_rect_span(size, radius, y):
    """Скруглённая плитка-подложка."""
    if y < 0 or y > size:
        return []
    if y < radius:
        h = radius - math.sqrt(max(radius**2 - (radius - y) ** 2, 0))
    elif y > size - radius:
        h = radius - math.sqrt(max(radius**2 - (y - (size - radius)) ** 2, 0))
    else:
        h = 0
    return [(h, size - h)]


def mark_bbox():
    """Габариты знака после поворотов — чтобы вписать его в плитку по центру."""
    xs, ys = [], []
    for part in MARK.values():
        turn, pivot = part["turn"], part["pivot"]
        cx, cy, r = part["head"]
        c = transform((cx, cy), turn, pivot, 1.0, (0, 0))
        xs += [c[0] - r, c[0] + r]
        ys += [c[1] - r, c[1] + r]
        for p in bezier(*part["body"]):
            q = transform(p, turn, pivot, 1.0, (0, 0))
            xs.append(q[0])
            ys.append(q[1])
    return min(xs), min(ys), max(xs), max(ys)


def render(size, pad, radius_ratio, out):
    SS = 4  # подстроки на пиксель — сглаживание по вертикали
    radius = size * radius_ratio

    # Вписываем знак в квадрат с полем, по центру
    bx0, by0, bx1, by1 = mark_bbox()
    box = size * (100 - 2 * pad) / 100
    scale = box / max(bx1 - bx0, by1 - by0)
    offset = (
        (size - (bx1 - bx0) * scale) / 2 - bx0 * scale,
        (size - (by1 - by0) * scale) / 2 - by0 * scale,
    )

    shapes = []
    for part in MARK.values():
        turn, pivot, color = part["turn"], part["pivot"], part["color"]
        cx, cy, r = part["head"]
        c = transform((cx, cy), turn, pivot, scale, offset)
        shapes.append(("circle", (c[0], c[1], r * scale), color))
        curve = bezier(*part["body"])
        poly = [transform(p, turn, pivot, scale, offset) for p in curve]
        shapes.append(("poly", poly, color))

    # Слои снизу вверх: подложка, затем фигуры в порядке отрисовки
    palette = [(255, 255, 255)] + [color for _, _, color in shapes]

    rows = []
    for y in range(size):
        # Покрытие каждого слоя копим отдельно, смешиваем уже в конце:
        # иначе полупрозрачные доли слоёв разбавляют друг друга и цвет блёкнет.
        cover = [[0.0] * size for _ in palette]
        for s in range(SS):
            yc = y + (s + 0.5) / SS
            spans_by_layer = [rounded_rect_span(size, radius, yc)]
            for kind, data, _ in shapes:
                spans_by_layer.append(
                    circle_span(data, yc) if kind == "circle" else poly_spans(data, yc)
                )
            for layer, spans in enumerate(spans_by_layer):
                acc = cover[layer]
                for x0, x1 in spans:
                    a, b = max(x0, 0.0), min(x1, float(size))
                    if b <= a:
                        continue
                    for x in range(int(a), min(int(b) + 1, size)):
                        cov = (min(b, x + 1) - max(a, x)) / SS
                        if cov > 0:
                            acc[x] = min(acc[x] + cov, 1.0)

        row = bytearray([0])
        for x in range(size):
            r = g = b = a = 0.0
            for layer, color in enumerate(palette):
                c = cover[layer][x]
                if c <= 0:
                    continue
                r = color[0] * c + r * (1 - c)
                g = color[1] * c + g * (1 - c)
                b = color[2] * c + b * (1 - c)
                a = c + a * (1 - c)
            row += bytes((int(r + 0.5), int(g + 0.5), int(b + 0.5), int(a * 255 + 0.5)))
        rows.append(bytes(row))

    def chunk(tag, data):
        body = tag + data
        return struct.pack(">I", len(data)) + body + struct.pack(">I", zlib.crc32(body))

    png = (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0))
        + chunk(b"IDAT", zlib.compress(b"".join(rows), 9))
        + chunk(b"IEND", b"")
    )
    with open(out, "wb") as f:
        f.write(png)
    print("готово:", out, os.path.getsize(out), "байт")


if __name__ == "__main__":
    here = os.path.dirname(os.path.abspath(__file__))
    d = os.path.join(here, "..", "public", "icons")
    os.makedirs(d, exist_ok=True)
    render(192, 14, 0.235, os.path.join(d, "icon-192.png"))
    render(512, 14, 0.235, os.path.join(d, "icon-512.png"))
    # maskable: система сама обрежет углы, поэтому поле больше, а скругления нет
    render(512, 24, 0.0, os.path.join(d, "maskable-512.png"))
    # iOS сам скругляет и не любит прозрачность — плитка без скругления
    render(180, 14, 0.0, os.path.join(d, "apple-touch-icon.png"))
