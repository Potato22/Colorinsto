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
const hSelect = document.querySelector('.genDropdown');

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
    {
        element: hSelect,
        text: "Select a color harmonic to generate with...",
        explain: ''
    },
    {
        element: hRandom,
        text: "<b style='color:var(--global-theme)'>Random</b>",
        explain: "Disregard color input completely and go hog wild"
    },
    {
        element: hAnalogous,
        text: "<b style='color:var(--global-theme)'>Analogous</b>",
        explain: "Generate colors that are adjacent of the color input relative to the color wheel"
    },
    {
        element: hComplementary,
        text: "<b style='color:var(--global-theme)'>Complementary</b>",
        explain: "Generate colors opposite of the color input relative the color wheel"
    },
    {
        element: hTriadic,
        text: "<b style='color:var(--global-theme)'>Triadic</b>",
        explain: "Generate three triangular colors evenly spaced on the color wheel based of the color input"
    },
    {
        element: hTetradic,
        text: "<b style='color:var(--global-theme)'>Tetradic</b>",
        explain: "Generate four colors forming a rectangle on the color wheel based of the color input"
    }
];

// Add hover event listeners to each element
// Assuming jQuery is loaded
const $textBox = $('.textInteract');
const $textExplain = $('.textExplain');

const defaultText = '[ . . . ] ~';

// Predefine fade settings
const fadeDuration = 100;

let idle
primaryInteractive.forEach(({
    element,
    text,
    explain
}) => {

    $(element).on('mouseenter', function () {
        clearTimeout(idle)
        $textBox.fadeOut(fadeDuration, function () {
            $(this).html(text).fadeIn(fadeDuration);
        });
        $textExplain.fadeOut(fadeDuration, function () {
            $(this).html(explain).fadeIn(fadeDuration);
        })
    });

    //return to current active mode
    $(element).on('mouseleave', function () {
        const activeMode = getCurrentMode();

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
        }, 1000);
    });
});