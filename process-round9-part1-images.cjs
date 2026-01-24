const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const images = [
    // Story (4)
    { src: 'C:/Users/user/.gemini/antigravity/brain/0cedeab4-7e05-4180-987b-279126cf5107/story_road_1769275000000_1769274930697.png', dest: 'public/images/templates/personal/story-road.webp' },
    { src: 'C:/Users/user/.gemini/antigravity/brain/0cedeab4-7e05-4180-987b-279126cf5107/story_forest_1769275000001_1769274946506.png', dest: 'public/images/templates/personal/story-forest.webp' },
    { src: 'C:/Users/user/.gemini/antigravity/brain/0cedeab4-7e05-4180-987b-279126cf5107/story_mountain_1769275000002_1769274962887.png', dest: 'public/images/templates/personal/story-mountain.webp' },
    { src: 'C:/Users/user/.gemini/antigravity/brain/0cedeab4-7e05-4180-987b-279126cf5107/story_sunset_1769275000003_1769274982419.png', dest: 'public/images/templates/personal/story-sunset.webp' },

    // Travel Diary (5)
    { src: 'C:/Users/user/.gemini/antigravity/brain/0cedeab4-7e05-4180-987b-279126cf5107/travel_paris_1769275000004_1769275009417.png', dest: 'public/images/templates/personal/travel-paris.webp' },
    { src: 'C:/Users/user/.gemini/antigravity/brain/0cedeab4-7e05-4180-987b-279126cf5107/travel_eiffel_1769275000005_1769275024589.png', dest: 'public/images/templates/personal/travel-eiffel.webp' },
    { src: 'C:/Users/user/.gemini/antigravity/brain/0cedeab4-7e05-4180-987b-279126cf5107/travel_river_1769275000006_1769275041355.png', dest: 'public/images/templates/personal/travel-river.webp' },
    { src: 'C:/Users/user/.gemini/antigravity/brain/0cedeab4-7e05-4180-987b-279126cf5107/travel_cathedral_1769275000007_1769275055746.png', dest: 'public/images/templates/personal/travel-cathedral.webp' },
    { src: 'C:/Users/user/.gemini/antigravity/brain/0cedeab4-7e05-4180-987b-279126cf5107/travel_street_1769275000008_1769275070785.png', dest: 'public/images/templates/personal/travel-street.webp' }
];

async function processImages() {
    for (const img of images) {
        const destDir = path.dirname(img.dest);
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        try {
            if (fs.existsSync(img.src)) {
                await sharp(img.src)
                    .webp({ quality: 80 })
                    .toFile(img.dest);
                console.log(`Converted: ${img.dest}`);
            } else {
                console.error(`Source file not found: ${img.src}`);
            }
        } catch (error) {
            console.error(`Error converting ${img.src}:`, error);
        }
    }
}

processImages().catch(console.error);
