// VERIFIED Agricultural Crop Image Database - HD Quality & Botanically Accurate
const CROP_IMAGE_DATABASE = {
    // --- Cereals & Grains ---
    'Rice': 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&h=600&fit=crop&q=90',
    'Wheat': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop&q=90',
    'Maize': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&h=600&fit=crop&q=90',
    'Corn': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&h=600&fit=crop&q=90',
    'Sweet Corn': 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=800&h=600&fit=crop&q=90',
    // Wikimedia used for accuracy as Unsplash lacks specific field shots for these
    'Jowar': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Sorghum_bicolor_field.jpg/1024px-Sorghum_bicolor_field.jpg',
    'Jowar (Sorghum)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Sorghum_bicolor_field.jpg/1024px-Sorghum_bicolor_field.jpg',
    'Sorghum': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Sorghum_bicolor_field.jpg/1024px-Sorghum_bicolor_field.jpg',
    'Bajra': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Pearl_millet_field.jpg/1024px-Pearl_millet_field.jpg',
    'Pearl Millet': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Pearl_millet_field.jpg/1024px-Pearl_millet_field.jpg',

    // --- Cash Crops ---
    'Cotton': 'https://images.unsplash.com/photo-1594488518020-d3a3399a9a0e?w=800&h=600&fit=crop&q=90',
    'Sugarcane': 'https://images.unsplash.com/photo-1606132758957-37d425b07897?w=800&h=600&fit=crop&q=90',
    'Soybean': 'https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=800&h=600&fit=crop&q=90',
    'Sunflower': 'https://images.unsplash.com/photo-1470509037663-253afd7f0f51?w=800&h=600&fit=crop&q=90',
    'Mustard': 'https://images.unsplash.com/photo-1678161555382-75f855d04847?w=800&h=600&fit=crop&q=90',
    'Sesame': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Sesamum_indicum_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-130.jpg/800px-Sesamum_indicum_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-130.jpg',

    // --- Pulses & Legumes (Verified Plant/Pod Images) ---
    // Unsplash often confuses "Tur" with generic yellow lentils. Using botanical field images.
    'Tur': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Cajanus_cajan_flower_and_pods.jpg/1024px-Cajanus_cajan_flower_and_pods.jpg',
    'Tur (Pigeon Pea)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Cajanus_cajan_flower_and_pods.jpg/1024px-Cajanus_cajan_flower_and_pods.jpg',
    'Pigeon Pea': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Cajanus_cajan_flower_and_pods.jpg/1024px-Cajanus_cajan_flower_and_pods.jpg',
    'Chickpea': 'https://images.unsplash.com/photo-1597662071589-1b0a34c4ee8c?w=800&h=600&fit=crop&q=90',
    'Groundnut': 'https://images.unsplash.com/photo-1567375698509-46e3775f8bb7?w=800&h=600&fit=crop&q=90',
    'Peanut': 'https://images.unsplash.com/photo-1567375698509-46e3775f8bb7?w=800&h=600&fit=crop&q=90',
    'Mung': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Mung_bean_field.jpg/1024px-Mung_bean_field.jpg',
    'Green Gram': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Mung_bean_field.jpg/1024px-Mung_bean_field.jpg',
    'Black Gram': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Vigna_mungo_pods.jpg/800px-Vigna_mungo_pods.jpg',
    'Peas': 'https://images.unsplash.com/photo-1592394533824-9440e5d68530?w=800&h=600&fit=crop&q=90',
    'French Beans': 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=800&h=600&fit=crop&q=90',
    'Cluster Bean': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Cyamopsis_tetragonoloba_plant.jpg/800px-Cyamopsis_tetragonoloba_plant.jpg',

    // --- Vegetables: Solanaceae ---
    'Tomato': 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800&h=600&fit=crop&q=90',
    'Brinjal': 'https://images.unsplash.com/photo-1615485925694-a62322319489?w=800&h=600&fit=crop&q=90',
    'Brinjal (Eggplant)': 'https://images.unsplash.com/photo-1615485925694-a62322319489?w=800&h=600&fit=crop&q=90',
    'Eggplant': 'https://images.unsplash.com/photo-1615485925694-a62322319489?w=800&h=600&fit=crop&q=90',
    'Chilli': 'https://images.unsplash.com/photo-1566802616235-9b2a7593c681?w=800&h=600&fit=crop&q=90',
    'Chili': 'https://images.unsplash.com/photo-1566802616235-9b2a7593c681?w=800&h=600&fit=crop&q=90',
    'Potato': 'https://images.unsplash.com/photo-1596450523825-7243c3d5e27a?w=800&h=600&fit=crop&q=90',

    // --- Vegetables: Alliums ---
    'Onion': 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&h=600&fit=crop&q=90',
    'Garlic': 'https://images.unsplash.com/photo-1598048143224-b1eb2ce05fc6?w=800&h=600&fit=crop&q=90',

    // --- Vegetables: Root/Tuber ---
    'Carrot': 'https://images.unsplash.com/photo-1590868309235-ea34bed7bd1f?w=800&h=600&fit=crop&q=90',
    'Sweet Potato': 'https://images.unsplash.com/photo-1623528701048-b4b008d32d0c?w=800&h=600&fit=crop&q=90',
    'Beetroot': 'https://images.unsplash.com/photo-1601662999516-43c2c192d6e4?w=800&h=600&fit=crop&q=90',
    'Colocasia': 'https://images.unsplash.com/photo-1611162458320-b4f009581177?w=800&h=600&fit=crop&q=90',

    // --- Vegetables: Cucurbits ---
    'Watermelon': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&h=600&fit=crop&q=90',
    'Bottle Gourd': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Lagenaria_siceraria_11.jpg/800px-Lagenaria_siceraria_11.jpg',
    'Bitter Gourd': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Bitter_melon_plant.jpg/800px-Bitter_melon_plant.jpg',
    'Pumpkin': 'https://images.unsplash.com/photo-1506917728037-b6af01a5d403?w=800&h=600&fit=crop&q=90',
    'Cucumber': 'https://images.unsplash.com/photo-1604173874749-983ceab562c5?w=800&h=600&fit=crop&q=90',

    // --- Vegetables: Others ---
    'Okra': 'https://images.unsplash.com/photo-1458938926217-10c2363e7703?w=800&h=600&fit=crop&q=90',
    'Spinach': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&h=600&fit=crop&q=90',
    'Fenugreek': 'https://images.unsplash.com/photo-1644263643614-8cfe80d0c32e?w=800&h=600&fit=crop&q=90',
    'Cabbage': 'https://images.unsplash.com/photo-1553978297-833d09932d31?w=800&h=600&fit=crop&q=90',
    'Cauliflower': 'https://images.unsplash.com/photo-1568584711271-055f9b1bb7b6?w=800&h=600&fit=crop&q=90',
    'Lettuce': 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=800&h=600&fit=crop&q=90',

    // --- Fruits ---
    'Banana': 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=800&h=600&fit=crop&q=90',
    'Grapes': 'https://images.unsplash.com/photo-1596706456743-69024c3cb4a3?w=800&h=600&fit=crop&q=90',
    'Orange': 'https://images.unsplash.com/photo-1582281298055-e25b84a30b0b?w=800&h=600&fit=crop&q=90',
    'Pineapple': 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=800&h=600&fit=crop&q=90',
    'Pomegranate': 'https://images.unsplash.com/photo-1627931326466-9eb1f2e519c7?w=800&h=600&fit=crop&q=90',
    'Papaya': 'https://images.unsplash.com/photo-1628189674063-e3871404d801?w=800&h=600&fit=crop&q=90',
    'Mango': 'https://images.unsplash.com/photo-1626296185854-44cc196c787a?w=800&h=600&fit=crop&q=90',

    // --- Plantation & Spices ---
    'Areca Nut': 'https://images.unsplash.com/photo-1622329380962-d27376a8d67c?w=800&h=600&fit=crop&q=90',
    'Coconut': 'https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?w=800&h=600&fit=crop&q=90',
    'Turmeric': 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=800&h=600&fit=crop&q=90',
    'Tamarind': 'https://images.unsplash.com/photo-1566659962687-7c841c797979?w=800&h=600&fit=crop&q=90',
    'Fennel': 'https://images.unsplash.com/photo-1600456899121-68eda5705257?w=800&h=600&fit=crop&q=90',

    // --- Fallback ---
    'default': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop&q=90',

    // --- New & Missing Crops ---
    'Ginger': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Ginger_Root.jpg/800px-Ginger_Root.jpg',
    'Apple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/800px-Red_Apple.jpg',
    'Custard Apple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Sugar_Apple_%28Annona_squamosa%29.jpg/800px-Sugar_Apple_%28Annona_squamosa%29.jpg',

    // --- Local Aliases / Mappings (Synced with Scraper) ---
    // Wheat
    'Gehun': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop&q=90',
    'Wheat (Dara)': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop&q=90',
    // Rice
    'Paddy': 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&h=600&fit=crop&q=90',
    'Paddy(Dhan)(Common)': 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&h=600&fit=crop&q=90',
    'Dhan': 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&h=600&fit=crop&q=90',
    'Chawal': 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&h=600&fit=crop&q=90',
    // Cotton
    'Kapas': 'https://images.unsplash.com/photo-1594488518020-d3a3399a9a0e?w=800&h=600&fit=crop&q=90',
    'Cotton (Kapas)': 'https://images.unsplash.com/photo-1594488518020-d3a3399a9a0e?w=800&h=600&fit=crop&q=90',
    // Sugarcane
    'Ganna': 'https://images.unsplash.com/photo-1606132758957-37d425b07897?w=800&h=600&fit=crop&q=90',
    'Sugar Cane': 'https://images.unsplash.com/photo-1606132758957-37d425b07897?w=800&h=600&fit=crop&q=90',
    // Soyabean
    'Soyabean': 'https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=800&h=600&fit=crop&q=90',
    'Soya Bean': 'https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=800&h=600&fit=crop&q=90',
    // Maize
    'Makka': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&h=600&fit=crop&q=90',
    // Vegetables
    'Tamatar': 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800&h=600&fit=crop&q=90',
    'Tomato Hybrid': 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800&h=600&fit=crop&q=90',
    'Pyaz': 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&h=600&fit=crop&q=90',
    'Onion Red': 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&h=600&fit=crop&q=90',
    'Aloo': 'https://images.unsplash.com/photo-1596450523825-7243c3d5e27a?w=800&h=600&fit=crop&q=90',
    'Potato Red': 'https://images.unsplash.com/photo-1596450523825-7243c3d5e27a?w=800&h=600&fit=crop&q=90',
    'Baingan': 'https://images.unsplash.com/photo-1615485925694-a62322319489?w=800&h=600&fit=crop&q=90',
    'Bhindi': 'https://images.unsplash.com/photo-1458938926217-10c2363e7703?w=800&h=600&fit=crop&q=90',
    'Bhindi(Ladies Finger)': 'https://images.unsplash.com/photo-1458938926217-10c2363e7703?w=800&h=600&fit=crop&q=90',
    'Lady Finger': 'https://images.unsplash.com/photo-1458938926217-10c2363e7703?w=800&h=600&fit=crop&q=90',
    'Phool Gobhi': 'https://images.unsplash.com/photo-1568584711271-055f9b1bb7b6?w=800&h=600&fit=crop&q=90',
    'Patta Gobhi': 'https://images.unsplash.com/photo-1553978297-833d09932d31?w=800&h=600&fit=crop&q=90',
    'Kheera': 'https://images.unsplash.com/photo-1604173874749-983ceab562c5?w=800&h=600&fit=crop&q=90',
    'Kakdi': 'https://images.unsplash.com/photo-1604173874749-983ceab562c5?w=800&h=600&fit=crop&q=90',
    'Mirchi': 'https://images.unsplash.com/photo-1566802616235-9b2a7593c681?w=800&h=600&fit=crop&q=90',
    'Chillies (Green)': 'https://images.unsplash.com/photo-1566802616235-9b2a7593c681?w=800&h=600&fit=crop&q=90',
    'Chilli Red': 'https://images.unsplash.com/photo-1566802616235-9b2a7593c681?w=800&h=600&fit=crop&q=90',
    'Lahsun': 'https://images.unsplash.com/photo-1598048143224-b1eb2ce05fc6?w=800&h=600&fit=crop&q=90',
    'Adrak': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Ginger_Root.jpg/800px-Ginger_Root.jpg',
    'Ginger(Green)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Ginger_Root.jpg/800px-Ginger_Root.jpg',
    // Pulses
    'Moongfali': 'https://images.unsplash.com/photo-1567375698509-46e3775f8bb7?w=800&h=600&fit=crop&q=90',
    'Arhar': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Cajanus_cajan_flower_and_pods.jpg/1024px-Cajanus_cajan_flower_and_pods.jpg',
    'Arhar (Tur/Red Gram)(Whole)': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Cajanus_cajan_flower_and_pods.jpg/1024px-Cajanus_cajan_flower_and_pods.jpg',
    'Haldi': 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=800&h=600&fit=crop&q=90',
    // Fruits
    'Kela': 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=800&h=600&fit=crop&q=90',
    'Aam': 'https://images.unsplash.com/photo-1626296185854-44cc196c787a?w=800&h=600&fit=crop&q=90',
    'Angoor': 'https://images.unsplash.com/photo-1596706456743-69024c3cb4a3?w=800&h=600&fit=crop&q=90',
    'Narangi': 'https://images.unsplash.com/photo-1582281298055-e25b84a30b0b?w=800&h=600&fit=crop&q=90',
    'Santra': 'https://images.unsplash.com/photo-1582281298055-e25b84a30b0b?w=800&h=600&fit=crop&q=90',
    'Anar': 'https://images.unsplash.com/photo-1627931326466-9eb1f2e519c7?w=800&h=600&fit=crop&q=90',
    'Seb': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/800px-Red_Apple.jpg'
};

