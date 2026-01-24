
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = path.join(__dirname, 'public', 'images', 'templates', 'event');

if (!fs.existsSync(targetDir)) {
    console.error(`Target directory not found: ${targetDir}`);
    process.exit(1);
}

async function convertImages() {
    const files = fs.readdirSync(targetDir);
    const pngFiles = files.filter(file => file.toLowerCase().endsWith('.png'));

    console.log(`Found ${pngFiles.length} PNG files to convert in ${targetDir}`);

    for (const file of pngFiles) {
        const filePath = path.join(targetDir, file);
        const fileNameWithoutExt = path.parse(file).name;
        const outputFilePath = path.join(targetDir, `${fileNameWithoutExt}.webp`);

        try {
            await sharp(filePath)
                .webp({ quality: 80 })
                .toFile(outputFilePath);

            console.log(`Converted: ${file} -> ${fileNameWithoutExt}.webp`);

            // Delete original file after successful conversion
            fs.unlinkSync(filePath);
            console.log(`Deleted original: ${file}`);

        } catch (error) {
            console.error(`Error converting ${file}:`, error);
        }
    }
}

convertImages();
