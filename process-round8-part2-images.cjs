const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const images = [
    { src: 'C:/Users/user/.gemini/antigravity/brain/0cedeab4-7e05-4180-987b-279126cf5107/dancer_hero_1769269500000_1769272896471.png', dest: 'public/images/templates/creative/dancer-hero.webp' },
    { src: 'C:/Users/user/.gemini/antigravity/brain/0cedeab4-7e05-4180-987b-279126cf5107/dancer_class_1769269500001_1769272912241.png', dest: 'public/images/templates/creative/dancer-class.webp' },
    { src: 'C:/Users/user/.gemini/antigravity/brain/0cedeab4-7e05-4180-987b-279126cf5107/dancer_group_1769269500002_1769272928681.png', dest: 'public/images/templates/creative/dancer-group.webp' },
    { src: 'C:/Users/user/.gemini/antigravity/brain/0cedeab4-7e05-4180-987b-279126cf5107/wedding_hall_1769269500003_1769272945599.png', dest: 'public/images/templates/event/wedding-hall.webp' },
    { src: 'C:/Users/user/.gemini/antigravity/brain/0cedeab4-7e05-4180-987b-279126cf5107/conference_tech_1769269500004_1769272961007.png', dest: 'public/images/templates/event/conference-tech.webp' },
    { src: 'C:/Users/user/.gemini/antigravity/brain/0cedeab4-7e05-4180-987b-279126cf5107/conference_speaker1_1769269500005_1769272979617.png', dest: 'public/images/templates/event/conference-speaker1.webp' },
    { src: 'C:/Users/user/.gemini/antigravity/brain/0cedeab4-7e05-4180-987b-279126cf5107/conference_speaker2_1769269500006_1769272996726.png', dest: 'public/images/templates/event/conference-speaker2.webp' },
    { src: 'C:/Users/user/.gemini/antigravity/brain/0cedeab4-7e05-4180-987b-279126cf5107/conference_speaker3_1769269500007_1769273013576.png', dest: 'public/images/templates/event/conference-speaker3.webp' }
];

async function processImages() {
    for (const img of images) {
        const destDir = path.dirname(img.dest);
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        await sharp(img.src)
            .webp({ quality: 80 })
            .toFile(img.dest);
        console.log(`Converted: ${img.dest}`);
    }
}

processImages().catch(console.error);