// Function to get crop image with fallback (optimized for HD images)
function getCropImage(cropName, optimize = true, width = 800, height = 600) {
    if (!cropName) return optimize ? getOptimizedImageUrl(CROP_IMAGE_DATABASE.default, width, height) : CROP_IMAGE_DATABASE.default;

    let imageUrl = null;

    // Try exact match first
    if (CROP_IMAGE_DATABASE[cropName]) {
        imageUrl = CROP_IMAGE_DATABASE[cropName];
    } else {
        // Try case-insensitive match
        const normalizedCropName = cropName.toLowerCase().trim();
        for (const [key, value] of Object.entries(CROP_IMAGE_DATABASE)) {
            if (key.toLowerCase() === normalizedCropName) {
                imageUrl = value;
                break;
            }
        }

        // Try partial match if no exact match found
        if (!imageUrl) {
            for (const [key, value] of Object.entries(CROP_IMAGE_DATABASE)) {
                if (key.toLowerCase().includes(normalizedCropName) ||
                    normalizedCropName.includes(key.toLowerCase())) {
                    imageUrl = value;
                    break;
                }
            }
        }
    }

    // Return default if no match found
    if (!imageUrl) {
        imageUrl = CROP_IMAGE_DATABASE.default;
    }

    // Return optimized URL if requested
    return optimize ? getOptimizedImageUrl(imageUrl, width, height) : imageUrl;
}

