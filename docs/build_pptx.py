from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

# Dark theme colors
BG = RGBColor(0x0F, 0x0F, 0x13)
SURFACE = RGBColor(0x16, 0x16, 0x21)
ACCENT = RGBColor(0xD4, 0xA5, 0x74)
ACCENT_DIM = RGBColor(0xC4, 0x90, 0x5A)
TEXT_PRIMARY = RGBColor(0xF5, 0xF0, 0xEB)
TEXT_SECONDARY = RGBColor(0xC4, 0xB8, 0xA9)
TEXT_MUTED = RGBColor(0x7A, 0x71, 0x68)
ERROR_RED = RGBColor(0xF8, 0x71, 0x71)
SUCCESS_GREEN = RGBColor(0x4A, 0xDE, 0x80)

prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

def set_slide_bg(slide, color=BG):
    bg = slide.background
    fill = bg.fill
    fill.solid()
    fill.fore_color.rgb = color

def add_textbox(slide, left, top, width, height, text, font_size=18,
                color=TEXT_PRIMARY, bold=False, alignment=PP_ALIGN.LEFT,
                font_name='Calibri'):
    txBox = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(width), Inches(height))
    tf = txBox.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = text
    p.font.size = Pt(font_size)
    p.font.color.rgb = color
    p.font.bold = bold
    p.font.name = font_name
    p.alignment = alignment
    return txBox

def add_bullet_list(slide, left, top, width, height, items, font_size=16,
                    color=TEXT_SECONDARY, bullet_color=ACCENT):
    txBox = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(width), Inches(height))
    tf = txBox.text_frame
    tf.word_wrap = True
    for i, item in enumerate(items):
        if i == 0:
            p = tf.paragraphs[0]
        else:
            p = tf.add_paragraph()
        p.text = item
        p.font.size = Pt(font_size)
        p.font.color.rgb = color
        p.font.name = 'Calibri'
        p.space_after = Pt(8)
        p.level = 0
    return txBox

def add_badge(slide, left, top, text, fill_color=ACCENT_DIM):
    width = Inches(len(text) * 0.13 + 0.4)
    height = Inches(0.38)
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), width, height)
    shape.fill.solid()
    shape.fill.fore_color.rgb = fill_color
    shape.line.fill.background()
    shape.shadow.inherit = False
    tf = shape.text_frame
    tf.word_wrap = False
    p = tf.paragraphs[0]
    p.text = text
    p.font.size = Pt(11)
    p.font.color.rgb = TEXT_PRIMARY
    p.font.bold = True
    p.font.name = 'Calibri'
    p.alignment = PP_ALIGN.CENTER
    tf.margin_top = Pt(2)
    tf.margin_bottom = Pt(2)
    return shape

def add_section_label(slide, left, top, text):
    add_textbox(slide, left, top, 4, 0.4, text, font_size=12,
                color=ACCENT, bold=True)

def add_accent_line(slide, left, top, width):
    shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE,
                                    Inches(left), Inches(top),
                                    Inches(width), Inches(0.04))
    shape.fill.solid()
    shape.fill.fore_color.rgb = ACCENT
    shape.line.fill.background()

# ============================================================
# SLIDE 1: Title
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])  # blank
set_slide_bg(slide)

add_textbox(slide, 1.5, 1.2, 10, 0.6, "AI PRESENTATION COACH",
            font_size=14, color=ACCENT, bold=True)
add_accent_line(slide, 1.5, 1.7, 2)
add_textbox(slide, 1.5, 2.0, 10, 1.5, "Speak with\nConfidence.",
            font_size=54, color=TEXT_PRIMARY, bold=True)
add_textbox(slide, 1.5, 3.8, 10, 0.6, "Your personal AI-powered speaking coach",
            font_size=22, color=TEXT_SECONDARY)

add_textbox(slide, 1.5, 4.8, 10, 0.5,
            "A.J. Schoolcraft  |  Joaquin Crespo  |  Emma Sprankle",
            font_size=16, color=TEXT_MUTED)
add_textbox(slide, 1.5, 5.3, 10, 0.4, "LMU ISBA Capstone 2026",
            font_size=14, color=TEXT_MUTED)

badges = ["Software Development", "AI / Machine Learning", "UI/UX Design",
          "Cloud Computing & DevOps", "Database Management"]
