const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const images = [
    { src: 'C:/Users/user/.gemini/antigravity/brain/0cedeab4-7e05-4180-987b-279126cf5107/craft_pottery_1769254166000_1769254185099.png', dest: 'public/images/templates/creative/craft-pottery.webp' },
    { src: 'C:/Users/user/.gemini/antigravity/brain/0cedeab4-7e05-4180-987b-279126cf5107/craft_moonjar_1769254166001_1769254201641.png', dest: 'public/images/templates/creative/craft-moonjar.webp' },
    { src: 'C:/Users/user/.gemini/antigravity/brain/0cedeab4-7e05-4180-987b-279126cf5107/craft_teacup_1769254166002_1769254219117.png', dest: 'public/images/templates/creative/craft-teacup.webp' },
    { src: 'C:/Users/user/.gemini/antigravity/brain/0cedeab4-7e05-4180-987b-279126cf5107/dj_club_1769254166003_1769254235320.png', dest: 'public/images/templates/creative/dj-club.webp' },
    { src: 'C:/Users/user/.gemini/antigravity/brain/0cedeab4-7e05-4180-987b-279126cf5107/dj_party_1769254166004_1769254250537.png', dest: 'public/images/templates/creative/dj-party.webp' }
];

async function processImages() {
    for (const img of images) {
        const destDir = path.dirname(img.dest);
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        await sharp(img.src)
            .webp({ quality: 80 })
            .toFile(img.dest);
        console.log(`Converted: ${img.dest}`);
    }
}

processImages().catch(console.error);
