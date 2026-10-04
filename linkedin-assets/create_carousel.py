from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import math


OUT = Path(__file__).resolve().parent
W, H = 1080, 1350
BG = "#071810"
BG2 = "#0D281A"
LIME = "#C8F27D"
GREEN = "#67A878"
WHITE = "#F5F7EE"
MUTED = "#B1C0B3"
DIM = "#829588"
PANEL = "#10291C"
PANEL2 = "#153523"
LINE = "#33513B"

FONT_REG = r"C:\Windows\Fonts\segoeui.ttf"
FONT_BOLD = r"C:\Windows\Fonts\segoeuib.ttf"


def font(size, bold=False):
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REG, size)


def canvas():
    image = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(image)
    for y in range(H):
        blend = y / H
        c1 = (7, 24, 16)
        c2 = (12, 37, 24)
        color = tuple(round(a * (1 - blend) + b * blend) for a, b in zip(c1, c2))
        draw.line((0, y, W, y), fill=color)
    draw.ellipse((760, -330, 1370, 280), fill="#0D2B1A")
    draw.ellipse((-350, 1030, 370, 1740), fill="#0A2116")
    return image, ImageDraw.Draw(image)


def round_box(draw, box, fill=PANEL, outline=None, radius=26, width=2):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def text(draw, xy, value, size=28, fill=WHITE, bold=False, anchor=None, spacing=8):
    draw.multiline_text(xy, value, font=font(size, bold), fill=fill, anchor=anchor, spacing=spacing)


def wrapped(draw, xy, value, max_width, size=24, fill=MUTED, bold=False, spacing=9):
    f = font(size, bold)
    words = value.split()
    lines, current = [], ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if draw.textlength(candidate, font=f) <= max_width or not current:
            current = candidate
        else:
            lines.append(current)
            current = word
    if current:
        lines.append(current)
    draw.multiline_text(xy, "\n".join(lines), font=f, fill=fill, spacing=spacing)


def brand(draw, page, section):
    draw.rounded_rectangle((72, 64, 124, 116), radius=16, fill=LIME)
    text(draw, (98, 90), "K", size=29, fill=BG, bold=True, anchor="mm")
    text(draw, (145, 72), "KHETWISE", size=23, fill=WHITE, bold=True)
    text(draw, (145, 101), "SMART AGRICULTURE", size=13, fill=DIM, bold=True)
    draw.rounded_rectangle((850, 75, 1008, 113), radius=19, fill=PANEL2)
    text(draw, (929, 94), f"{page}  /  4   ·   {section}", size=13, fill=LIME, bold=True, anchor="mm")


def footer(draw):
    draw.line((72, 1260, 1008, 1260), fill=LINE, width=2)
    text(draw, (72, 1284), "A farmer-focused decision-support project", size=16, fill=DIM)
    text(draw, (1008, 1284), "KHETWISE  ·  2026", size=14, fill=DIM, bold=True, anchor="ra")


def arrow(draw, start, end, color=LIME, width=5):
    draw.line((start, end), fill=color, width=width)
    angle = math.atan2(end[1] - start[1], end[0] - start[0])
    size = 15
    left = (end[0] - size * math.cos(angle - math.pi / 6), end[1] - size * math.sin(angle - math.pi / 6))
    right = (end[0] - size * math.cos(angle + math.pi / 6), end[1] - size * math.sin(angle + math.pi / 6))
    draw.polygon((end, left, right), fill=color)


def save(image, filename):
    image.save(OUT / filename, optimize=True)


def slide_cover():
    image, draw = canvas()
    brand(draw, 1, "OVERVIEW")
    draw.rounded_rectangle((74, 183, 391, 229), radius=22, fill="#1A3824")
    text(draw, (95, 194), "AGRICULTURE  ×  PRACTICAL AI", size=15, fill=LIME, bold=True)
    text(draw, (72, 281), "Better-informed\nfarming decisions,\nconnected in one place.", size=63, fill=WHITE, bold=True, spacing=7)
    wrapped(draw, (76, 530), "Meet KhetWise: a smart agriculture platform connecting farm context, forecasts and machine-learning tools.", 850, size=25, fill=MUTED, spacing=10)

    round_box(draw, (72, 715, 1008, 1078), fill="#0E2519", outline=LINE, radius=32)
    text(draw, (112, 758), "ONE WORKSPACE. FOUR USEFUL LAYERS.", size=16, fill=LIME, bold=True)
    items = [
        (115, "01", "Farm context", "Location · field data"),
        (350, "02", "Local weather", "Current · 7-day view"),
        (585, "03", "ML tools", "Crop · inputs · price"),
        (820, "04", "Farmer help", "Guided · voice ready"),
    ]
    for x, number, title, subtitle in items:
        draw.ellipse((x, 835, x + 60, 895), fill="#263F2B")
        text(draw, (x + 30, 865), number, size=18, fill=LIME, bold=True, anchor="mm")
        text(draw, (x, 921), title, size=21, fill=WHITE, bold=True)
        text(draw, (x, 958), subtitle, size=15, fill=DIM)
    for x in (300, 535, 770):
        arrow(draw, (x, 866), (x + 31, 866), color=GREEN, width=3)

    text(draw, (76, 1140), "From a farmer’s question to a clearer next step.", size=24, fill=WHITE, bold=True)
    footer(draw)
    save(image, "01-khetwise-overview.png")