x = 1.5
for badge_text in badges:
    s = add_badge(slide, x, 6.0, badge_text)
    x += s.width.inches + 0.15

# ============================================================
# SLIDE 2: Hook
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_bg(slide)

add_textbox(slide, 1.5, 1.0, 10, 0.4, "THE HOOK", font_size=12,
            color=ACCENT, bold=True)
add_accent_line(slide, 1.5, 1.4, 2)

add_textbox(slide, 1.5, 1.8, 10, 1.5,
            '"75% of people rank public speaking\nas their number one fear\n\u2014 above death."',
            font_size=40, color=TEXT_PRIMARY, bold=True)

add_textbox(slide, 1.5, 4.2, 9, 1.5,
            "For entrepreneurs and small business owners, being on camera isn't optional anymore. "
            "Your next customer is scrolling Instagram, TikTok, or YouTube right now.\n\n"
            "If you can't show up and speak clearly, you're invisible.",
            font_size=20, color=TEXT_SECONDARY)

add_textbox(slide, 1.5, 6.0, 9, 0.6,
            "What if the hardest part \u2014 figuring out what to say and getting comfortable on camera \u2014 had a coach built right into your phone?",
            font_size=20, color=ACCENT, bold=True)

# ============================================================
# SLIDE 3: Elevator Pitch
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_bg(slide)

add_section_label(slide, 1.5, 1.0, "ELEVATOR PITCH")
add_accent_line(slide, 1.5, 1.4, 2)

add_textbox(slide, 1.5, 1.8, 10, 1.2,
            "We built an AI-powered web app that helps entrepreneurs and small business owners "
            "write professional pitch scripts and practice delivering them on camera \u2014 all from their phone.",
            font_size=26, color=TEXT_PRIMARY, bold=True)

items = [
    "\U0001F464  Who:  Entrepreneurs, small business owners, job seekers",
    "\U0001F6A8  Problem:  They know their business but struggle to communicate it on video",
    "\U0001F4A1  Solution:  AI generates their script from guided questions, then they record, review, and reshoot"
]
add_bullet_list(slide, 1.5, 3.6, 10, 2.5, items, font_size=20, color=TEXT_SECONDARY)

# ============================================================
# SLIDE 4: The Problem — Who Is Affected
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_bg(slide)

add_section_label(slide, 1.5, 1.0, "THE PROBLEM")
add_accent_line(slide, 1.5, 1.4, 2)

add_textbox(slide, 1.5, 1.8, 10, 0.8,
            "The people we're helping",
            font_size=36, color=TEXT_PRIMARY, bold=True)

add_textbox(slide, 1.5, 2.8, 9.5, 2.5,
            "Picture a small business owner \u2014 maybe they run a bakery, a landscaping company, "
            "or a tutoring service. They're great at what they do.\n\n"
            "But their competitor down the street just posted a polished 30-second pitch on Instagram "
            "and got 200 new followers overnight.\n\n"
            "Our user knows they need to do the same thing. But they sit down, open the camera, and freeze.",
            font_size=20, color=TEXT_SECONDARY)

# ============================================================
# SLIDE 5: Three Walls
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_bg(slide)

add_section_label(slide, 1.5, 0.8, "THE PROBLEM")
add_accent_line(slide, 1.5, 1.15, 2)

add_textbox(slide, 1.5, 1.4, 10, 0.7,
            "Three walls between them and a good video",
            font_size=32, color=TEXT_PRIMARY, bold=True)

# Wall 1
box_y = 2.4
for i, (title, desc) in enumerate([
    ('"What do I even say?"',
     "They know their business inside and out, but turning that into a clear, structured pitch feels impossible."),
    ('"I sound terrible on camera"',
     "They record one take, hate it, and give up. No one told them that even professionals do 10+ takes."),
    ('"I can\'t afford to hire someone"',
     "A professional video costs $500\u2013$2,000+. These are small businesses \u2014 that budget doesn't exist.")
]):
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE,
                                    Inches(1.5), Inches(box_y),
                                    Inches(10), Inches(1.2))
    shape.fill.solid()
    shape.fill.fore_color.rgb = SURFACE
    shape.line.color.rgb = RGBColor(0x2A, 0x2A, 0x3A)
    shape.line.width = Pt(1)

    add_textbox(slide, 1.8, box_y + 0.1, 9.5, 0.4, title,
                font_size=20, color=ACCENT, bold=True)
    add_textbox(slide, 1.8, box_y + 0.55, 9.5, 0.5, desc,
                font_size=16, color=TEXT_SECONDARY)
    box_y += 1.4

