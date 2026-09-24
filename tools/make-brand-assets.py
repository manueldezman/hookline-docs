# Regenerates every image in static/img from code.
# Setup: pip install cairosvg pillow
# Run from the project root: python3 tools/make-brand-assets.py
import cairosvg
from PIL import Image
import io, pathlib

OUT = pathlib.Path('static/img')

def mark(tile_grad, hook, dot, rx=14, scale=None):
    """Hookline mark on a 64x64 canvas. `scale` shrinks the glyph for maskable icons."""
    g_open = f'<g transform="translate({32-32*scale:.2f} {32-32*scale:.2f}) scale({scale})">' if scale else '<g>'
    return f'''<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{tile_grad[0]}"/><stop offset="1" stop-color="{tile_grad[1]}"/></linearGradient></defs>
<rect width="64" height="64" rx="{rx}" fill="url(#g)"/>
{g_open}<path d="M42 16V38A10 10 0 0 1 22 38" fill="none" stroke="{hook}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="22" cy="25" r="4.5" fill="{dot}"/></g>'''

def svg(inner, title, size=64, view=64):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {view} {view}" width="{size}" height="{size}" role="img" aria-labelledby="t">
<title id="t">{title}</title>
{inner}
</svg>
'''

LIGHT = ('#6366F1', '#4338CA')
DARK  = ('#C7D2FE', '#818CF8')

(OUT/'logo.svg').write_text(svg(mark(LIGHT, '#FFFFFF', '#22D3EE'), 'Hookline logo'))
(OUT/'logo-dark.svg').write_text(svg(mark(DARK, '#0B1020', '#FFFFFF'), 'Hookline logo'))
(OUT/'favicon.svg').write_text(svg(mark(LIGHT, '#FFFFFF', '#22D3EE'), 'Hookline'))

# full-bleed variants for OS icons (the OS applies its own corner rounding)
full = svg(mark(LIGHT, '#FFFFFF', '#22D3EE', rx=0), 'Hookline')
maskable = svg(mark(LIGHT, '#FFFFFF', '#22D3EE', rx=0, scale=0.78), 'Hookline')

def png(svg_text, size, path):
    cairosvg.svg2png(bytestring=svg_text.encode(), write_to=str(path), output_width=size, output_height=size)

png(full, 180, OUT/'apple-touch-icon.png')
png(maskable, 192, OUT/'icon-192.png')
png(maskable, 512, OUT/'icon-512.png')

# favicon.ico with three sizes
big = Image.open(io.BytesIO(cairosvg.svg2png(bytestring=(OUT/'favicon.svg').read_text().encode(), output_width=256, output_height=256)))
big.save(OUT/'favicon.ico', sizes=[(16,16),(32,32),(48,48)])

# ---- Social card (1200x630) ----
card = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" role="img" aria-labelledby="t d">
<title id="t">Hookline developer docs</title>
<desc id="d">Hookline logo with the tagline: Deliver every webhook, once, securely.</desc>
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0B1020"/><stop offset="1" stop-color="#1E1B4B"/></linearGradient>
<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6366F1"/><stop offset="1" stop-color="#4338CA"/></linearGradient>
</defs>
<rect width="1200" height="630" fill="url(#bg)"/>
<g opacity="0.35" fill="none" stroke="#818CF8" stroke-width="2" stroke-dasharray="4 10" stroke-linecap="round">
<path d="M700 520 C 820 520 860 300 1000 300 S 1130 120 1200 110"/>
</g>
<g fill="#22D3EE"><circle cx="1000" cy="300" r="9"/><circle cx="1130" cy="150" r="6" opacity="0.7"/><circle cx="880" cy="440" r="5" opacity="0.5"/></g>
<g transform="translate(96 195) scale(3.1)">
<rect width="64" height="64" rx="14" fill="url(#g)"/>
<path d="M42 16V38A10 10 0 0 1 22 38" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="22" cy="25" r="4.5" fill="#22D3EE"/>
</g>
<text x="330" y="325" font-family="Inter, 'Segoe UI', 'DejaVu Sans', Arial, sans-serif" font-size="104" font-weight="700" fill="#FFFFFF">Hookline</text>
<text x="334" y="392" font-family="Inter, 'Segoe UI', 'DejaVu Sans', Arial, sans-serif" font-size="36" fill="#C7D2FE">Deliver every webhook, once, securely.</text>
<rect x="334" y="440" width="196" height="46" rx="23" fill="none" stroke="#818CF8" stroke-width="2"/>
<text x="432" y="472" text-anchor="middle" font-family="Inter, 'Segoe UI', 'DejaVu Sans', Arial, sans-serif" font-size="22" fill="#C7D2FE">Developer docs</text>
</svg>
'''
(OUT/'hookline-social-card.svg').write_text(card)
cairosvg.svg2png(bytestring=card.encode(), write_to=str(OUT/'hookline-social-card.png'), output_width=1200, output_height=630)

