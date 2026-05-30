import os
import shutil
import kagglehub
from PIL import Image

def process_image(src_path, dest_path, size=(800, 600)):
    """Resize and heavily compress image for the web."""
    try:
        with Image.open(src_path) as img:
            # Convert to RGB in case it's RGBA or P
            if img.mode != 'RGB':
                img = img.convert('RGB')
            # Resize while maintaining aspect ratio, padding if necessary
            img.thumbnail(size, Image.Resampling.LANCZOS)
            
            # Save to destination
            os.makedirs(os.path.dirname(dest_path), exist_ok=True)
            img.save(dest_path, "JPEG", quality=85, optimize=True)
            print(f"✅ Optimized and saved: {os.path.basename(dest_path)}")
            return True
    except Exception as e:
        print(f"❌ Error processing {src_path}: {e}")
        return False

def main():
    print("Finding downloaded kaggle dataset 'aman2000jaiswal/agriculture-crop-images'...")
    path = kagglehub.dataset_download("aman2000jaiswal/agriculture-crop-images")
    
    # Mapping our local crop name to the dataset's folder and a chosen image pattern
    # We just pick the first standard image we find
    crop_mappings = {
        'rice': 'rice',
        'wheat': 'wheat',
        'maize': 'maize',
        'sugarcane': 'sugarcane',
    }
    
    frontend_assets_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'frontend', 'assets', 'images', 'crops'))
    
    base_image_dir = os.path.join(path, "crop_images")
    
    for local_name, kaggle_folder in crop_mappings.items():
        src_folder = os.path.join(base_image_dir, kaggle_folder)
        if not os.path.exists(src_folder):
            print(f"Folder not found for {kaggle_folder}")
            continue
        
        # Pick the first .jpeg or .jpg file we can find
        valid_extensions = ('.jpg', '.jpeg', '.png')
        chosen_file = None
        for file in sorted(os.listdir(src_folder)):
            if file.lower().endswith(valid_extensions):
                chosen_file = file
                break
                
        if chosen_file:
            src_path = os.path.join(src_folder, chosen_file)
            dest_path = os.path.join(frontend_assets_dir, f"{local_name}.jpg")
            
            print(f"Processing {local_name}...")
            process_image(src_path, dest_path)
            
    print("\n✅ Done processing images.")

if __name__ == "__main__":
    main()