add_textbox(slide, 1.5, 6.2, 10, 0.5,
            "The workaround? Avoidance. They just don't post.",
            font_size=18, color=TEXT_MUTED, bold=True)

# ============================================================
# SLIDE 6: What This Costs
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_bg(slide)

add_section_label(slide, 1.5, 1.0, "THE STAKES")
add_accent_line(slide, 1.5, 1.4, 2)

add_textbox(slide, 1.5, 1.8, 10, 0.7,
            "What this costs them", font_size=36, color=TEXT_PRIMARY, bold=True)

costs = [
    "\u2716  Missed visibility on platforms where their customers already are",
    "\u2716  Lost revenue \u2014 customers chose the competitor who showed up on video",
    "\u2716  Hours wasted writing scripts that don't sound like them",
    "\u2716  Confidence erosion \u2014 every failed attempt makes the next one harder",
]
add_bullet_list(slide, 1.5, 2.8, 10, 2.5, costs, font_size=20, color=TEXT_SECONDARY)

add_textbox(slide, 1.5, 5.2, 10, 0.6,
            "The gap isn't talent. It's tooling.",
            font_size=28, color=ACCENT, bold=True)

# ============================================================
# SLIDE 7: Our Solution — Overview
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_bg(slide)

add_section_label(slide, 1.5, 0.8, "THE SOLUTION")
add_accent_line(slide, 1.5, 1.15, 2)

add_textbox(slide, 1.5, 1.4, 10, 0.7,
            "AI Presentation Coach", font_size=36, color=TEXT_PRIMARY, bold=True)
add_textbox(slide, 1.5, 2.1, 10, 0.5,
            "A three-step workflow", font_size=22, color=TEXT_SECONDARY)

steps_data = [
    ("1", "Answer Guided Questions", "11 thoughtful questions about your\nbusiness, audience, and goals"),
    ("2", "Get a Polished Script", "Claude AI turns your answers into a\nnatural, authentic pitch script"),
    ("3", "Record with Teleprompter", "Practice on camera, take as many\ntries as you need, download your best"),
]

x = 1.5
for num, title, desc in steps_data:
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE,
                                    Inches(x), Inches(3.0),
                                    Inches(3.3), Inches(3.2))
    shape.fill.solid()
    shape.fill.fore_color.rgb = SURFACE
    shape.line.color.rgb = RGBColor(0x2A, 0x2A, 0x3A)
    shape.line.width = Pt(1)

    # Number circle
    circle = slide.shapes.add_shape(MSO_SHAPE.OVAL,
                                     Inches(x + 1.2), Inches(3.3),
                                     Inches(0.7), Inches(0.7))
    circle.fill.solid()
    circle.fill.fore_color.rgb = ACCENT
    circle.line.fill.background()
    tf = circle.text_frame
    p = tf.paragraphs[0]
    p.text = num
    p.font.size = Pt(24)
    p.font.color.rgb = BG
    p.font.bold = True
    p.font.name = 'Calibri'
    p.alignment = PP_ALIGN.CENTER
    tf.margin_top = Pt(4)

    add_textbox(slide, x + 0.3, 4.2, 2.7, 0.5, title,
                font_size=18, color=TEXT_PRIMARY, bold=True,
                alignment=PP_ALIGN.CENTER)
    add_textbox(slide, x + 0.3, 4.7, 2.7, 1.2, desc,
                font_size=14, color=TEXT_SECONDARY,
                alignment=PP_ALIGN.CENTER)
    x += 3.6

# ============================================================
# SLIDE 8: Demo — Script Generator
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_bg(slide)

add_section_label(slide, 1.5, 0.8, "LIVE DEMO")
add_accent_line(slide, 1.5, 1.15, 2)

add_textbox(slide, 1.5, 1.4, 10, 0.7,
            "Script Generator", font_size=36, color=TEXT_PRIMARY, bold=True)

add_badge(slide, 1.5, 2.3, "AI / Machine Learning")

