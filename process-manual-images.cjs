const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'data');
const targetDir = path.join(__dirname, 'public/images/templates/personal');

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

const filesToProcess = [
    // Batch 5 (Volunteer, Bucket, Gratitude, House)
    { src: 'volunteer-hero.jpg.png', dest: 'volunteer-hero.webp' },
    { src: 'bucket-skydiving.jpg.png', dest: 'bucket-skydiving.webp' },
    { src: 'gratitude-sunlight.png', dest: 'gratitude-sunlight.webp' },
    { src: 'house-interior.png', dest: 'house-interior.webp' },
    { src: 'house-livingroom.png', dest: 'house-livingroom.webp' },
    { src: 'house-kitchen.png', dest: 'house-kitchen.webp' },
    { src: 'house-desk.jpg.png', dest: 'house-desk.webp' }
];

async function processImages() {
    console.log('Starting image conversion (Batch 3)...');

    for (const file of filesToProcess) {
        const sourcePath = path.join(sourceDir, file.src);
        const targetPath = path.join(targetDir, file.dest);

        if (fs.existsSync(sourcePath)) {
            try {
                await sharp(sourcePath)
                    .webp({ quality: 80 })
                    .toFile(targetPath);

                console.log(`Converted: ${file.src} -> ${file.dest}`);
            } catch (error) {
                console.error(`Error converting ${file.src}:`, error);
            }
        } else {
            console.warn(`Source file not found: ${file.src}`);
        }
    }
    console.log('Conversion complete.');
}

processImages();
