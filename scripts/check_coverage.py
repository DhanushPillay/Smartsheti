import re
import json
import os

# 1. Extract mappings from real_agmarknet_scraper.py
scraper_path = r"e:\Personal Projects\farmer\backend\python\real_agmarknet_scraper.py"
with open(scraper_path, 'r', encoding='utf-8') as f:
    scraper_content = f.read()

# Naive extraction of the dict - just looking for the text block because proper import might fail due to deps
# Looking for self.crop_mappings = { ... }
match = re.search(r"self\.crop_mappings\s*=\s*({[^}]+})", scraper_content, re.DOTALL)
if match:
    # Cleanup to make it valid python dict str if needed, or just eval
    # It might contain comments or simplified syntax. 
    # Let's clean it up carefully or just parse the lines.
    mappings_str = match.group(1)
    # Remove lines starting with #
    mappings_lines = [line for line in mappings_str.split('\n') if not line.strip().startswith('#')]
    mappings_str_clean = '\n'.join(mappings_lines)
    try:
        crop_mappings = eval(mappings_str_clean)
        print(f"Found {len(crop_mappings)} crop categories in scraper.")
    except Exception as e:
        print(f"Error parsing mappings: {e}")
        crop_mappings = {}
else:
    print("Could not find crop_mappings in scraper file.")
    crop_mappings = {}

# 2. Extract keys from crop_images.js
images_path = r"e:\Personal Projects\farmer\frontend\js\crop_images.js"
with open(images_path, 'r', encoding='utf-8') as f:
    images_content = f.read()

# Extract keys using regex
image_keys = re.findall(r"^\s*'([^']+)'\s*:", images_content, re.MULTILINE)
image_keys_set = set(k.lower() for k in image_keys)

# 3. Check coverage
print("\n--- Missing Image Mappings ---")
missing_count = 0
for category, aliases in crop_mappings.items():
    print(f"\nCategory: {category}")
    for alias in aliases:
        # The frontend lookup tries exact, then partial. 
        # But if alias is "Gehun" and keys are ["Wheat"], "Gehun" != "Wheat" and ("Gehun" not in "Wheat")
        # So check if alias exists in keys
        if alias.lower() not in image_keys_set:
            # Check for partial match logic simulation
            # (normalizedCropName.includes(key.toLowerCase()))
            # e.g. alias "Wheat (Dara)". Key "Wheat". "wheat (dara)".includes("wheat") -> True.
            covered = False
            for key in image_keys_set:
                if key in alias.lower(): # Key is substring of alias
                    covered = True
                    break
            
            if not covered:
                print(f"  ❌ {alias} (No matching image key found)")
                missing_count += 1
            else:
                print(f"  ✅ {alias} (Covered by partial match)")
        else:
            print(f"  ✅ {alias} (Exact match)")

print(f"\nTotal potential missing mappings: {missing_count}")