add_textbox(slide, 1.5, 3.0, 9.5, 1.2,
            "We use the Claude API to generate scripts. We chose Claude specifically because "
            "it produces responses in warm, encouraging language \u2014 it sounds like a coach, not a robot.",
            font_size=20, color=TEXT_SECONDARY)

add_textbox(slide, 1.5, 4.4, 10, 0.5,
            "The AI answers questions like:", font_size=18, color=TEXT_MUTED)

questions = [
    '"What does your business do in simple terms?"',
    '"Who is your ideal customer?"',
    '"What makes you different from competitors?"',
]
add_bullet_list(slide, 1.8, 5.0, 9, 1.5, questions, font_size=18, color=ACCENT)

add_textbox(slide, 1.5, 6.4, 9, 0.5,
            "\u25B6  Show live: walk through questions \u2192 generate script in real time",
            font_size=16, color=TEXT_MUTED, bold=True)

# ============================================================
# SLIDE 9: Demo — Recording Studio
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_bg(slide)

add_section_label(slide, 1.5, 0.8, "LIVE DEMO")
add_accent_line(slide, 1.5, 1.15, 2)

add_textbox(slide, 1.5, 1.4, 10, 0.7,
            "Recording Studio", font_size=36, color=TEXT_PRIMARY, bold=True)

bx = 1.5
for b in ["UI/UX Design", "Software Development"]:
    s = add_badge(slide, bx, 2.3, b)
    bx += s.width.inches + 0.2

demo_points = [
    "Script loaded notification \u2192 Teleprompter launches",
    "3-second countdown before recording starts",
    "Camera preview in corner while reading script",
    "Stop recording \u2192 review the take",
    "Record another take \u2192 browse all takes",
    "Auto-upload to cloud with save status indicators",
    "Delete bad takes, keep the good ones",
]
add_bullet_list(slide, 1.5, 3.2, 10, 3.5, demo_points, font_size=18, color=TEXT_SECONDARY)

add_textbox(slide, 1.5, 6.4, 9, 0.5,
            "\u25B6  Show live: load script \u2192 record \u2192 review takes",
            font_size=16, color=TEXT_MUTED, bold=True)

# ============================================================
# SLIDE 10: Demo — Library & Sharing
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_bg(slide)

add_section_label(slide, 1.5, 0.8, "LIVE DEMO")
add_accent_line(slide, 1.5, 1.15, 2)

add_textbox(slide, 1.5, 1.4, 10, 0.7,
            "Video Library & Sharing", font_size=36, color=TEXT_PRIMARY, bold=True)

demo_points = [
    "Recordings grid with thumbnails and metadata",
    "Play back any recording",
    'Mark best take as "Final" \u2b50',
    "Download video for local use",
    "Platform-specific sharing guides: Instagram, TikTok, YouTube, Facebook",
]
add_bullet_list(slide, 1.5, 2.6, 10, 3, demo_points, font_size=20, color=TEXT_SECONDARY)

add_textbox(slide, 1.5, 5.6, 9, 0.5,
            "\u25B6  Show live: browse recordings \u2192 play \u2192 download \u2192 share guides",
            font_size=16, color=TEXT_MUTED, bold=True)

# ============================================================
# SLIDE 11: Before & After
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_bg(slide)

add_section_label(slide, 1.5, 0.8, "THE IMPACT")
add_accent_line(slide, 1.5, 1.15, 2)

add_textbox(slide, 1.5, 1.4, 10, 0.7,
            "Before & After", font_size=36, color=TEXT_PRIMARY, bold=True)

before_items = [
    "Stares at blank page, doesn't\nknow what to say",
    "Records one take, hates it,\ngives up",
    "No teleprompter \u2014 loses\ntrain of thought",
    "Pays $500+ for professional\nvideo help",
    "Videos never get posted",
]

after_items = [
    "Answers guided questions, gets\na polished script in seconds",
    "Records multiple takes, picks\nthe best one confidently",
    "Script scrolls on screen\nwhile recording",
    "Free tool accessible from\nany phone",
    "Videos get downloaded and\nshared to social platforms",
]

# Before column
add_textbox(slide, 2.0, 2.2, 4, 0.5, "BEFORE", font_size=16, color=ERROR_RED, bold=True)
add_textbox(slide, 7.5, 2.2, 4, 0.5, "AFTER", font_size=16, color=SUCCESS_GREEN, bold=True)

