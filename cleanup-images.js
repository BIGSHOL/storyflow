import sharp from 'sharp';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PUBLIC_IMAGES_DIR = path.join(__dirname, 'public/images/templates');

async function cleanupImages(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            await cleanupImages(fullPath);
        } else if (entry.isFile()) {
            const ext = path.extname(entry.name).toLowerCase();
            if (['.png', '.jpg', '.jpeg'].includes(ext)) {
                const basename = path.basename(entry.name, ext);
                const webpPath = path.join(dir, `${basename}.webp`);

                if (fs.existsSync(webpPath)) {
                    console.log(`WebP exists for ${entry.name}. Deleting original...`);
                    fs.unlinkSync(fullPath);
                } else {
                    console.log(`Converting ${entry.name} to WebP...`);
                    try {
                        await sharp(fullPath)
                            .webp({ quality: 80 })
                            .toFile(webpPath);
                        console.log(`Converted. Deleting original...`);
                        fs.unlinkSync(fullPath);
                    } catch (error) {
                        console.error(`Error converting ${entry.name}:`, error);
                    }
                }
            }
        }
    }
}

console.log(`Starting image cleanup in ${PUBLIC_IMAGES_DIR}...`);
if (fs.existsSync(PUBLIC_IMAGES_DIR)) {
    await cleanupImages(PUBLIC_IMAGES_DIR);
    console.log('Cleanup complete.');
} else {
    console.error(`Directory not found: ${PUBLIC_IMAGES_DIR}`);
}
