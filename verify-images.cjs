const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const glob = require('glob'); // Note: Assuming glob is available or we use recursive readdir

// Configuration
const IMAGES_DIR = path.resolve(__dirname, 'public/images/templates');
const TEMPLATES_DIR = path.resolve(__dirname, 'data/templates');
const MAX_SIZE_BYTES = 500 * 1024; // 500KB warning threshold

async function getAllFiles(dir) {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(entries.map((entry) => {
        const res = path.resolve(dir, entry.name);
        return entry.isDirectory() ? getAllFiles(res) : res;
    }));
    return Array.prototype.concat(...files);
}

async function verifyImages() {
    console.log('Starting verification...\n');
    const issues = [];
    const stats = { totalImages: 0, webpImages: 0, nonWebpImages: 0, oversizedImages: 0 };

    // 1. File System Check
    if (!fs.existsSync(IMAGES_DIR)) {
        console.error(`Image directory not found: ${IMAGES_DIR}`);
        return;
    }

    const allImages = await getAllFiles(IMAGES_DIR);
    stats.totalImages = allImages.length;

    console.log(`Checking ${stats.totalImages} image files...`);

    for (const imgPath of allImages) {
        const ext = path.extname(imgPath).toLowerCase();
        const size = (await fs.promises.stat(imgPath)).size;
        const relativePath = path.relative(process.cwd(), imgPath);

        if (ext !== '.webp') {
            issues.push(`[TYPE] Non-WebP format: ${relativePath}`);
            stats.nonWebpImages++;
        } else {
            stats.webpImages++;
        }

        if (size > MAX_SIZE_BYTES) {
            issues.push(`[SIZE] Oversized file (${(size / 1024).toFixed(1)}KB): ${relativePath}`);
            stats.oversizedImages++;
        }
    }

    // 2. Code Link Check
    console.log('\nChecking template code links...');
    const templateFiles = (await fs.promises.readdir(TEMPLATES_DIR)).filter(f => f.endsWith('.ts'));
    const missingLinks = [];
    let totalLinks = 0;

    for (const tFile of templateFiles) {
        const content = await fs.promises.readFile(path.join(TEMPLATES_DIR, tFile), 'utf8');
        const matches = content.matchAll(/mediaUrl:\s*'([^']+)'|imageUrl:\s*'([^']+)'|url:\s*'([^']+)'/g);

        for (const match of matches) {
            const url = match[1] || match[2] || match[3];
            if (url && url.startsWith('/images/')) {
                totalLinks++;
                // Remove query params if any (though usually static files don't have them in this project)
                const cleanUrl = url.split('?')[0];
                const localPath = path.join(process.cwd(), 'public', cleanUrl); // url starts with /

                if (!fs.existsSync(localPath)) {
                    missingLinks.push(`[LINK] Missing file for URL '${url}' in ${tFile}`);
                }
            }
        }
    }

    // Report
    console.log('\n=== Verification Report ===');
    console.log(`Total Images Scanned: ${stats.totalImages}`);
    console.log(`WebP Images: ${stats.webpImages}`);
    console.log(`Non-WebP Images: ${stats.nonWebpImages}`);
    console.log(`Oversized Images (>500KB): ${stats.oversizedImages}`);
    console.log(`Total Local Links Checked: ${totalLinks}`);
    console.log(`Broken Links: ${missingLinks.length}`);

    if (issues.length > 0 || missingLinks.length > 0) {
        console.log('\n=== Issues Found ===');
        issues.forEach(i => console.log(i));
        missingLinks.forEach(l => console.log(l));
    } else {
        console.log('\n✅ All checks passed! All images are WebP, properly sized, and correctly linked.');
    }
}

verifyImages().catch(console.error);