y = 2.7
for b, a in zip(before_items, after_items):
    # Before box
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE,
                                    Inches(1.5), Inches(y), Inches(5), Inches(0.8))
    shape.fill.solid()
    shape.fill.fore_color.rgb = RGBColor(0x1C, 0x12, 0x12)
    shape.line.color.rgb = RGBColor(0x3A, 0x1A, 0x1A)
    shape.line.width = Pt(1)
    add_textbox(slide, 1.7, y + 0.05, 4.6, 0.7, b, font_size=13, color=TEXT_SECONDARY)

    # After box
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE,
                                    Inches(6.8), Inches(y), Inches(5), Inches(0.8))
    shape.fill.solid()
    shape.fill.fore_color.rgb = RGBColor(0x12, 0x1C, 0x15)
    shape.line.color.rgb = RGBColor(0x1A, 0x3A, 0x22)
    shape.line.width = Pt(1)
    add_textbox(slide, 7.0, y + 0.05, 4.6, 0.7, a, font_size=13, color=TEXT_SECONDARY)

    y += 0.9

# ============================================================
# SLIDE 12: Architecture
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_bg(slide)

add_section_label(slide, 1.5, 0.8, "ARCHITECTURE")
add_accent_line(slide, 1.5, 1.15, 2)

add_textbox(slide, 1.5, 1.4, 10, 0.7,
            "Tech Stack", font_size=36, color=TEXT_PRIMARY, bold=True)

bx = 1.5
for b in ["Cloud Computing & DevOps", "Database Management"]:
    s = add_badge(slide, bx, 2.3, b)
    bx += s.width.inches + 0.2

stack_items = [
    ("Frontend", "React + Vite \u2014 fast builds, modern tooling, component-based UI"),
    ("Backend / Database", "Supabase \u2014 Postgres + Auth + Storage in one platform"),
    ("AI", "Anthropic Claude API \u2014 script generation with natural, coach-like tone"),
    ("Deployment", "Vercel \u2014 automatic builds on every git push"),
    ("Security", "Row Level Security (RLS) policies \u2014 users can only access their own data"),
]

y = 3.2
for label, desc in stack_items:
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE,
                                    Inches(1.5), Inches(y), Inches(10), Inches(0.7))
    shape.fill.solid()
    shape.fill.fore_color.rgb = SURFACE
    shape.line.color.rgb = RGBColor(0x2A, 0x2A, 0x3A)
    shape.line.width = Pt(1)
    add_textbox(slide, 1.8, y + 0.1, 2.2, 0.5, label,
                font_size=15, color=ACCENT, bold=True)
    add_textbox(slide, 4.2, y + 0.1, 7, 0.5, desc,
                font_size=15, color=TEXT_SECONDARY)
    y += 0.8

# ============================================================
# SLIDE 13: Key Decision — Supabase
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_bg(slide)

add_section_label(slide, 1.5, 0.8, "KEY DECISIONS")
add_accent_line(slide, 1.5, 1.15, 2)

add_textbox(slide, 1.5, 1.4, 10, 0.7,
            "Why Supabase", font_size=36, color=TEXT_PRIMARY, bold=True)

add_textbox(slide, 1.5, 2.3, 9.5, 0.6,
            "We needed authentication, a database, and video storage \u2014 without a budget for infrastructure.",
            font_size=18, color=TEXT_SECONDARY)

options = [
    "Firebase \u2014 Popular, but document model felt awkward for relational data",
    "Custom backend (Express + Postgres + S3) \u2014 Max control, too much overhead for capstone timeline",
    "Supabase \u2714 \u2014 Full Postgres, built-in auth, file storage, generous free tier",
]
add_textbox(slide, 1.5, 3.1, 10, 0.4, "Options considered:", font_size=14, color=TEXT_MUTED, bold=True)
add_bullet_list(slide, 1.8, 3.5, 9, 1.5, options, font_size=16, color=TEXT_SECONDARY)

add_textbox(slide, 1.5, 4.8, 10, 0.4, "Why it won:", font_size=14, color=ACCENT, bold=True)
why_items = [
    "Free to run on the web \u2014 critical for a student project that needs to stay live",
    "Real Postgres with SQL \u2014 easy tables, relationships, and RLS policies",
    "RLS enforces security at the database level \u2014 even buggy frontend code can't leak data",
    "Built-in storage buckets for video files with the same security model",
]
add_bullet_list(slide, 1.8, 5.2, 9, 2, why_items, font_size=16, color=TEXT_SECONDARY)

