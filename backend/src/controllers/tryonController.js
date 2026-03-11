const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { analyzeImageForTryOn } = require('../utils/nanoApiClient');
const costumes = require('../data/costumes.json');

async function tryOn(req, res) {
    console.log('Received try-on request');
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'User image is required' });
        }

        const { costumeId } = req.body;
        const costume = costumes.find(c => c.id == costumeId);

        if (!costume) {
            return res.status(404).json({ error: 'Costume not found' });
        }

        const userImagePath = req.file.path;
        const costumePath = path.join(__dirname, '../../', costume.image);

        let resultBuffer;

        if (fs.existsSync(costumePath)) {
            // 1. Prepare user image for analysis
            const userImage = sharp(userImagePath);
            const metadata = await userImage.metadata();

            // Resize to manageable size for AI analysis and processing
            const processWidth = 800;
            const scaleFactor = processWidth / metadata.width;
            const processHeight = Math.round(metadata.height * scaleFactor);

            const resizedUserBuffer = await userImage.resize(processWidth, processHeight).toBuffer();
            const userBase64 = resizedUserBuffer.toString('base64');

            // 2. Get Smart Positioning from Gemini
            const position = await analyzeImageForTryOn(userBase64);
            console.log("Positioning data:", position);

            // 3. Calculate composition parameters
            // position contains top, left, width, height in percentages
            const targetWidth = Math.round(processWidth * (position.width / 100));
            const targetLeft = Math.round(processWidth * (position.left / 100));
            const targetTop = Math.round(processHeight * (position.top / 100));

            // 4. Resize and Process costume
            // Resize to fit width
            let costumeBuffer = await sharp(costumePath)
                .resize(targetWidth)
                .toBuffer();

            // Simple white background removal (thresholding)
            // This assumes the costume has a white background
            const costumeImage = sharp(costumeBuffer);
            const { data, info } = await costumeImage
                .ensureAlpha()
                .raw()
                .toBuffer({ resolveWithObject: true });

            // Iterate through pixels and make white ones transparent
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                // Threshold for "white"
                // Lowered to 200 to catch shadows/off-white
                if (r > 200 && g > 200 && b > 200) {
                    data[i + 3] = 0; // Set alpha to 0
                }
            }

            // Debug: Check center pixel
            const centerIdx = (Math.floor(info.height / 2) * info.width + Math.floor(info.width / 2)) * 4;
            console.log(`Debug Pixel [Center]: R=${data[centerIdx]} G=${data[centerIdx + 1]} B=${data[centerIdx + 2]} A=${data[centerIdx + 3]}`);

            const processedCostume = await sharp(data, {
                raw: {
                    width: info.width,
                    height: info.height,
                    channels: 4
                }
            }).toBuffer();

            // 5. Composite
            resultBuffer = await sharp(resizedUserBuffer)
                .composite([{ input: processedCostume, top: targetTop, left: targetLeft }])
                .toBuffer();

            console.log("Generated smart composite image");
        } else {
            console.warn(`Costume image not found at ${costumePath}, returning original`);
            resultBuffer = await sharp(userImagePath).toBuffer();
        }

        const resultBase64 = resultBuffer.toString('base64');

        // Cleanup uploaded file
        fs.unlinkSync(userImagePath);

        res.json({ resultImage: resultBase64 });
    } catch (error) {
        console.error('Try-on error details:', error.message);
        console.error(error);
        res.status(500).json({ error: 'Failed to process try-on request', details: error.message });
    }
}

module.exports = { tryOn };
