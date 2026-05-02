import os
import re

files = [
    'index.html',
    'frontend/html/weather.html',
    'frontend/html/marketplace.html',
    'frontend/html/market-demand.html',
    'frontend/html/crop-suggestion.html'
]

for file_path in files:
    if not os.path.exists(file_path):
        continue
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    orig_length = len(content)

    # 1. Remove manifest link
    content = re.sub(r'<link[^>]*rel=["\']manifest["\'][^>]*>', '', content)
    
    # 2. Remove Service Worker block
    content = re.sub(r'<script>\s*if\s*\(\'serviceWorker\'\s*in\s*navigator\)\s*\{\s*window\.addEventListener\([^\}]+\}\);\s*\}\s*</script>', '', content)
    
    # 3. Remove install-app.js
    content = re.sub(r'<script[^>]*src=["\'][^"\']*install-app\.js["\'][^>]*></script>', '', content)

    # 4. Remove Desktop Button Block
    # Finding from <!-- Download App Button --> up to </button>
    content = re.sub(r'<!--\s*Download App Button\s*-->\s*<button[ \n\t]*id=["\']installAppBtn["\'].*?</button>', '', content, flags=re.DOTALL)

    # 5. Remove Mobile Button Block
    # Finding <!-- Download App Button (Mobile) --> block
    content = re.sub(r'<!--\s*Download App Button \(Mobile\)\s*-->\s*<div class=["\']px-2 pb-2["\']>\s*<button id=["\']installAppBtnMobile["\'].*?</button>\s*</div>', '', content, flags=re.DOTALL)

    # Also clean up empty lines that might have been left behind
    content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)

    if len(content) != orig_length:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Cleaned {file_path}")
    else:
        print(f"No changes matched in {file_path}")
