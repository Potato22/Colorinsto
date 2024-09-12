import chroma from 'chroma-js';
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


const initColorSet = new Array("#FFFFFF", "#CCCCCC");
let initialColor = "#FFFFFF";
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
console.log(colorboxInitElem.style.backgroundColor);

function updateColors(newColor) {

    initialColor = newColor;
    const darkenedColor = chroma(initialColor).darken().hex(); // #a1c550

    colorboxInitElem.style.backgroundColor = initialColor;
    colorboxProcessedElem.style.backgroundColor = darkenedColor;
    console.log('single processor ', initialColor, '-', darkenedColor)
}

// Initial update
updateColors(initialColor);




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
//document.querySelectorAll('.singleColCompute').forEach(input => {
//    input.addEventListener('click', e => {
//        Coloris({
//            el: "#coloris",
//
//        });
//    });
//});

function box1Interact(color, input) {
    console.log('box1', color, input.className)
}

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
    console.log('current array: ', initColorSet)
    console.log('chromascale', chroma.scale(initColorSet).colors(5))

    const chromaScaleOutput = chroma.scale(initColorSet).mode('oklab').correctLightness().colors(10)

    const cells = document.querySelectorAll('[id="testCells"]');

    cells.forEach((cell, index) => {
        if (index < chromaScaleOutput.length) {
            cell.style.backgroundColor = chromaScaleOutput[index];
        }
    });
});