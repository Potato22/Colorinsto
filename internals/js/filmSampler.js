class ColorSampler {
    constructor(targetElement, samplerElement, options = {}) {
        this.targetElement = targetElement;
        this.samplerElement = samplerElement;
        
        this.options = {
            sampleSize: options.sampleSize || 5,
            resolution: options.resolution || 10,
            colorSpace: options.colorSpace || 'hex'
        };
    }

    sampleColors() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const rect = this.samplerElement.getBoundingClientRect();
        const gradient = this.getGradientColors();

        canvas.width = rect.width;
        canvas.height = rect.height;

        // Create gradient on canvas
        const gradientObj = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.forEach((color, index) => {
            gradientObj.addColorStop(index / (gradient.length - 1), color);
        });

        ctx.fillStyle = gradientObj;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        const colorMap = new Map();

        for (let y = 0; y < canvas.height; y += this.options.resolution) {
            for (let x = 0; x < canvas.width; x += this.options.resolution) {
                const index = (y * canvas.width + x) * 4;
                const r = pixels[index];
                const g = pixels[index + 1];
                const b = pixels[index + 2];
                const a = pixels[index + 3];

                if (a > 0) {
                    const colorKey = this.formatColor(r, g, b);
                    colorMap.set(colorKey, (colorMap.get(colorKey) || 0) + 1);
                }
            }
        }

        return Array.from(colorMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, this.options.sampleSize)
            .map(entry => entry[0]);
    }

    getGradientColors() {
        const backgroundStyle = getComputedStyle(this.targetElement).background;
        const colorMatches = backgroundStyle.match(/rgb\([^)]+\)/g);
        return colorMatches || [];
    }

    formatColor(r, g, b) {
        return `#${[r,g,b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('')}`;
    }
}

function sampleColors() {
    const targetElement = document.querySelector('#colorful-background');
    const samplerElement = document.querySelector('#color-sampler');
    const colorDisplay = document.querySelector('#color-display');

    const sampler = new ColorSampler(targetElement, samplerElement, {
        sampleSize: 5,
        resolution: 10,
        colorSpace: 'hex'
    });

    const dominantColors = sampler.sampleColors();
    
    colorDisplay.innerHTML = ''; // Clear previous colors
    dominantColors.forEach(color => {
        const colorBox = document.createElement('div');
        colorBox.className = 'color-box';
        colorBox.style.backgroundColor = color;
        colorDisplay.appendChild(colorBox);
    });
}

function paletteAppend() {
    const pcells = document.querySelectorAll('.paletteCells');
    [...pcells].map((cell, index) => {
        cell.style.setProperty('--cellColor', reduxPulledColors[index])
    });

    console.log('glorbsbosbr', pulledColors)
}