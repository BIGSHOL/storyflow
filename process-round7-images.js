import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = 'C:/Users/user/.gemini/antigravity/brain/0cedeab4-7e05-4180-987b-279126cf5107';
const TARGET_DIR = 'f:/storyflow-creator/public/images/templates/creative';

const files = [
    { src: 'wedding_hero_1769253692704.png', dest: 'wedding-hero.webp' },
    { src: 'wedding_bride_1769253709620.png', dest: 'wedding-bride.webp' },
    { src: 'wedding_groom_1769253724344.png', dest: 'wedding-groom.webp' },
    { src: 'wedding_ring_1769253742983.png', dest: 'wedding-ring.webp' },
    { src: 'wedding_bouquet_1769253758625.png', dest: 'wedding-bouquet.webp' },
    { src: 'product_cosmetics_1769253773119.png', dest: 'product-cosmetics.webp' },
    { src: 'product_food_creative_1769253788116.png', dest: 'product-food.webp' },
    { src: 'product_watch_1769253803112.png', dest: 'product-watch.webp' },
    { src: 'portrait_hero_creative_1769253818893.png', dest: 'portrait-hero.webp' },
    { src: 'chef_cooking_hero_1769253834028.png', dest: 'chef-cooking.webp' },
    { src: 'florist_garden_hero_1769253847582.png', dest: 'florist-garden.webp' },
    { src: 'florist_bouquet_main_1769253862876.png', dest: 'florist-bouquet.webp' }
];

async function processImages() {
    console.log(`Converting Round 7 images to WebP...`);

    for (const file of files) {
        const srcPath = path.join(ARTIFACTS_DIR, file.src);
        const destPath = path.join(TARGET_DIR, file.dest);

        console.log(`Processing ${file.src} -> ${file.dest}...`);

        try {
            if (!fs.existsSync(srcPath)) {
                console.error(`Source file not found: ${srcPath}`);
                continue;
            }

            // For heroes (16:9), we might want to ensure aspect ratio, but generation prompt already asked for it.
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