# ============================================================
# SLIDE 14: Key Decision — Claude API
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_bg(slide)

add_section_label(slide, 1.5, 0.8, "KEY DECISIONS")
add_accent_line(slide, 1.5, 1.15, 2)

add_textbox(slide, 1.5, 1.4, 10, 0.7,
            "Why Claude API", font_size=36, color=TEXT_PRIMARY, bold=True)

add_textbox(slide, 1.5, 2.3, 9.5, 0.6,
            "The script generator is the core feature. Output quality determines whether users trust the app.",
            font_size=18, color=TEXT_SECONDARY)

options = [
    "OpenAI GPT-4 \u2014 Industry standard, massive community",
    "Open-source (Llama, Mistral) \u2014 Free but requires hosting infrastructure we didn't have",
    "Anthropic Claude \u2714 \u2014 Strong language quality, conversational and encouraging tone",
]
add_textbox(slide, 1.5, 3.1, 10, 0.4, "Options considered:", font_size=14, color=TEXT_MUTED, bold=True)
add_bullet_list(slide, 1.8, 3.5, 9, 1.5, options, font_size=16, color=TEXT_SECONDARY)

add_textbox(slide, 1.5, 4.8, 10, 0.4, "Why it won:", font_size=14, color=ACCENT, bold=True)
why_items = [
    "Claude reads like a supportive coach, not a corporate chatbot \u2014 tone matters for a confidence app",
    "We built the entire app using Claude Code, so we had firsthand experience with its quality",
    "Consistently better output for our use case: scripts that sound like a real person talking",
]
add_bullet_list(slide, 1.8, 5.2, 9, 2, why_items, font_size=16, color=TEXT_SECONDARY)

# ============================================================
# SLIDE 15: Key Decision — Mobile-First
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_bg(slide)

add_section_label(slide, 1.5, 0.8, "KEY DECISIONS")
add_accent_line(slide, 1.5, 1.15, 2)

add_textbox(slide, 1.5, 1.4, 10, 0.7,
            "Why Mobile-First", font_size=36, color=TEXT_PRIMARY, bold=True)

add_textbox(slide, 1.5, 2.3, 9.5, 0.6,
            "Our target users are most likely to record videos on their phones, not at a desk.",
            font_size=18, color=TEXT_SECONDARY)

options = [
    "Desktop-first, then responsive \u2014 Risks a clunky mobile experience bolted on",
    "Native mobile app (React Native) \u2014 Best mobile UX, but doubles dev scope",
    "Mobile-first web app \u2714 \u2014 Design for phone first, scale up for desktop",
]
add_textbox(slide, 1.5, 3.1, 10, 0.4, "Options considered:", font_size=14, color=TEXT_MUTED, bold=True)
add_bullet_list(slide, 1.8, 3.5, 9, 1.5, options, font_size=16, color=TEXT_SECONDARY)

add_textbox(slide, 1.5, 4.8, 10, 0.4, "Why it won:", font_size=14, color=ACCENT, bold=True)
why_items = [
    "No app store required \u2014 users just open a URL",
    "Recording experience designed for phone form factor where most recording happens",
    "Desktop support comes naturally through responsive CSS",
    "React + Vite + Vercel makes this fast to build and deploy as one codebase",
]
add_bullet_list(slide, 1.8, 5.2, 9, 2, why_items, font_size=16, color=TEXT_SECONDARY)

# ============================================================
# SLIDE 16: Key Decision — Guided Questions
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_bg(slide)

add_section_label(slide, 1.5, 0.8, "KEY DECISIONS")
add_accent_line(slide, 1.5, 1.15, 2)

add_textbox(slide, 1.5, 1.4, 10, 0.7,
            "Guided Questions Over Open Prompts",
            font_size=34, color=TEXT_PRIMARY, bold=True)

add_textbox(slide, 1.5, 2.3, 9.5, 0.6,
            "Users who freeze on camera also freeze on open-ended text boxes.",
            font_size=18, color=TEXT_SECONDARY)

