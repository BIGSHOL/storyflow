import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = 'C:/Users/user/.gemini/antigravity/brain/0cedeab4-7e05-4180-987b-279126cf5107';
const TARGET_DIR = 'f:/storyflow-creator/public/images/templates/creative';

const files = [
    { src: 'writer_book_hero_1769253355861.png', dest: 'writer-book.webp' },
    { src: 'poet_flower_hero_1769253371119.png', dest: 'poet-flower.webp' }
];

async function processImages() {
    console.log(`Converting images to WebP...`);

    for (const file of files) {
        const srcPath = path.join(ARTIFACTS_DIR, file.src);
        const destPath = path.join(TARGET_DIR, file.dest);

        console.log(`Processing ${file.src} -> ${file.dest}...`);

        try {
            if (!fs.existsSync(srcPath)) {
                console.error(`Source file not found: ${srcPath}`);
                continue;
            }

            await sharp(srcPath)
                .webp({ quality: 80 })
                .toFile(destPath);

            console.log(`Successfully created ${destPath}`);
        } catch (error) {
            console.error(`Error processing ${file.src}:`, error);
        }
    }
}

processImages();
