import os
from bs4 import BeautifulSoup
import re

files_to_clean = [
    'index.html',
    'frontend/html/weather.html',
    'frontend/html/marketplace.html',
    'frontend/html/market-demand.html',
    'frontend/html/crop-suggestion.html'
]

def clean_html(file_path):
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Using BeautifulSoup to parse
    soup = BeautifulSoup(content, 'html.parser')
    
    # 1. Remove manifest link
    manifests = soup.find_all('link', rel='manifest')
    for m in manifests:
        m.decompose()

    # 2. Remove scripts with serviceWorker
    for script in soup.find_all('script'):
        if script.string and 'navigator.serviceWorker.register' in script.string:
            script.decompose()
        # 3. Remove install-app.js script
        elif script.get('src') and 'install-app.js' in script.get('src'):
            script.decompose()

    # 4. Remove desktop Download App button wrapper
    desktop_btn = soup.find(id='installAppBtn')
    if desktop_btn:
        # Check if it has a wrapper or if we should just remove the button itself or its parent block
        # Usually it's in a wrapper div with classes like border-l etc., let's remove the wrapper if it's the only thing inside, or just the button.
        parent = desktop_btn.parent
        if parent.name == 'div' and len(parent.find_all(recursive=False)) == 1:
             parent.decompose()
        else:
             desktop_btn.decompose()

    # 5. Remove mobile Download App button wrapper
    mobile_btn = soup.find(id='installAppBtnMobile')
    if mobile_btn:
        parent = mobile_btn.parent
        if parent.name == 'div' and len(parent.find_all(recursive=False)) == 1:
             parent.decompose()
        else:
             mobile_btn.decompose()

    # Optionally, remove comments related to the install button
    # but we can rely on bs4 to write out the filtered HTML. We'll format it back reasonably.
    
    # Actually, BeautifulSoup might alter format of the whole file. 
    # Let's use regex for a safer non-breaking replacement if we want to preserve exact formatting.
    pass

# Better approach is regex for exact replacements in raw HTML string
def clean_html_regex(file_path):
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Manifest
    html = re.sub(r'<!--[^>]*manifest[^>]*-->\s*', '', html, flags=re.IGNORECASE)
    html = re.sub(r'<link\s+rel="manifest"\s+href="[^"]*manifest\.json">\s*', '', html)
    html = re.sub(r'<link[^>]*rel="manifest"[^>]*>\s*', '', html)

    # 2. Service worker script
    html = re.sub(r'<script>\s*if\s*\(\s*\'serviceWorker\'\s*in\s*navigator[^\<]*</script>\s*', '', html, flags=re.DOTALL)
    # Generic service worker script removal
    html = re.sub(r'<script[^>]*>[\s\S]*?navigator\.serviceWorker\.register[\s\S]*?</script>\s*', '', html, flags=re.IGNORECASE)

    # 3. install-app script
    html = re.sub(r'<script\s+src="[^"]*install-app\.js"\s?(?:defer)?[^>]*></script>\s*', '', html)
    html = re.sub(r'<script[^>]*src="[^"]*install-app\.js"[^>]*></script>\s*', '', html)

    # 4. Desktop install button wrapper
    html = re.sub(r'<!-- Download App Button[^>]*-->\s*<div[^>]*>\s*<button[^>]*id="installAppBtn"[^>]*>[\s\S]*?</button>\s*</div>\s*', '', html)
    html = re.sub(r'<div[^>]*>\s*<button[^>]*id="installAppBtn"[^>]*>[\s\S]*?</button>\s*</div>\s*', '', html)
    html = re.sub(r'<button[^>]*id="installAppBtn"[^>]*>[\s\S]*?</button>\s*', '', html)

    # 5. Mobile install button wrapper
    html = re.sub(r'<!-- Download App Button \(Mobile\)[^>]*-->\s*<div[^>]*>\s*<button[^>]*id="installAppBtnMobile"[^>]*>[\s\S]*?</button>\s*</div>\s*', '', html)
    html = re.sub(r'<div[^>]*>\s*<button[^>]*id="installAppBtnMobile"[^>]*>[\s\S]*?</button>\s*</div>\s*', '', html)
    html = re.sub(r'<button[^>]*id="installAppBtnMobile"[^>]*>[\s\S]*?</button>\s*', '', html)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Cleaned {file_path}")

for fh in files_to_clean:
    clean_html_regex(fh)
