import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = 'C:/Users/user/.gemini/antigravity/brain/fb763d26-eef7-4941-bad4-c28e8ee84de9';
const TARGET_DIR = 'f:/storyflow-creator/public/images/templates/creative';

const files = [
    // Podcaster
    { src: 'podcast_studio_1769218530240.png', dest: 'podcast-studio.webp' },
    { src: 'podcast_night_1769218544661.png', dest: 'podcast-night.webp' },
    { src: 'podcast_music_1769218563592.png', dest: 'podcast-music.webp' },
    // Writer (Partial)
    { src: 'writer_library_1769218588109.png', dest: 'writer-library.webp' }
];

async function processImages() {
    console.log(`Processing Round 6 images (Partial)...`);

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