options = [
    'Single text box \u2014 "Describe your business." Simple, but users freeze on open prompts too.',
    "Template selection \u2014 Fast, but produces generic scripts that don't sound personal",
    "Guided questionnaire \u2714 \u2014 11 specific questions, then feed all answers to the AI",
]
add_textbox(slide, 1.5, 3.1, 10, 0.4, "Options considered:", font_size=14, color=TEXT_MUTED, bold=True)
add_bullet_list(slide, 1.8, 3.5, 9, 1.5, options, font_size=16, color=TEXT_SECONDARY)

add_textbox(slide, 1.5, 4.8, 10, 0.4, "Why it won:", font_size=14, color=ACCENT, bold=True)
why_items = [
    "Mirrors what a real coach does \u2014 ask about your business, audience, and story one at a time",
    'Users who can\'t write a script CAN answer "What does your business do?"',
    "AI gets rich, personal context from 11 answers \u2192 scripts that sound like the user, not like AI",
]
add_bullet_list(slide, 1.8, 5.2, 9, 2, why_items, font_size=16, color=TEXT_SECONDARY)

# ============================================================
# SLIDE 17: Reflection
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_bg(slide)

add_section_label(slide, 1.5, 1.0, "REFLECTION")
add_accent_line(slide, 1.5, 1.4, 2)

add_textbox(slide, 1.5, 1.8, 10, 0.7,
            "What I Know Now That\nI Didn't Before",
            font_size=36, color=TEXT_PRIMARY, bold=True)

# Quote box
shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE,
                                Inches(1.5), Inches(3.2), Inches(10), Inches(3.0))
shape.fill.solid()
shape.fill.fore_color.rgb = SURFACE
shape.line.color.rgb = ACCENT_DIM
shape.line.width = Pt(2)

add_textbox(slide, 2.0, 3.5, 9, 2.5,
            '"We assumed the AI script generation would be the hard part. It wasn\'t.\n\n'
            "The hard part was the recording experience \u2014 getting browser camera and microphone APIs "
            "to work reliably across devices, handling media streams that silently fail, "
            "dealing with blob storage quirks, and making the teleprompter feel natural.\n\n"
            'The AI took a week. The recorder took most of the semester."',
            font_size=18, color=TEXT_SECONDARY)

# ============================================================
# SLIDE 18: Closing
# ============================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_bg(slide)

add_accent_line(slide, 1.5, 1.0, 2)

add_textbox(slide, 1.5, 1.2, 10, 0.7,
            "Key Takeaways", font_size=36, color=TEXT_PRIMARY, bold=True)

takeaways = [
    "1.  The gap between knowing your business and communicating it on video is a tooling problem, not a talent problem.",
    "2.  Guided AI beats open-ended AI. Asking the right questions produces better scripts than a blank text box.",
    "3.  Mobile-first isn't just a design preference \u2014 it's meeting users where they already are.",
]
add_bullet_list(slide, 1.5, 2.2, 10, 2, takeaways, font_size=18, color=TEXT_SECONDARY)

add_textbox(slide, 1.5, 4.2, 10, 0.4, "NEXT STEPS", font_size=14, color=ACCENT, bold=True)
next_steps = [
    "User testing with real small business owners to validate the workflow",
    "AI-powered feedback on recorded videos (pacing, filler words, eye contact)",
    "Expanded script templates for different use cases (interviews, investor pitches, product demos)",
]
add_bullet_list(slide, 1.8, 4.6, 9, 1.5, next_steps, font_size=16, color=TEXT_MUTED)

# App URL placeholder
shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE,
                                Inches(4), Inches(6.2), Inches(5), Inches(0.7))
shape.fill.solid()
shape.fill.fore_color.rgb = ACCENT
shape.line.fill.background()
tf = shape.text_frame
p = tf.paragraphs[0]
p.text = "Try it now:  your-deployed-url.vercel.app"
p.font.size = Pt(18)
p.font.color.rgb = BG
p.font.bold = True
p.font.name = 'Calibri'
p.alignment = PP_ALIGN.CENTER
tf.margin_top = Pt(6)

# ============================================================
# Save
# ============================================================
output_path = '/Users/ajschoolcraft/Documents/GitHub/AI-Presentation-Coach/docs/AI-Presentation-Coach-Capstone.pptx'
prs.save(output_path)
print(f'Saved to {output_path}')