def slide_architecture():
    image, draw = canvas()
    brand(draw, 2, "ARCHITECTURE")
    text(draw, (72, 168), "How KhetWise is connected", size=48, fill=WHITE, bold=True)
    text(draw, (75, 232), "Separate services work together behind one farmer dashboard.", size=21, fill=MUTED)

    round_box(draw, (180, 310, 900, 455), fill="#173523", outline=GREEN, radius=28)
    draw.ellipse((220, 354, 278, 412), fill=LIME)
    text(draw, (249, 383), "F", size=26, fill=BG, bold=True, anchor="mm")
    text(draw, (310, 344), "Farmer", size=27, fill=WHITE, bold=True)
    text(draw, (310, 389), "Web browser · English / Hindi · voice input", size=17, fill=MUTED)
    arrow(draw, (540, 464), (540, 515))

    round_box(draw, (180, 520, 900, 680), fill="#132E1E", outline=LINE, radius=28)
    text(draw, (224, 554), "REACT + VITE", size=15, fill=LIME, bold=True)
    text(draw, (224, 586), "KhetWise dashboard", size=29, fill=WHITE, bold=True)
    text(draw, (224, 632), "Farm pages · predictions · weather · guided assistant", size=17, fill=MUTED)

    # Fan out to the independent service layer.
    draw.line((540, 680, 540, 729), fill=GREEN, width=4)
    draw.line((170, 729, 910, 729), fill=GREEN, width=4)
    for x in (170, 417, 663, 910):
        arrow(draw, (x, 729), (x, 769), color=GREEN, width=4)

    nodes = [
        (72, 772, 290, 960, "EXPRESS API", "Accounts &\nfarm data", "JWT · MongoDB"),
        (319, 772, 537, 960, "FASTAPI", "Prediction\nendpoints", "Python · REST"),
        (565, 772, 783, 960, "OPEN-METEO", "Geocoded local\nforecast", "Current · 7 days"),
        (812, 772, 1008, 960, "GUIDED HELP", "Common issue\nresponses", "Browser voice"),
    ]
    for x1, y1, x2, y2, tag, title, detail in nodes:
        round_box(draw, (x1, y1, x2, y2), fill=PANEL, outline=LINE, radius=23)
        text(draw, (x1 + 20, y1 + 19), tag, size=12, fill=LIME, bold=True)
        text(draw, (x1 + 20, y1 + 62), title, size=21, fill=WHITE, bold=True, spacing=5)
        text(draw, (x1 + 20, y2 - 37), detail, size=13, fill=DIM)

    arrow(draw, (418, 963), (418, 1010), color=GREEN, width=3)
    arrow(draw, (662, 963), (662, 1010), color=GREEN, width=3)
    round_box(draw, (319, 1018, 537, 1152), fill="#10271A", outline=LINE, radius=21)
    text(draw, (342, 1040), "MODEL FILES", size=12, fill=LIME, bold=True)
    text(draw, (342, 1075), "scikit-learn", size=21, fill=WHITE, bold=True)
    text(draw, (342, 1110), "Crop · fertilizer · growth", size=13, fill=DIM)
    round_box(draw, (565, 1018, 783, 1152), fill="#10271A", outline=LINE, radius=21)
    text(draw, (588, 1040), "DATA STORE", size=12, fill=LIME, bold=True)
    text(draw, (588, 1075), "MongoDB", size=21, fill=WHITE, bold=True)
    text(draw, (588, 1110), "Users · app records", size=13, fill=DIM)

    footer(draw)
    save(image, "02-platform-architecture.png")


