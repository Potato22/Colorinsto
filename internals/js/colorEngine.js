//COLOR HARMONIC RANDOMIZER
import ColorRandH from './colorRandHarmonics.js'
import chroma from 'chroma-js';
import {
    toastPush,
    toastDismiss,
    toastClear
} from "../../toaster/toaster"

// RAND UTIL
function random(min, max) {
    return Math.random() * (max - min) + min;
}

//analogous
//complementary
//triadic
//splitComplementary
//tetradic

function generateColorGlob(genMode, colorInput) {

    const gradients = document.getElementById('gradients');
    // ONCE CALLED AGAIN, CLEAR
    gradients.innerHTML = '';
    // RANGE
    const SCALE_RANGE = {
        min: 4,
        max: 5.0
    };
    const ROTATION_RANGE = {
        min: 0,
        max: 60
    };
    const POSITION_RANGE = {
        min: 10,
        max: 90
    }; // % of container

    const generatedGlobColors = [];
    // Create array to store blobs with their properties
    const blobs = [];

    // First, generate all blob data
    for (let i = 0; i < 10; i++) {
        const x = random(POSITION_RANGE.min, POSITION_RANGE.max);
        const y = random(POSITION_RANGE.min, POSITION_RANGE.max);
        const scale = random(SCALE_RANGE.min, SCALE_RANGE.max);
        const rotateX = random(ROTATION_RANGE.min, ROTATION_RANGE.max);
        const rotateY = random(ROTATION_RANGE.min, ROTATION_RANGE.max);

        //GEN COLOR
        let colorGenTarget
        switch (genMode) {
            case 'random':
                colorGenTarget = ColorRandH.randomGen();
                break;
            case 'analogous':
                colorGenTarget = ColorRandH.analogous(colorInput);
                break;
            //case 'splitComplementary':
            //    colorGenTarget = ColorRandH.splitComplementary(colorInput);
            //    break;
            case 'triadic':
                colorGenTarget = ColorRandH.triadic(colorInput);
                break;
            case 'tetradic':
                colorGenTarget = ColorRandH.tetradic(colorInput);
                break;
            case 'complementary':
                colorGenTarget = ColorRandH.complementary(colorInput);
                break;

            default:
                break;
        }

        generatedGlobColors.push(colorGenTarget);

        blobs.push({
            x,
            y,
            scale,
            rotateX,
            rotateY,
            color: colorGenTarget
        });
    }


    // Sort blobs by scale, largest first
    blobs.sort((a, b) => b.scale - a.scale);

    // Create and append elements in sorted order
    blobs.forEach((blob, index) => {
        const colorglob = document.createElement('div');
        colorglob.className = 'colorglob';

        colorglob.style.boxShadow = `0 0 10px ${blob.color}`;
        colorglob.style.backgroundColor = blob.color;
        colorglob.style.left = `${blob.x}%`;
        colorglob.style.top = `${blob.y}%`;
        colorglob.style.transform = `
            translate(-50%, -50%)
            scale(${blob.scale})
            rotateX(${blob.rotateX}deg)
            rotateY(${blob.rotateY}deg)
        `;
        // Set z-index based on size (smaller = higher z-index)
        colorglob.style.zIndex = blobs.length - index;

        gradients.appendChild(colorglob);
        gradients.style.backgroundColor = blob.color;
    });

    return generatedGlobColors;
}

function paletteAppend(genMode, colorInput) {
    
    if (!genMode || genMode === '') {
        console.log('[generateColorGlob] Empty or invalid mode of operation! Falling back to random')
        genMode = 'random'
    }
    console.log('[paletteAppend]', genMode, colorInput)

    function sortColorsByHue(colors) {
        return colors.sort((a, b) => {
            // Convert color to HSL to extract hue
            const hslA = hexToHSL(a);
            const hslB = hexToHSL(b);
            return hslA[0] - hslB[0];
        });
    }

    function hexToHSL(hex) {
        // Remove # if present
        hex = hex.replace('#', '');

        // Convert hex to RGB
        const r = parseInt(hex.substring(0, 2), 16) / 255;
        const g = parseInt(hex.substring(2, 4), 16) / 255;
        const b = parseInt(hex.substring(4, 6), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
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
            h *= 60;
        }

        return [h, s, l];
    }

    //CALL GLOBBER
    const pulledColors = sortColorsByHue(generateColorGlob(genMode, colorInput));

    //REPARSE IT TO CHROMA
    const chromaPulledColors = chroma.scale(pulledColors).colors(10)


    const pcells = document.querySelectorAll('.paletteCells');

    //PUSH COLOR TO GLOBAL THEME
    document.documentElement.style.setProperty('--global-theme', chroma.average(chromaPulledColors).brighten().saturate());

    [...pcells].forEach((cell, index) => {
        const hexColor = chromaPulledColors[index];
        cell.style.setProperty('--cellColor', hexColor);

        // Add click handler to copy color
        cell.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(hexColor);

                toastClear()
                toastPush({
                    text: `Copied! (<span style="color:${hexColor}; font-family: var(--fontSecondary)">${hexColor}</span>)`,
                }, {
                    tone: 'fade'
                })


            } catch (err) {
                console.error('Failed to copy:', err);
                toastPush({
                    text: `Something went wrong while copying. (<span style="color: var(--red1); font-family: var(--fontSecondary)">${err}</span>)`,
                }, {
                    tone: 'shake'
                })
            }
        });
    });

    console.log('glorbsbosbr', pulledColors, '\n chromad', chromaPulledColors)
}
paletteAppend('', );

export default paletteAppend;