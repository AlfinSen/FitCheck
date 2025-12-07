const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../public/costumes');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function createCostume(name, color, file) {
    // Draw a "shirt" shape with a neckline to avoid face overlap
    // Using a path that dips for the neck
    const svgImage = `
    <svg width="500" height="500" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="5"/>
                <feOffset dx="2" dy="4" result="offsetblur"/>
                <feComponentTransfer>
                    <feFuncA type="linear" slope="0.3"/>
                </feComponentTransfer>
                <feMerge>
                    <feMergeNode in="offsetblur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        <path d="M100,100 C100,100 180,140 250,140 C320,140 400,100 400,100 L420,200 L380,180 L380,480 L120,480 L120,180 L80,200 Z" fill="${color}" stroke="none" filter="url(#shadow)"/>
    </svg>
    `;

    await sharp(Buffer.from(svgImage))
        .png()
        .toFile(path.join(outputDir, file));

    console.log(`Created ${name} (${file})`);
}

async function generate() {
    await createCostume('Red T-Shirt', 'red', 'c1.png');
    await createCostume('Blue Hoodie', 'blue', 'c2.png');
    await createCostume('Black Jacket', 'black', 'c3.png');
    await createCostume('White Dress', 'white', 'c4.png');
}

generate().catch(console.error);