def slide_farmer_flow():
    image, draw = canvas()
    brand(draw, 3, "FARMER FLOW")
    text(draw, (72, 168), "A farmer’s path through KhetWise", size=46, fill=WHITE, bold=True)
    text(draw, (75, 232), "A clear journey from a question to practical next steps.", size=21, fill=MUTED)

    steps = [
        (302, "01", "Ask a question", "Type a concern or speak it. Voice input is transcribed by the browser.", "TEXT  /  VOICE"),
        (498, "02", "Add farm context", "Saved location, regional soil guide and a recent forecast can inform the view.", "LOCATION  /  WEATHER"),
        (694, "03", "Choose a useful tool", "Crop, fertilizer, growth, price and symptom tools support focused decisions.", "GUIDED HELP  /  ML"),
        (890, "04", "Review the next step", "See a model estimate or common-issue checklist, then cross-check locally.", "FIELD CHECK  /  KVK"),
    ]
    for y, num, title, desc, tag in steps:
        round_box(draw, (105, y, 975, y + 142), fill="#10291C", outline=LINE, radius=25)
        draw.ellipse((137, y + 39, 201, y + 103), fill="#263F2B")
        text(draw, (169, y + 71), num, size=20, fill=LIME, bold=True, anchor="mm")
        text(draw, (230, y + 23), title, size=26, fill=WHITE, bold=True)
        wrapped(draw, (230, y + 64), desc, 650, size=17, fill=MUTED, spacing=6)
        text(draw, (230, y + 112), tag, size=12, fill=LIME, bold=True)
    for y in (449, 645, 841):
        arrow(draw, (540, y), (540, y + 35), color=GREEN, width=4)

    round_box(draw, (105, 1080, 975, 1197), fill="#213822", outline=None, radius=23)
    text(draw, (140, 1105), "BUILT FOR SUPPORT, NOT CERTAINTY", size=14, fill=LIME, bold=True)
    wrapped(draw, (140, 1140), "Predictions are estimates. The assistant gives general first steps—not a confirmed diagnosis or pesticide prescription.", 790, size=17, fill=WHITE, spacing=6)
    footer(draw)
    save(image, "03-farmer-journey.png")


def slide_capabilities():
    image, draw = canvas()
    brand(draw, 4, "CAPABILITIES")
    text(draw, (72, 168), "One platform. Practical tools.", size=48, fill=WHITE, bold=True)
    text(draw, (75, 232), "KhetWise brings farm information and focused services together.", size=21, fill=MUTED)

    cards = [
        (72, 316, 520, 535, "01", "Recommend", "Crop suitability from soil and growing-condition inputs.", "CROP  ·  FERTILIZER"),
        (560, 316, 1008, 535, "02", "Estimate", "Yield per area and modal market price from entered data.", "YIELD  ·  MARKET PRICE"),
        (72, 548, 520, 767, "03", "Understand", "Local forecasts, a regional soil guide and symptom screening.", "WEATHER  ·  FIELD"),
        (560, 548, 1008, 767, "04", "Get guided help", "English and Hindi common-issue guidance with voice input.", "FARM ASSISTANT"),
    ]
    for x1, y1, x2, y2, n, title, desc, tag in cards:
        round_box(draw, (x1, y1, x2, y2), fill="#10291C", outline=LINE, radius=26)
        draw.ellipse((x1 + 26, y1 + 25, x1 + 75, y1 + 74), fill="#263F2B")
        text(draw, (x1 + 50, y1 + 50), n, size=15, fill=LIME, bold=True, anchor="mm")
        text(draw, (x1 + 27, y1 + 94), title, size=25, fill=WHITE, bold=True)
        wrapped(draw, (x1 + 27, y1 + 137), desc, x2 - x1 - 53, size=16, fill=MUTED, spacing=6)
        text(draw, (x1 + 27, y2 - 31), tag, size=12, fill=LIME, bold=True)

    text(draw, (74, 827), "THE DECISION LOOP", size=15, fill=LIME, bold=True)
    stages = [(74, "Farm inputs"), (330, "KhetWise tools"), (586, "Useful insight"), (842, "Local validation")]
    for i, (x, label) in enumerate(stages):
        round_box(draw, (x, 875, x + 186, 960), fill="#173523", outline=None, radius=22)
        text(draw, (x + 93, 918), label, size=16, fill=WHITE, bold=True, anchor="mm")
        if i < len(stages) - 1:
            arrow(draw, (x + 193, 918), (x + 244, 918), color=GREEN, width=4)

    text(draw, (74, 1045), "BUILT WITH", size=14, fill=DIM, bold=True)
    text(draw, (74, 1084), "React  ·  Express  ·  MongoDB  ·  FastAPI  ·  scikit-learn", size=23, fill=WHITE, bold=True)
    wrapped(draw, (74, 1134), "A learning project focused on making agricultural data and tools easier to use.", 880, size=18, fill=MUTED, spacing=7)
    footer(draw)
    save(image, "04-khetwise-capabilities.png")


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    slide_cover()
    slide_architecture()
    slide_farmer_flow()
    slide_capabilities()
    print(f"Created four 1080x1350 carousel slides in {OUT}")


if __name__ == "__main__":
    main()
