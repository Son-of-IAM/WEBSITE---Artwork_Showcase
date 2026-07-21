import os
import json
import re
import cloudinary
import cloudinary.api
from pathlib import Path

# ==========================================
# 1. CLOUDINARY API CONFIGURATION
# ==========================================
cloudinary.config(
    cloud_name = 'mst703ng',
    api_key = '777738798791485',
    api_secret = '2_tnqaPyMDD-x9-VJRC0rphUdHc'
)

PROJECT_ROOT = Path(r"C:\Users\ayole\OneDrive\Desktop\PROJECTS\Precious")
JSON_OUTPUT_PATH = PROJECT_ROOT / "data" / "artworks" / "index.json"

def get_category_info(public_id, filename):
    """Maps your Cloudinary public_id path to your specific index.json data schema."""
    # Standardize the path by replacing underscores and URL encodings with spaces
    path_lower = public_id.lower().replace('_', ' ').replace('%20', ' ')
    
    category = "artwork"
    subcategory = ""
    year = ""
    medium = "Digital"
    
    if "painting" in path_lower:
        category = "paintings"
        year_match = re.search(r'20\d{2}', path_lower)
        if year_match: year = year_match.group()
    elif "gospel" in path_lower or "ruach" in path_lower: category = "gospel"
    elif "sketches" in path_lower: category = "sketches"
    elif "3d" in path_lower:
        category = "3d-art"
        medium = "Blender 3D"
        if "featured" in path_lower: subcategory = "Featured Renders"
        elif "stylized" in path_lower: subcategory = "Stylized Portraits"
        elif "astronaut" in path_lower: subcategory = "Astronaut Series"
        elif "human" in path_lower: subcategory = "Human Series"
        elif "abstract figures" in path_lower: subcategory = "Abstract Figures"
        elif "abstract still" in path_lower: subcategory = "Abstract Still Renders"
        elif "abstract animation" in path_lower: subcategory = "Abstract Animations"
    elif "graffiti" in path_lower: category = "graffiti"
    elif "old" in path_lower: category = "old"

    # Strip the extension off the filename for a clean title
    title = filename.rsplit('.', 1)[0]
    # Clean up any underscores Cloudinary injected into the title
    title = title.replace('_', ' ')
    
    return category, subcategory, year, medium, title

def build_cms_json():
    print("Initiating direct Cloudinary Admin API connection...")
    artworks = []
    current_id = 0
    
    for res_type in ["image", "video"]:
        print(f"\nFetching {res_type} assets...")
        next_cursor = None
        
        while True:
            response = cloudinary.api.resources(
                resource_type=res_type,
                type="upload",
                max_results=500,
                next_cursor=next_cursor
            )
            
            for resource in response.get('resources', []):
                public_id = resource['public_id']
                standardized_path = public_id.lower().replace('_', ' ').replace('%20', ' ')
                
                # --- BULLETPROOF FILTER ---
                # 1. Ignore static website images
                if "different locations" in standardized_path or "exhibition" in standardized_path or "about page" in standardized_path:
                    continue
                    
                # 2. Must be inside the main arrangement folder
                if "artwokrs with arrangement" not in standardized_path:
                    continue

                secure_url = resource['secure_url']
                
                # Extract raw filename from the end of the public ID
                filename = public_id.split('/')[-1]
                if resource.get('format'):
                    filename += f".{resource['format']}"
                    
                category, subcategory, year, medium, title = get_category_info(public_id, filename)
                
                if category != "artwork":
                    print(f"Added: [{category.upper()}] {title}")
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
                    
            next_cursor = response.get('next_cursor')
            if not next_cursor:
                break
                
    if len(artworks) == 0:
        print("\nWARNING: Still 0 artworks found. Let's debug what Cloudinary is actually seeing.")
        print("Run this exact code again; it will print out the raw paths to show us the problem.")
        return

    JSON_OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(JSON_OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump({"artworks": artworks}, f, indent=2, ensure_ascii=False)
        
    print(f"\nSuccess! Built CMS JSON with {len(artworks)} artworks.")
    print(f"File deployed directly to: {JSON_OUTPUT_PATH}")

if __name__ == "__main__":
    build_cms_json()