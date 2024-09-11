import chroma from 'chroma-js';
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