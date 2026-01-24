import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = 'C:/Users/user/.gemini/antigravity/brain/fb763d26-eef7-4941-bad4-c28e8ee84de9';
const TARGET_DIR = 'f:/storyflow-creator/public/images/templates/creative';

const files = [
    { src: 'fashion_runway_1769217477655.png', dest: 'fashion-runway.webp' },
    { src: 'fashion_look1_1769217494667.png', dest: 'fashion-look1.webp' },
    { src: 'fashion_look2_1769217508143.png', dest: 'fashion-look2.webp' },
    { src: 'fashion_look3_1769217528242.png', dest: 'fashion-look3.webp' },
    { src: 'fashion_detail_1769217543717.png', dest: 'fashion-detail.webp' }
];

async function processImages() {
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