// Function to preload images for better performance (optimized)
function preloadCropImages(limit = 10) {
    // Only preload first 10 images to avoid overwhelming the browser
    const imageUrls = Object.values(CROP_IMAGE_DATABASE).slice(0, limit);

    imageUrls.forEach((imageUrl, index) => {
        // Stagger the loading to prevent blocking
        setTimeout(() => {
            const img = new Image();
            img.src = imageUrl;
            // Optional: Add loading attributes for better performance
            img.loading = 'lazy';
            img.decoding = 'async';
        }, index * 100); // Load each image 100ms apart
    });
}

// Function to get optimized image URL for HD quality
function getOptimizedImageUrl(originalUrl, width = 800, height = 600) {
    // For Unsplash images, we can customize size parameters for HD quality
    if (originalUrl.includes('unsplash.com')) {
        // Extract base URL and add HD parameters
        const baseUrl = originalUrl.split('?')[0];
        return `${baseUrl}?w=${width}&h=${height}&fit=crop&q=90&auto=format&dpr=2`;
    }

    // For Google images, try to get higher resolution
    if (originalUrl.includes('encrypted-tbn0.gstatic.com')) {
        // Add size parameter for better quality
        if (!originalUrl.includes('=s')) {
            return `${originalUrl}=s${Math.max(width, height)}`;
        }
    }

    // For other sources, return original HD URL
    return originalUrl;
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CROP_IMAGE_DATABASE, getCropImage, preloadCropImages, getOptimizedImageUrl };
} else if (typeof window !== 'undefined') {
    window.CROP_IMAGE_DATABASE = CROP_IMAGE_DATABASE;
    window.getCropImage = getCropImage;
    window.preloadCropImages = preloadCropImages;
    window.getOptimizedImageUrl = getOptimizedImageUrl;

    // Auto-preload only essential images when script loads
    document.addEventListener('DOMContentLoaded', function () {
        // Only preload 5 most common crops to avoid slowing down initial page load
        preloadCropImages(5);
    });
}