# ---- Diagram for the intro page ----
F = "system-ui, -apple-system, 'Segoe UI', Roboto, 'DejaVu Sans', Arial, sans-serif"
diagram = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 250" width="880" height="250" role="img" aria-labelledby="t d">
<title id="t">How Hookline delivers an event</title>
<desc id="d">Your app sends an event to the Hookline API. Hookline signs and queues it, then delivers it to each subscribed endpoint and retries failures.</desc>
<defs><marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#64748B"/></marker></defs>
<rect x="1" y="1" width="878" height="248" rx="16" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2"/>
<g font-family="{F}" text-anchor="middle">
<rect x="36" y="70" width="190" height="110" rx="12" fill="#FFFFFF" stroke="#6366F1" stroke-width="2"/>
<text x="131" y="118" font-size="20" font-weight="700" fill="#0F172A">Your app</text>
<text x="131" y="146" font-size="14" fill="#475569">Sends one event</text>

<rect x="345" y="55" width="190" height="140" rx="12" fill="#4F46E5"/>
<text x="440" y="108" font-size="22" font-weight="700" fill="#FFFFFF">Hookline</text>
<text x="440" y="138" font-size="14" fill="#E0E7FF">Sign · Queue · Retry</text>
<text x="440" y="162" font-size="14" fill="#E0E7FF">30-day delivery log</text>

<rect x="654" y="34" width="190" height="52" rx="10" fill="#FFFFFF" stroke="#6366F1" stroke-width="2"/>
<text x="749" y="66" font-size="16" font-weight="600" fill="#0F172A">Endpoint A</text>
<rect x="654" y="99" width="190" height="52" rx="10" fill="#FFFFFF" stroke="#6366F1" stroke-width="2"/>
<text x="749" y="131" font-size="16" font-weight="600" fill="#0F172A">Endpoint B</text>
<rect x="654" y="164" width="190" height="52" rx="10" fill="#FFFFFF" stroke="#6366F1" stroke-width="2"/>
<text x="749" y="196" font-size="16" font-weight="600" fill="#0F172A">Endpoint C</text>

<text x="285" y="104" font-size="13" fill="#475569" font-family="{F}">POST /v1/events</text>
<text x="594" y="104" font-size="13" fill="#475569" font-family="{F}">signed webhook</text>
</g>
<g stroke="#64748B" stroke-width="2" fill="none" marker-end="url(#a)">
<path d="M232 125H339"/>
<path d="M541 110C580 90 610 60 648 60"/>
<path d="M541 125H648"/>
<path d="M541 140C580 160 610 190 648 190"/>
</g>
</svg>
'''
(OUT/'how-it-works.svg').write_text(diagram)
cairosvg.svg2png(bytestring=diagram.encode(), write_to='/tmp/how-it-works-preview.png', output_width=880)
print('assets ok')
