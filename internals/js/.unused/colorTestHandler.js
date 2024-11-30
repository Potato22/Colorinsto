
function updateColorTest(picker) {
    console.log(picker)
    //console.log(picker.toString('hex'));
    const newColor = picker.toString('hex');
    
    // Dispatch a custom event
    //carry new color in event
    const colorChangeEvent = new CustomEvent('colorChanged', { detail: newColor });
    document.dispatchEvent(colorChangeEvent);
    
    return newColor;
}
