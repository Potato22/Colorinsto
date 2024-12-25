
class ColorRandH {
    static jitterRange = 5;

    static random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static addJitter(hue) {
        const jitter = this.random(-this.jitterRange, this.jitterRange);
        return (hue + jitter + 360) % 360;
    }

    static hexToRgb(hex) {
        hex = hex.replace(/^#/, '');
        const bigint = parseInt(hex, 16);
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255
        };
    }

    static rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }

            h /= 6;
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }

    static hslToRgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    static rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }

    static getHslFromHex(hexColor) {
        const rgb = this.hexToRgb(hexColor);
        return this.rgbToHsl(rgb.r, rgb.g, rgb.b);
    }

    static generateColorFromHue(hue, s = 70, l = 50) {
        const rgb = this.hslToRgb(this.addJitter(hue), s, l);
        return this.rgbToHex(rgb.r, rgb.g, rgb.b);
    }

    static getRandomBaseHsl() {
        return {
            h: this.random(0, 360),
            s: this.random(30, 80), // Avoiding extremes for better visibility
            l: this.random(30, 70) // Avoiding extremes for better visibility
        };
    }

    static randomGen() {
        let hsl = this.getRandomBaseHsl();
        return this.generateColorFromHue(hsl.h, hsl.s, hsl.l);
    }
    
    //color input blank = random
    static analogous(baseColor = null, colorSpan = 80) {
        let hsl;
        if (baseColor) {
            hsl = this.getHslFromHex(baseColor);
        } else {
            hsl = this.getRandomBaseHsl();
        }
        // Generate a random shift within the specified range
        const shift = this.random(-colorSpan, colorSpan);
        return this.generateColorFromHue((hsl.h + shift + 360) % 360, hsl.s, hsl.l);
    }

    static complementary(baseColor = null, colorSpan = 60) {
        let hsl;
        if (baseColor) {
            hsl = this.getHslFromHex(baseColor);
        } else {
            hsl = this.getRandomBaseHsl();
        }
        
        // Generate complementary color
        const complementaryHue = (hsl.h + 180 + this.random(-colorSpan, colorSpan) + 360) % 360;
        const complementaryColor = this.generateColorFromHue(complementaryHue, hsl.s, hsl.l);
        
        // Decide whether to return the original color or the complementary color
        return this.random(0, 1) === 0 ? baseColor || this.rgbToHex(this.hslToRgb(hsl.h, hsl.s, hsl.l).r, this.hslToRgb(hsl.h, hsl.s, hsl.l).g, this.hslToRgb(hsl.h, hsl.s, hsl.l).b) : complementaryColor;
    }

    static triadic(baseColor = null, colorSpan = 40) {
        let hsl;
        if (baseColor) {
            hsl = this.getHslFromHex(baseColor);
        } else {
            hsl = this.getRandomBaseHsl();
        }
        
        const shifts = [120, 240];
        const baseShift = shifts[this.random(0, 1)];
        const shift = this.random(-colorSpan, colorSpan);
        
        // Generate triadic color
        const triadicHue = (hsl.h + baseShift + shift + 360) % 360;
        const triadicColor = this.generateColorFromHue(triadicHue, hsl.s, hsl.l);
        
        // Randomly decide whether to return the original color or the triadic color
        return this.random(0, 1) === 0 ? 
            baseColor || this.rgbToHex(this.hslToRgb(hsl.h, hsl.s, hsl.l).r, this.hslToRgb(hsl.h, hsl.s, hsl.l).g, this.hslToRgb(hsl.h, hsl.s, hsl.l).b) : 
            triadicColor;
    }
    
    static tetradic(baseColor = null, colorSpan = 30) {
        let hsl;
        if (baseColor) {
            hsl = this.getHslFromHex(baseColor);
        } else {
            hsl = this.getRandomBaseHsl();
        }
        
        const shifts = [90, 180, 270];
        const baseShift = shifts[this.random(0, 2)];
        const shift = this.random(-colorSpan, colorSpan);
        
        // Generate tetradic color
        const tetradicHue = (hsl.h + baseShift + shift + 360) % 360;
        const tetradicColor = this.generateColorFromHue(tetradicHue, hsl.s, hsl.l);
        
        // Randomly decide whether to return the original color or the tetradic color
        return this.random(0, 1) === 0 ? 
            baseColor || this.rgbToHex(this.hslToRgb(hsl.h, hsl.s, hsl.l).r, this.hslToRgb(hsl.h, hsl.s, hsl.l).g, this.hslToRgb(hsl.h, hsl.s, hsl.l).b) : 
            tetradicColor;
    }
    //static splitComplementary(baseColor = null, colorSpan = 60) {
    //    let hsl;
    //    if (baseColor) {
    //        hsl = this.getHslFromHex(baseColor);
    //    } else {
    //        hsl = this.getRandomBaseHsl();
    //    }
    //    const shifts = [150, 210];
    //    const baseShift = shifts[this.random(0, 1)];
    //    const shift = this.random(-colorSpan, colorSpan)
    //    return this.generateColorFromHue((hsl.h + baseShift + shift + 360) % 360, hsl.s, hsl.l);
    //    //NEED REWORK
    //}
}

export default ColorRandH;