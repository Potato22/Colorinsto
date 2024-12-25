import $ from "jquery";
import {
    getCurrentMode
} from "./sceneHandler";

//MODES
const modeLights = document.querySelector('.modeLights');
const modeTrue = document.querySelector('.modeTrue');
const modeDay = document.querySelector('.modeDay');
const modeNight = document.querySelector('.modeNight');

//color harmonics
//const hSelect = document.querySelector('.genDropdown');

const hRandom = document.querySelector('#CHG-random');
const hAnalogous = document.querySelector('#CHG-analogous');
const hComplementary = document.querySelector('#CHG-complementary');
const hTriadic = document.querySelector('#CHG-triadic');
const hTetradic = document.querySelector('#CHG-tetradic');

const primaryInteractive = [
    //Modes
    {
        id: 'modeLights',
        element: modeLights,
        text: "<b style='color:var(--global-theme)'>Lights Mode: </b>Simulate the colors as if it were glowing",
        explain: "Saturated and bright colors may appear whiter, while darker colors, although appearing brighter, turn pale or light-gray when they are actively illuminating."
    },
    {
        id: 'modeTrue',
        element: modeTrue,
        text: "<b style='color:var(--global-theme)'>True Mode: </b>See colors as is",
        explain: "So true."
    },
    {
        id: 'modeDay',
        element: modeDay,
        text: "<b style='color:var(--global-theme)'>Day Mode: </b>Simulate the impact of sunlight towards the generated colors",
        explain: `<b>Bezold–Brücke Shift:</b> At higher light intensity, colors may shift towards blue or yellow; for instance, reds may shift towards yellowish in increased brightness.<br><br>
        Do note that this can vary drastically depending on the material on which the colors were painted or printed; glossy materials may retain the saturation, but rougher surfaces may diffuse the reflection. Naturally, that means it would look softer and washed out.`
    },
    {
        id: 'modeNight',
        element: modeNight,
        text: "<b style='color:var(--global-theme)'>Night Mode: </b>Simulate the impact of night time towards the generated colors",
        explain: `<b>Purkinje Effect:</b> Under low light conditions, colors like blue and green exhibit a higher saturation effect compared with the darker tones of red. This occurs because night vision is dominated by rod cells, sensitive to shorter wavelengths (bluish), that shift our perception toward the colorants blue-green. <br><br>
        The human eye has three kinds of cones detecting red, green, and blue lights, while the rod cells perceive only brightness. When it's dim, the rods take over to make this shift in color perception.`,
    },

    //Harmonics
    //{
    //    element: hSelect,
    //    text: "Select a color harmonic to generate with...",
    //    explain: ''
    //},
    {
        element: hRandom,
        text: "<b style='color:var(--global-theme)'>Random</b>",
        explain: "Disregard color input completely and go hog wild"
    },
    {
        element: hAnalogous,
        text: "<b style='color:var(--global-theme)'>Analogous</b>",
        explain: "Generate colors adjacent to the color input relative to the color wheel<br><br>These are groups of colors that are neighboring each other within the color wheel. This pattern is most prominent in nature and is often used to illustrate natural elements and atmosphere or give the natural impression of a design."
    },
    {
        element: hComplementary,
        text: "<b style='color:var(--global-theme)'>Complementary</b>",
        explain: "Generate colors opposite of the color input relative to the color wheel<br><br>Complementary are pairs of colors that 'cancel' each other when combined, which produces a greyscale. Artists may not always use these colors to be blended together however, it is one of the several techniques used by artists to lure the viewer's eye or add visual emphasis to a certain spot of their artwork, design, or simply to maximize contrast."
    },
    {
        element: hTriadic,
        text: "<b style='color:var(--global-theme)'>Triadic</b>",
        explain: "Generate three triangular colors evenly spaced on the color wheel based on the color input<br><br>Part of a color scheme formula, is a 3-color combination: the base, and the two colors at least 120 and 240 degrees apart. This usually produces a vibrant and high contrast palette, although not as contrasting as the complementary, it is still an ideal technique to make a design or artwork 'pop' in the viewer's eye."
    },
    {
        element: hTetradic,
        text: "<b style='color:var(--global-theme)'>Tetradic</b>",
        explain: "Generate four colors forming a rectangle on the color wheel based on the color input<br><br>Due to the shape it forms in the color wheel, it forms complementary pairs, double in fact. This palette should not be used as is, as using all 4 colors equally will make the scheme look unpleasantly unbalanced. It needs at least 1 color as a dominant."
    }
];

// Add hover event listeners to each element
// Assuming jQuery is loaded
const $textBox = $('.textInteract');
const $textExplain = $('.textExplain');

const defaultText = '[ . . . ] ~';

// Predefine fade settings
const fadeDuration = 100;

let idle, debounce
primaryInteractive.forEach(({
    element,
    text,
    explain
}) => {

    $(element).on('mouseenter', function (event) {
        clearTimeout(idle)
        debounce = setTimeout(() => {
            //console.log(event.currentTarget)
            $textBox.fadeOut(fadeDuration, function () {
                $(this).html(text).fadeIn(fadeDuration);
            });
            $textExplain.fadeOut(fadeDuration, function () {
                $(this).html(explain).fadeIn(fadeDuration);
            })
        }, 200);
    });

    //return to current active mode
    $(element).on('mouseleave', function () {
        const activeMode = getCurrentMode();
        clearTimeout(debounce)
        // Find the matching mode object
        const activeModeObj = primaryInteractive.find(item => item.id === activeMode);

        idle = setTimeout(() => {
            if (activeModeObj) {
                $textBox.fadeOut(fadeDuration, function () {
                    $(this).html(activeModeObj.text).fadeIn(fadeDuration);
                });
                $textExplain.fadeOut(fadeDuration, function () {
                    $(this).html(activeModeObj.explain).fadeIn(fadeDuration);
                });
            } else {
                // Fallback to default text if no mode is found
                $textBox.fadeOut(fadeDuration, function () {
                    $(this).html(defaultText).fadeIn(fadeDuration);
                });
                $textExplain.fadeOut(fadeDuration, function () {
                    $(this).html('').fadeIn(fadeDuration);
                });
            }
        }, 2000);
    });
});