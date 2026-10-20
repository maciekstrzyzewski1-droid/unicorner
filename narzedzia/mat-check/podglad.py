# Podgląd modułu jako wieloplikowy artifact: strona z dist/ + potrzebne pliki z dist/_astro (CSS, JS, fonty KaTeX woff2).
# Ścieżki /_astro/… → astro/… (w HTML; artifact nie przyjmuje ścieżek zaczynających się od „_”) i → … (w CSS, bo CSS leży już
# w tym samym katalogu). Bez skryptu Cloudflare.
import re, os, shutil, sys
# Artifact sam dokłada <!doctype>/<head>/<body> (z meta charset i viewport), więc ta „skorupa” strony jest usuwana,
# a tytuł zamieniany na krótką nazwę (3. argument, domyślnie: tytuł strony do pierwszego „ — ”).
# Użycie (z katalogu repo, po npm run build): python3 narzedzia/mat-check/podglad.py matematyka/calka-nieoznaczona.html <katalog wyjściowy> [tytuł]
DIST = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'dist')
SRC = os.path.join(DIST, sys.argv[1])
OUT = sys.argv[2]
shutil.rmtree(OUT, ignore_errors=True); os.makedirs(OUT + '/astro')
h = open(SRC, encoding='utf-8').read()
h = re.sub(r'<script defer src="https://static\.cloudflareinsights\.com[^>]*></script>', '', h)
stary = re.search(r'<title>([^<]*)</title>', h).group(1)
tytul = sys.argv[3] if len(sys.argv) > 3 else re.split(r' — | · ', stary)[0]
h = re.sub(r'<title>[^<]*</title>', '', h, count=1)
h = re.sub(r'<!DOCTYPE html>|</?html[^>]*>|</?head>|</?body[^>]*>|<meta charset="[^"]*">|<meta name="viewport"[^>]*>', '', h, flags=re.I)
# strona ma jeden, ciemny wygląd — szkielet artifactu ustawia color-scheme: light (jasne paski przewijania)
h = f'<title>{tytul}</title>\n<style>:root{{color-scheme:dark}}</style>\n' + h.lstrip()
pliki = set(re.findall(r'/_astro/([^"\')\s]+)', h))
h = h.replace('"/_astro/', '"astro/')
# linki do innych stron serwisu prowadzą na żywą stronę
h = re.sub(r'href="/(?!/)', 'href="https://unicorner.pl/', h)
open(OUT + '/index.html', 'w', encoding='utf-8').write(h)
kolejka, gotowe = list(pliki), set()
while kolejka:
    f = kolejka.pop()
    if f in gotowe: continue
    gotowe.add(f)
    src = f'{DIST}/_astro/{f}'
    if not os.path.exists(src): print('brak', f); continue
    if f.endswith('.css'):
        c = open(src, encoding='utf-8').read()
        for g in re.findall(r'url\(/_astro/([^)]+)\)', c):
            if g.endswith('.woff2'): kolejka.append(g)
        c = re.sub(r'url\(/_astro/', 'url(', c)
        open(f'{OUT}/astro/{f}', 'w', encoding='utf-8').write(c)
    elif f.endswith('.js'):
        c = open(src, encoding='utf-8').read()
        kolejka += re.findall(r'from\s*"\./([^"]+)"', c) + re.findall(r'import\("\./([^"]+)"\)', c)
        if '/_astro/' in c: print('UWAGA: bezwzględna ścieżka w', f)
        shutil.copy(src, f'{OUT}/astro/{f}')
    else:
        shutil.copy(src, f'{OUT}/astro/{f}')
roz = sum(os.path.getsize(os.path.join(d, x)) for d, _, fs in os.walk(OUT) for x in fs)
print(len(gotowe), 'plików w astro/,', round(roz / 1e6, 2), 'MB razem')
