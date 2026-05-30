import kagglehub
import os

def main():
    print("Downloading kaggle dataset 'aman2000jaiswal/agriculture-crop-images'...")
    path = kagglehub.dataset_download("aman2000jaiswal/agriculture-crop-images")
    print("Dataset downloaded to:", path)
    
    print("Exploring structure...")
    for root, dirs, files in os.walk(path):
        level = root.replace(path, '').count(os.sep)
        indent = ' ' * 4 * (level)
        print('{}{}/'.format(indent, os.path.basename(root)))
        subindent = ' ' * 4 * (level + 1)
        for f in files[:5]: # just print a few files per dir
            print('{}{}'.format(subindent, f))
        if len(files) > 5:
            print('{}... and {} more files'.format(subindent, len(files) - 5))

if __name__ == "__main__":
    main()
