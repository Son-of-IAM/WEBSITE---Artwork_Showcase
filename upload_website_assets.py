import os
import json
from pathlib import Path
import cloudinary
import cloudinary.uploader

# ==========================================
# CLOUDINARY API CONFIGURATION
# ==========================================
cloudinary.config(
    cloud_name = 'mst703ng',
    api_key = '346221871277744',     # Put your API Key here
    api_secret = 'Ug9hGISo-uthpqJSzo_MWZ9p26Q' # Put your API Secret here
)

# Your specific local directory for website images
LOCAL_ASSETS_DIR = Path(r"C:\Users\ayole\OneDrive\Desktop\PROJECTS\Images\STORAGEEEEE_Compressed_WebFiles\OFFICIAL WEBSITE IMAGES\artwork in different locations on website")
OUTPUT_CHEAT_SHEET = Path(r"C:\Users\ayole\OneDrive\Desktop\PROJECTS\Precious\website_assets_links.json")

def upload_static_assets():
    if not LOCAL_ASSETS_DIR.exists():
        print(f"Error: Could not find your folder at:\n{LOCAL_ASSETS_DIR}")
        return

    print("Starting static assets sync...")
    asset_links = {}

    # Scan through the specific static images folder
    for file_path in LOCAL_ASSETS_DIR.rglob('*'):
        if file_path.is_file() and file_path.suffix.lower() in ['.webp', '.jpg', '.png']:
            
            # Keep the subfolder structure (e.g., "exhibition", "main about page")
            rel_path = file_path.relative_to(LOCAL_ASSETS_DIR)
            
            # Place them in a dedicated 'website_assets' folder in Cloudinary
            cloud_folder = f"website_assets/{rel_path.parent.as_posix()}"
            title = file_path.name

            print(f"Uploading: {title} -> {cloud_folder} ...", end=" ", flush=True)

            try:
                response = cloudinary.uploader.upload(
                    str(file_path),
                    folder=cloud_folder,
                    use_filename=True,
                    unique_filename=False,
                    overwrite=True,
                    resource_type="image"
                )
                
                secure_url = response['secure_url']
                print("DONE")
                
                # Store the URL categorized by the folder it came from
                folder_name = rel_path.parent.as_posix()
                if folder_name not in asset_links:
                    asset_links[folder_name] = []
                    
                asset_links[folder_name].append({
                    "filename": title,
                    "url": secure_url
                })
                
            except Exception as e:
                print(f"FAILED: {e}")

    # Create the URL cheat sheet
    with open(OUTPUT_CHEAT_SHEET, 'w', encoding='utf-8') as f:
        json.dump(asset_links, f, indent=4)

    print(f"\nDone! All live URLs have been saved to: {OUTPUT_CHEAT_SHEET}")
    print("Open this file to copy/paste your links into your HTML/CSS.")

if __name__ == "__main__":
    upload_static_assets()