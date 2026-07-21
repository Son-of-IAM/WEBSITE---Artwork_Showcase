import os
import json
import re
from pathlib import Path
import cloudinary
import cloudinary.uploader

# ==========================================
# 1. CLOUDINARY API CONFIGURATION
# ==========================================
# Plug in your newly generated dashboard credentials
cloudinary.config(
    cloud_name = 'mst703ng',
    api_key = '346221871277744',
    api_secret = 'Ug9hGISo-uthpqJSzo_MWZ9p26Q'
)

# Set your exact local source and output paths
LOCAL_PORTFOLIO_DIR = Path(r"C:\Users\ayole\OneDrive\Desktop\PROJECTS\Images\STORAGEEEEE_Compressed_WebFiles\OFFICIAL WEBSITE IMAGES\WEBSITE artwokrs with Arrangement")
JSON_OUTPUT_PATH = Path(r"C:\Users\ayole\OneDrive\Desktop\PROJECTS\Precious\data\artworks\index.json")

def parse_category_info(relative_path):
    """Derives CMS data right from your local folder structure."""
    path_str = str(relative_path).lower()
    title = relative_path.stem  # Gets the filename without the .webp/.mp4 extension
    category = "artwork"
    subcategory = ""
    year = ""
    medium = "Digital"
    
    if "painting" in path_str:
        category = "paintings"
        year_match = re.search(r'20\d{2}', path_str)
        if year_match: year = year_match.group()
    elif "ruach" in path_str:      # <--- SEPARATED RUACH
        category = "ruach"
    elif "gospel" in path_str:     # <--- SEPARATED GOSPEL
        category = "gospel"
    elif "sketches" in path_str: 
        category = "sketches"
    elif "3d" in path_str:
        category = "3d-art"
        medium = "Blender 3D"
        if "featured" in path_str: subcategory = "Featured Renders"
        elif "stylized" in path_str: subcategory = "Stylized Portraits"
        elif "astronaut" in path_str: subcategory = "Astronaut Series"
        elif "human" in path_str: subcategory = "Human Series"
        elif "abstract figures" in path_str: subcategory = "Abstract Figures"
        elif "abstract still" in path_str: subcategory = "Abstract Still Renders"
        elif "abstract animation" in path_str: subcategory = "Abstract Animations"
    elif "graffiti" in path_str: 
        category = "graffiti"
    elif "old" in path_str:  # <--- FIX: Changed from path_lower to path_str
        category = "old"
        
    return category, subcategory, year, medium, title

def sync_portfolio():
    if not LOCAL_PORTFOLIO_DIR.exists():
        print(f"Error: Could not find your artwork folder at:\n{LOCAL_PORTFOLIO_DIR}")
        return
        
    print("Starting master sync: Uploading files and building CMS JSON...")
    artworks = []
    current_id = 0
    
    # Recursively scan all files in your portfolio directory
    for file_path in LOCAL_PORTFOLIO_DIR.rglob('*'):
        if file_path.is_file() and file_path.suffix.lower() in ['.webp', '.mp4', '.mov', '.jpg', '.png']:
            # Get path relative to the master arrangement folder
            rel_path = file_path.relative_to(LOCAL_PORTFOLIO_DIR)
            category, subcategory, year, medium, title = parse_category_info(rel_path)
            
            if category == "artwork":
                continue # Skip if it doesn't match our specific categories
                
            # Build the exact Cloudinary destination folder path based on local parent folders
            cloud_folder = f"portfolio_sync/{rel_path.parent.as_posix()}"
            res_type = "video" if file_path.suffix.lower() in ['.mp4', '.mov'] else "image"
            
            print(f"[{current_id + 1}] Uploading: {title} -> {cloud_folder} ...", end=" ", flush=True)
            
            try:
                # Upload directly to Cloudinary, forcing it to respect the folder layout
                response = cloudinary.uploader.upload(
                    str(file_path),
                    folder=cloud_folder,
                    use_filename=True,
                    unique_filename=False,
                    overwrite=True,
                    resource_type=res_type
                )
                
                # Grab the live URL straight from the success response
                secure_url = response['secure_url']
                print("DONE")
                
                artworks.append({
                    "title": title,
                    "description": f"{title} — A work by Son_of_IAM_.",
                    "category": category,
                    "subcategory": subcategory,
                    "year": year,
                    "medium": medium,
                    "dimensions": "Digital",
                    "price": "",
                    "image": secure_url,
                    "previewImage": secure_url,
                    "fullImage": secure_url,
                    "id": current_id
                })
                current_id += 1
            except Exception as e:
                print(f"FAILED: {e}")
                
    # Immediately write the JSON file
    JSON_OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(JSON_OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump({"artworks": artworks}, f, indent=2, ensure_ascii=False)
        
    print(f"\nPipeline Complete! Successfully synced {len(artworks)} files and saved index.json.")

if __name__ == "__main__":
    sync_portfolio()