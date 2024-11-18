import $ from 'jquery'
import chroma from 'chroma-js';
import {
    colorHarmonicTransform,
    HARMONICS
} from './colorHarmonicsProcessor';
import "@melloware/coloris/dist/coloris.css";
import Coloris, {
    init
} from "@melloware/coloris";
Coloris.init();
//coloris config
Coloris({
    themeMode: 'dark',
    alpha: false,
    formatToggle: true,
    clearButton: true,
    clearLabel: 'Clear',
})


const initColorSet = new Array(chroma.random(), chroma.random());
let initialColor = chroma.random();


//INSTANCING
Coloris({
    el: ".singleColCompute",
    onChange: (color, input) => {
        initialColor = color
        updateColors(initialColor)
        input.style.backgroundColor = color
    },
    wrap: false,
});

const colorboxInitElem = document.querySelector("#colorboxInit")
const colorboxProcessedElem = document.querySelector("#colorboxProcessed")
const colorboxComplementary = document.querySelector("#harmonicComplementary")
const colorboxAnalogous = document.querySelector("#harmonicAnalogous")
console.log(colorboxInitElem.style.backgroundColor);

//SIMPLE COLOR PROCESSING TEST
function updateColors(newColor) {

    initialColor = newColor;
    const darkenedColor = chroma(initialColor).darken().hex();
    const complementaryOut = colorHarmonicTransform(chroma(initialColor).hex(), HARMONICS.COMPLEMENTARY);
    const analogousOut = colorHarmonicTransform(chroma(initialColor).hex(), HARMONICS.ANALOGOUS_RIGHT);

    //UPDATE PREVIEWS
    colorboxInitElem.style.backgroundColor = initialColor;
    //AND ITS CELLS
    colorboxProcessedElem.style.backgroundColor = darkenedColor;
    colorboxComplementary.style.backgroundColor = complementaryOut;
    colorboxAnalogous.style.backgroundColor = analogousOut;

    console.log('single processor ', initialColor, '-', darkenedColor)
}

// UPDATE IMMEDIATELY ON LOAD
updateColors(initialColor);
initLoadColSet();

function initLoadColSet() {
    //REFERENCE RANDOMIZED COLORSET TO COLOR PICKER BUTTONS
    document.querySelector('.singleColCompute').style.backgroundColor = initialColor;
    document.querySelector('.startCol').style.backgroundColor = initColorSet[0];
    document.querySelector('.endCol').style.backgroundColor = initColorSet[1];
    updateSets();
}

function updateSets() {
    console.log('current array: ', initColorSet)
    console.log('chromascale', chroma.scale(initColorSet).colors(5))
    //REFERENCE ARRAY OF [[TWO]] COLORS INTO CHROMA SCALE AND OUTPUT TO CELLS
    const chromaScaleOutput = chroma.scale(initColorSet).mode('oklab').correctLightness().colors(10)

    const cells = document.querySelectorAll('.testCells');
    const cellsComplementary = document.querySelectorAll('.testCellsComplementary');
    const cellsAnalogous = document.querySelectorAll('.testCellsAnalogous');
    //RECURSIVE UPDATER FOR EACH CELLS
    [...document.querySelectorAll('.testCells')].map((cell, index) => {
        cell.style.backgroundColor = chromaScaleOutput[index];
    });
    [...document.querySelectorAll('.testCellsComplementary')].map((cell, index) => {
        cell.style.backgroundColor = colorHarmonicTransform(chromaScaleOutput[index], HARMONICS.COMPLEMENTARY);
    });
    [...document.querySelectorAll('.testCellsAnalogous')].map((cell, index) => {
        cell.style.backgroundColor = colorHarmonicTransform(chromaScaleOutput[index], HARMONICS.ANALOGOUS_RIGHT);
    });
}



//CELLS COLORIS INSTANCE
Coloris.setInstance('.startCol', {
    onChange: (color, input) => {
        initColorSet[0] = color
        input.style.backgroundColor = color
    }
});
Coloris.setInstance('.endCol', {
    onChange: (color, input) => {
        initColorSet[1] = color
        input.style.backgroundColor = color
    }
});

// You can still use the global event listener if needed
document.addEventListener('coloris:pick', event => {
    const colorPickerClassName = event.detail.currentEl.className
    const colorPickerTargetColorValue = event.detail.currentEl.value
    console.log('global! ', colorPickerClassName, colorPickerTargetColorValue);

    switch (colorPickerClassName) {
        case "startCol":
            //alert('box 1 ' + colorPickerTargetColorValue)
            break;
        case "endCol":
            //alert('box 2 ' + colorPickerTargetColorValue)
            break;

        default:
            break;
    }
    updateSets()
});


 $('.testDev').hide();
