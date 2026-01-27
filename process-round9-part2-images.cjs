const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const images = [
    // Travel Diary (2)
    { src: 'C:/Users/user/.gemini/antigravity/brain/0cedeab4-7e05-4180-987b-279126cf5107/travel_arch_1769302500000_1769302427410.png', dest: 'public/images/templates/personal/travel-arch.webp' },
    { src: 'C:/Users/user/.gemini/antigravity/brain/0cedeab4-7e05-4180-987b-279126cf5107/travel_cafe_1769302500001_1769302442605.png', dest: 'public/images/templates/personal/travel-cafe.webp' },

    // About Me (1 - desk created)
    { src: 'C:/Users/user/.gemini/antigravity/brain/0cedeab4-7e05-4180-987b-279126cf5107/aboutme_desk_1769302500002_1769302456240.png', dest: 'public/images/templates/personal/aboutme-desk.webp' },
    // Note: coffee, coding, design, hobby failed to generate
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
