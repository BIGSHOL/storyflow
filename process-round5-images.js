import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = 'C:/Users/user/.gemini/antigravity/brain/fb763d26-eef7-4941-bad4-c28e8ee84de9';
const TARGET_DIR = 'f:/storyflow-creator/public/images/templates/creative';

const files = [
    // Baking
    { src: 'cake_hero_1769217963612.png', dest: 'cake-hero.webp' },
    { src: 'cake_birthday_1769217977517.png', dest: 'cake-birthday.webp' },
    { src: 'cake_wedding_1769217992305.png', dest: 'cake-wedding.webp' },
    { src: 'cake_cupcake_1769218006187.png', dest: 'cake-cupcake.webp' },
    // YouTuber
    { src: 'youtube_hero_1769218031174.png', dest: 'youtube-hero.webp' },
    { src: 'youtube_travel_1769218047533.png', dest: 'youtube-travel.webp' },
    { src: 'youtube_qa_1769218064153.png', dest: 'youtube-qa.webp' },
    { src: 'youtube_room_1769218079738.png', dest: 'youtube-room.webp' }
];

async function processImages() {
    console.log(`Maintaining aspect ratio (16:9 for heroes) where possible...`);

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
