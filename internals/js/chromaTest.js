import chroma from 'chroma-js';
import "@melloware/coloris/dist/coloris.css";
import Coloris from "@melloware/coloris";
Coloris.init();

//INSTANCING
document.querySelectorAll('.singleColCompute').forEach(input => {
    input.addEventListener('click', e => {
        Coloris({
            el: "#coloris",
            themeMode: 'dark',
            alpha: false,
            format: 'hex',
            clearButton: true,
            clearLabel: 'Clear'
        });
    });
});

// Initialize Coloris with specific options for different input groups
document.querySelectorAll('.color-fields').forEach(input => {
    input.addEventListener('click', e => {
        Coloris({
            theme: 'default',
            themeMode: 'light',
            onChange: (color, input) => {
                //func
                console.log('box1:', color, input);
            }
        });
    });
});
let box2dat = ""
document.querySelectorAll('.special-color-fields').forEach(input => {
    input.addEventListener('click', e => {
        Coloris({
            theme: 'polaroid',
            themeMode: 'dark',
            onChange: (color, input) => {
                //func
                console.log('box2', color, input);
                box2dat = color
            }
        });
    });
});

// You can still use the global event listener if needed
document.addEventListener('coloris:pick', event => {
    console.log('global', event.detail.color);
    console.log(box2dat);
    console.log(event.detail.currentEl.className, event.detail.currentEl.value);
});


//document.addEventListener('coloris:pick', event => {
//    console.log('New color', event.detail.color);
//});
const colorboxInitElem = document.querySelector("#colorboxInit")
const colorboxProcessedElem = document.querySelector("#colorboxProcessed")

let initialColor = "#D4F880";
console.log(colorboxInitElem.style.backgroundColor);

function updateColors(newColor) {
    initialColor = newColor;
    const darkenedColor = chroma(initialColor).darken().hex(); // #a1c550

    colorboxInitElem.style.backgroundColor = initialColor;
    colorboxProcessedElem.style.backgroundColor = darkenedColor;
    console.log(initialColor, '-', darkenedColor)
}

// Initial update
updateColors(initialColor);

// Listen for the custom colorChanged event
document.addEventListener('colorChanged', (event) => {
    updateColors(event.detail);
});