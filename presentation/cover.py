"""
Фон титульного слайда: круги, расходящиеся из телефона, — то самое эхо.

Рисуем скриптом, а не подбираем картинку в интернете: фон нужен ровно в
палитре приложения, и его должно быть можно пересобрать, если палитра
поменяется. Результат кладётся в shots/cover.png и подставляется в build.js.

    .venv/bin/python cover.py
"""
from PIL import Image, ImageDraw, ImageFilter

W, H = 1920, 1080

NAVY_DEEP = (22, 33, 44)
GLOW = (30, 63, 104)
TEAL = (69, 169, 168)

# Центр колец — там же, где на слайде стоит телефон (6.55–9.08 дюйма
# по ширине из 10, 0.34–5.29 из 5.625 по высоте).
CX = int((6.55 + 9.08) / 2 / 10 * W)
CY = int((0.34 + 5.29) / 2 / 5.625 * H)

base = Image.new('RGB', (W, H), NAVY_DEEP)

# Свечение за телефоном: рисуем мелким и растягиваем, так дешевле градиента
glow = Image.new('L', (W // 8, H // 8), 0)
gd = ImageDraw.Draw(glow)
for i in range(28):
    r = (28 - i) * 9
    gd.ellipse(
        [CX // 8 - r, CY // 8 - r, CX // 8 + r, CY // 8 + r],
        fill=int(3 + i * 3.2),
    )
glow = glow.filter(ImageFilter.GaussianBlur(12)).resize((W, H), Image.BICUBIC)
base = Image.composite(Image.new('RGB', (W, H), GLOW), base, glow)

# Кольца эха
rings = Image.new('RGBA', (W, H), (0, 0, 0, 0))
rd = ImageDraw.Draw(rings)
for i, r in enumerate(range(260, 1500, 132)):
    # Проектор съедает слабый контраст, поэтому кольца заметнее, чем
    # хотелось бы на экране ноутбука
    alpha = max(14, 82 - i * 7)
    rd.ellipse([CX - r, CY - r, CX + r, CY + r], outline=TEAL + (alpha,), width=3)
rings = rings.filter(ImageFilter.GaussianBlur(1.2))
base = Image.alpha_composite(base.convert('RGBA'), rings).convert('RGB')

# Затемняем левую треть: там лежит белый текст, ему нужен спокойный фон
shade = Image.new('L', (W, H), 0)
sd = ImageDraw.Draw(shade)
for x in range(0, W // 2, 4):
    sd.rectangle([x, 0, x + 4, H], fill=int(150 * (1 - x / (W / 2)) ** 1.4))
base = Image.composite(Image.new('RGB', (W, H), NAVY_DEEP), base, shade)

base.save('shots/cover.png', optimize=True)
print('готово: shots/cover.png', base.size)
