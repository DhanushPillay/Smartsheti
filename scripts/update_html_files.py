import os
import re

html_files = [
    'crop_suggestion page(2).html',
    'crop_price_trends.html', 
    'market_demand.html',
    'market_demand_fixed.html',
    'price_monitor.html',
    'debug_panel.html',
    'test_python_integration.html'
]

for html_file in html_files:
    html_path = f'frontend/html/{html_file}'
    if os.path.exists(html_path):
        with open(html_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        css_filename = html_file.replace('.html', '.css')
        
        # Remove the style tag and its content
        content = re.sub(r'<style>.*?</style>', '', content, flags=re.DOTALL)
        
        # Find the head section and add CSS link
        if '</head>' in content:
            css_link = f'<link rel="stylesheet" href="../css/{css_filename}"/>'
            content = content.replace('</head>', f'    {css_link}\n</head>')
        
        # Write updated HTML file
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f'Updated: {html_file}')
