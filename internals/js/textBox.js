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
        explain: "Colors may appear whiter and darker colors turning pale when it is actively illuminating."
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
        explain: "Colors under direct sunlight may look washed out and brighter on a clear day because of the intense reflection of sunlight. Besides the additional ambient light scattered by the blue sky."
    },
    {
        id: 'modeNight',
        element: modeNight,
        text: "<b style='color:var(--global-theme)'>Night Mode: </b>Simulate the impact of night time towards the generated colors",
        explain: "In the dark, your perception of color becomes blue-ish. A human eye has three color cones and luminoscity cones that only detect brightness. However, your blue cones in particular happens to be the most sensitive of all three color cones."
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
        explain: "Generate colors that are adjacent of the color input relative to the color wheel<br><br>These are group of colors that are neighboring of each other within the color wheel. This pattern is most prominent in nature and is often used to illustrate natural elements and atmosphere or give the natural impression of a design."
    },
    {
        element: hComplementary,
        text: "<b style='color:var(--global-theme)'>Complementary</b>",
        explain: "Generate colors opposite of the color input relative the color wheel<br><br>Complementary are pairs of colors that 'cancels' each other when combined, which produces a chromaless color (greyscale). Artists may not always use these colors to be combined however, more of a technique to lure the viewer's eye or add visual emphasis to a certain spot of their artwork or design."
    },
    {
        element: hTriadic,
        text: "<b style='color:var(--global-theme)'>Triadic</b>",
        explain: "Generate three triangular colors evenly spaced on the color wheel based of the color input<br><br>Part of a color scheme formula, is a 3-color combination: the base, and the two colors that are at least 120 and 240 degrees apart. This usually produces a vibrant and high contrast palette, although not as contrasting as the complementary, it is still ideal tecnhique to make a design or artwork 'pop' in viewer's eye."
    },
    {
        element: hTetradic,
        text: "<b style='color:var(--global-theme)'>Tetradic</b>",
        explain: "Generate four colors forming a rectangle on the color wheel based of the color input<br><br>Due to the shape it forms in the color wheel, it forms complementary pairs, double in fact. The this palette should not be used as is, as using all 4 colors equally will make the scheme looks unpleasantly unbalanced. It needs at least 1 color as a dominant."
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

    $(element).on('mouseenter', function(event) {
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
        }, 5000);
    });
});