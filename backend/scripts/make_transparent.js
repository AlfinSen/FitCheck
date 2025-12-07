const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const COSTUME_DIR = path.join(__dirname, '../public/costumes');
const FILES = ['c1.png', 'c2.png', 'c3.png', 'c4.png'];

async function processImage(filename) {
    const filePath = path.join(COSTUME_DIR, filename);
    const tempPath = path.join(COSTUME_DIR, `temp_${filename}`);

    console.log(`Processing ${filename}...`);

    try {
        const { data, info } = await sharp(filePath)
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });

        // Iterate through pixels and make white pixels transparent
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // Threshold for "white" (e.g., > 240)
            if (r > 240 && g > 240 && b > 240) {
                data[i + 3] = 0; // Set alpha to 0
            }
        }

        await sharp(data, {
            raw: {
                width: info.width,
                height: info.height,
                channels: 4
            }
        })
            .png()
            .toFile(tempPath);

        // Replace original
        fs.unlinkSync(filePath);
        fs.renameSync(tempPath, filePath);
        console.log(`Done: ${filename}`);

    } catch (error) {
        console.error(`Error processing ${filename}:`, error);
    }
}

async function main() {
    for (const file of FILES) {
        await processImage(file);
    }
}

main();
