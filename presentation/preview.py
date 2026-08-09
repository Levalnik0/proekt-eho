"""
Проверка собранной презентации: читаем готовый .pptx и рисуем его в HTML
по тем же координатам. Так видно переполнение текста и выходы за край —
LibreOffice в системе нет, а глазами по коду такие вещи не поймать.
"""
import base64
import html
import io
import os
import sys

from pptx import Presentation
from pptx.util import Emu

SRC = sys.argv[1] if len(sys.argv) > 1 else 'Проект_Эхо_презентация.pptx'
OUT = 'preview.html'
PX = 96  # 1 дюйм = 96 px

prs = Presentation(SRC)
SW = prs.slide_width / 914400 * PX
SH = prs.slide_height / 914400 * PX

problems = []
parts = []

def emu(v):
    return (v or 0) / 914400 * PX

for idx, slide in enumerate(prs.slides, 1):
    # Цвет фона берём из самого слайда, иначе тёмные слайды в превью
    # выглядят светлыми и белый текст на них не виден
    bg = 'F2F4F6'
    try:
        srgb = slide._element.find(
            './/{http://schemas.openxmlformats.org/presentationml/2006/main}bg'
        )
        if srgb is not None:
            clr = srgb.find('.//{http://schemas.openxmlformats.org/drawingml/2006/main}srgbClr')
            if clr is not None:
                bg = clr.get('val')
    except Exception:
        pass
    items = []
    for sh in slide.shapes:
        x, y = emu(sh.left), emu(sh.top)
        w, h = emu(sh.width), emu(sh.height)

        if x < -1 or y < -1 or x + w > SW + 1 or y + h > SH + 1:
            problems.append(f'слайд {idx}: «{sh.shape_type}» выходит за край слайда')

        if sh.shape_type == 13:  # picture
            blob = sh.image.blob
            b64 = base64.b64encode(blob).decode()
            items.append(
                f'<img src="data:image/png;base64,{b64}" style="left:{x}px;top:{y}px;'
                f'width:{w}px;height:{h}px">'
            )
            continue

        fill = ''
        try:
            if sh.fill.type is not None and sh.fill.type == 1:
                fill = f'background:#{sh.fill.fore_color.rgb}'
        except Exception:
            pass
        prst = ''
        try:
            g = sh._element.find(
                './/{http://schemas.openxmlformats.org/drawingml/2006/main}prstGeom'
            )
            if g is not None:
                prst = g.get('prst') or ''
        except Exception:
            pass

        if fill:
            radius = ''
            if prst == 'roundRect':
                radius = 'border-radius:14px;'
            elif prst == 'ellipse':
                radius = 'border-radius:50%;'
            items.append(
                f'<div class="shape" style="left:{x}px;top:{y}px;width:{w}px;'
                f'height:{h}px;{fill};{radius}"></div>'
            )

        if sh.has_text_frame and sh.text_frame.text.strip():
            va = {1: 'center', 2: 'flex-end'}.get(
                int(sh.text_frame.vertical_anchor) if sh.text_frame.vertical_anchor else 0,
                'flex-start',
            )
            runs = []
            size, color, bold, italic, align = 14, '232A32', False, False, 'left'
            for p in sh.text_frame.paragraphs:
                if p.alignment is not None:
                    align = {1: 'center', 3: 'right'}.get(int(p.alignment), 'left')
                for r in p.runs:
                    if r.font.size:
                        size = r.font.size.pt
                    if r.font.bold:
                        bold = True
                    if r.font.italic:
                        italic = True
                    try:
                        if r.font.color and r.font.color.rgb:
                            color = str(r.font.color.rgb)
                    except Exception:
                        pass
                    runs.append(html.escape(r.text))
            text = ' '.join(runs)
            items.append(
                f'<div class="tx" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px;'
                f'display:flex;flex-direction:column;justify-content:{va};'
                f'font-size:{size}px;color:#{color};'
                f'font-weight:{"700" if bold else "400"};'
                f'font-style:{"italic" if italic else "normal"};'
                f'text-align:{align}">{text}</div>'
            )

    parts.append(
        f'<div class="wrap"><div class="num">Слайд {idx}</div>'
        f'<div class="slide" style="background:#{bg}">' + ''.join(items) + '</div></div>'
    )

doc = f"""<!doctype html><html lang="ru"><head><meta charset="utf-8">
<title>Превью презентации</title><style>
body {{ margin:0; padding:24px; background:#3a4450; font-family:Calibri,Carlito,Arial,sans-serif; }}
.wrap {{ margin:0 auto 28px; width:{SW}px; }}
.num {{ color:#c9d3de; font-size:13px; margin-bottom:6px; }}
.slide {{ position:relative; width:{SW}px; height:{SH}px; overflow:hidden;
  box-shadow:0 8px 30px rgba(0,0,0,.35); }}
.shape, .tx, img {{ position:absolute; }}
.tx {{ line-height:1.25; white-space:pre-wrap; overflow-wrap:break-word; }}
img {{ object-fit:contain; }}
.over {{ outline:2px solid #ff4d4f; background:rgba(255,77,79,.12); }}
</style></head><body>{''.join(parts)}
<script>
// Текст, который не влезает в свой блок, — самый частый дефект слайда.
// Меряем по факту отрисовки, а не на глаз.
window.overflows = [];
document.querySelectorAll('.slide').forEach((sl, i) => {{
  sl.querySelectorAll('.tx').forEach((el) => {{
    const need = [...el.childNodes].reduce((a, n) => a + (n.nodeType === 1 ? n.scrollHeight : 0), 0)
      || el.scrollHeight;
    if (need > el.clientHeight + 2 || el.scrollWidth > el.clientWidth + 2) {{
      el.classList.add('over');
      window.overflows.push(
        'слайд ' + (i + 1) + ': «' + el.textContent.slice(0, 42) + '…» ' +
        el.scrollHeight + '>' + el.clientHeight
      );
    }}
  }});
}});
</script></body></html>"""

open(OUT, 'w', encoding='utf-8').write(doc)
print(f'слайдов: {len(prs.slides)}, размер: {SW:.0f}×{SH:.0f} px')
print('превью:', os.path.abspath(OUT))
if problems:
    print('\nвыходы за край:')
    for p in problems:
        print(' •', p)
else:
    print('за край слайда ничего не выходит')
