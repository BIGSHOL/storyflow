import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

const VIDEOS_DIR = path.join(__dirname, 'public', 'videos');

// Function to find all MP4 files recursively
function findMp4Files(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;

    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            findMp4Files(filePath, fileList);
        } else {
            if (path.extname(file).toLowerCase() === '.mp4') {
                fileList.push(filePath);
            }
        }
    });

    return fileList;
}

const mp4Files = findMp4Files(VIDEOS_DIR);

console.log(`Found ${mp4Files.length} MP4 videos to convert.`);

if (mp4Files.length === 0) {
    console.log('No MP4 files found to convert.');
    process.exit(0);
}

// Convert files sequentially to avoid overwhelming the system
async function convertAll() {
    for (const inputFile of mp4Files) {
        const outputFile = inputFile.replace('.mp4', '.webm');
        console.log(`Converting: ${path.basename(inputFile)} -> WebM...`);

        try {
            await new Promise((resolve, reject) => {
                ffmpeg(inputFile)
                    .output(outputFile)
                    .videoCodec('libvpx-vp9')
                    .videoBitrate('1000k') // Balance between quality and size
                    .noAudio() // Reduce size
                    .on('end', () => {
                        console.log(`✅ Converted: ${path.basename(outputFile)}`);
                        resolve();
                    })
                    .on('error', (err) => {
                        console.error(`❌ Error converting ${path.basename(inputFile)}:`, err);
                        reject(err);
                    })
                    .run();
            });

            // Calculate savings and delete original
            const originalSize = fs.statSync(inputFile).size;
            const newSize = fs.statSync(outputFile).size;
            const savings = ((originalSize - newSize) / originalSize * 100).toFixed(2);

            console.log(`Original: ${(originalSize / 1024 / 1024).toFixed(2)}MB, WebM: ${(newSize / 1024 / 1024).toFixed(2)}MB, Savings: ${savings}%`);

            try {
                fs.unlinkSync(inputFile);
                console.log(`🗑️ Deleted original MP4`);
            } catch (err) {
                console.warn(`Could not delete original file: ${err.message}`);
            }

        } catch (error) {
            console.error('Failed to convert a file, continuing...', error);
        }
    }
}

convertAll();
