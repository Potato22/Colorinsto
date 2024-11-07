/**
 * hex -> hsl
 * @param {string} hex - Hex
 * @returns {{h: int, s: int, l: int}} HSL
 */
const hexToHSL = (hex) => {
  hex = hex.replace(/^#/, '');
  
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  
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
    h: h * 360,
    s: s * 100,
    l: l * 100
  };
};

/**
 * HSL -> HEX
 * @param {int} h - Hue (0-360)
 * @param {int} s - Saturation (0-100)
 * @param {int} l - Lightness (0-100)
 * @returns {string} Hex color code
 */
const hslToHex = (h, s, l) => {
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

  const toHex = (x) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

/**
 * NORMALIZER hue clamp 0-300
 * @param {int} hue
 * @returns {int} Normalized hue val
 */
const normalizeHue = (hue) => ((hue % 360) + 360) % 360;

/**
 * TRANFROM MODES
 * @readonly
 * @enum {string}
 */
export const HARMONICS = {
  COMPLEMENTARY: 'complementary',
  ANALOGOUS_LEFT: 'analogous-left',
  ANALOGOUS_RIGHT: 'analogous-right',
  TRIADIC_LEFT: 'triadic-left',
  TRIADIC_RIGHT: 'triadic-right',
  SPLIT_COMPLEMENTARY_LEFT: 'split-complementary-left',
  SPLIT_COMPLEMENTARY_RIGHT: 'split-complementary-right'
};

/**
 * Transforms a color according to the specified harmonic
 * @param {string} hexColor - The hex color code to transform
 * @param {string} harmonic - The harmonic transformation to apply
 * @returns {string} Transformed hex color code
 * @throws {Error} If harmonic type is not recognized
 */
export const colorHarmonicTransform = (hexColor, harmonic) => {
  const hsl = hexToHSL(hexColor);
  
  switch (harmonic.toLowerCase()) {
    case HARMONICS.COMPLEMENTARY:
      return hslToHex(normalizeHue(hsl.h + 180), hsl.s, hsl.l);
      
    case HARMONICS.ANALOGOUS_LEFT:
      return hslToHex(normalizeHue(hsl.h - 30), hsl.s, hsl.l);
      
    case HARMONICS.ANALOGOUS_RIGHT:
      return hslToHex(normalizeHue(hsl.h + 30), hsl.s, hsl.l);
      
    case HARMONICS.TRIADIC_LEFT:
      return hslToHex(normalizeHue(hsl.h - 120), hsl.s, hsl.l);
      
    case HARMONICS.TRIADIC_RIGHT:
      return hslToHex(normalizeHue(hsl.h + 120), hsl.s, hsl.l);
      
    case HARMONICS.SPLIT_COMPLEMENTARY_LEFT:
      return hslToHex(normalizeHue(hsl.h + 150), hsl.s, hsl.l);
      
    case HARMONICS.SPLIT_COMPLEMENTARY_RIGHT:
      return hslToHex(normalizeHue(hsl.h - 150), hsl.s, hsl.l);
      
    default:
      throw new Error(`INVALID TRANSFORM METHOD: ${harmonic}`);
  }
};

// GLobalize
export { hexToHSL, hslToHex };