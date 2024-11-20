class ColorRandH {
    // Make all methods static
    static jitterRange = 10;

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
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
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
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
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

    static getHueFromHex(hexColor) {
        const rgb = this.hexToRgb(hexColor);
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        return hsl.h;
    }

    static generateColorFromHue(hue) {
        const rgb = this.hslToRgb(this.addJitter(hue), 70, 50);
        return this.rgbToHex(rgb.r, rgb.g, rgb.b);
    }

    static getBaseHue(baseColor) {
        return baseColor ? this.getHueFromHex(baseColor) : this.random(0, 360);
    }

    static analogous(baseColor = null) {
        const baseHue = this.getBaseHue(baseColor);
        const shift = this.random(0, 1) ? 30 : -30;
        return this.generateColorFromHue((baseHue + shift + 360) % 360);
    }

    static complementary(baseColor = null) {
        const baseHue = this.getBaseHue(baseColor);
        return this.generateColorFromHue((baseHue + 180) % 360);
    }

    static triadic(baseColor = null) {
        const baseHue = this.getBaseHue(baseColor);
        const shift = this.random(0, 1) ? 120 : 240;
        return this.generateColorFromHue((baseHue + shift) % 360);
    }

    static splitComplementary(baseColor = null) {
        const baseHue = this.getBaseHue(baseColor);
        const shift = this.random(0, 1) ? 150 : 210;
        return this.generateColorFromHue((baseHue + shift) % 360);
    }

    static tetradic(baseColor = null) {
        const baseHue = this.getBaseHue(baseColor);
        const shifts = [90, 180, 270];
        const shift = shifts[this.random(0, 2)];
        return this.generateColorFromHue((baseHue + shift) % 360);
    }
}

export default ColorRandH;