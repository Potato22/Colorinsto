import $ from "jquery";
import "@melloware/coloris/dist/coloris.css";
import Coloris, {
    init
} from "@melloware/coloris";
import paletteAppend from "./colorEngine";
import chroma, {
    random
} from 'chroma-js';

// Constants for time calculations
const ONE_DAY = 864e5; // 86400000 milliseconds = 1 day
const SEVEN_DAY = 6048e5; // 604800000 milliseconds = 7 days

// Function to check if the Terms of Service (TOS) have been accepted
function isTitleSkipped() {
    const titleEntered = localStorage.getItem("titleEntered");
    if (!titleEntered) {
        return false;
    }
    // Check if the stored timestamp is within the last 7 days
    const timeElapsed = Date.now() - new Date(titleEntered).getTime();
    return timeElapsed <= ONE_DAY;
}

// Function to record the acceptance of the TOS
function titleEntered() {
    // Store the current date and time as ISO string
    localStorage.setItem("titleEntered", (new Date()).toISOString());
}


let currentScene = 0
console.log('currentScene', currentScene)

const sceneTitle = $("#titleSc") //0
const sceneCameraPriming = $("#camModSc") //1
const scenePlayground = $("#playgroundSc") //2



function sceneHandler(sceneTarget) {
    switch (sceneTarget) {
        case 0:
            currentScene = 0

            sceneTitle.fadeIn();
            break;

        case 1:
            currentScene = 1

            sceneTitle.addClass('SCRIPT-sceneOutScaleUp')
            setTimeout(() => {
                sceneTitle.hide()
                sceneTitle.removeClass('SCRIPT-sceneOutScaleUp')
                scenePlayground.hide()
                sceneCameraPriming.show()
            }, 500);
            break;
        case 2:
            currentScene = 2

            sceneTitle.addClass('SCRIPT-sceneOutScaleDown')
            sceneCameraPriming.addClass('SCRIPT-sceneOutLeft')
            setTimeout(() => {
                sceneCameraPriming.hide()
                sceneCameraPriming.removeClass('SCRIPT-sceneOutLeft')
                sceneTitle.hide()
                sceneTitle.removeClass('SCRIPT-sceneOutScaleUp')
                scenePlayground.show()
                scenePlayground.addClass('SCRIPT-sceneInScaleDown')
            }, 1000);
            break;

        default:
            alert('eh?')
            break;
    }
    console.log('currentScene', currentScene)
}

//SCENE 0
if (isTitleSkipped()) {
    sceneHandler(2)
} else {
    sceneHandler(0)
}
const startButton = $('#startEvent')
startButton.on('click', function () {
    sceneHandler(2)
    titleEntered()
})



//SCENE 1
const cameraSprite = $(".cameraSprite")
const cameraDoor = $(".cameraDoor")
const cameraDoorLatch = $(".cameraDoorLatch")
const cartridgeWrap = $('.cartridgeWrap')

cameraDoor.on("click", function () {
    cameraDoorLatch.addClass('cameraDoorLatchPoked')
    setTimeout(() => {
        cameraDoor.addClass('cameraDoorOpened')
        setTimeout(() => {
            cartridgeWrap.addClass('modding')
        }, 500);
    }, 300);

    setTimeout(() => {
        cartridgeWrap.removeClass('modding')
        setTimeout(() => {
            cameraDoor.removeClass('cameraDoorOpened')
            cameraDoor.addClass('cameradoorClosed')
            cameraDoorLatch.removeClass('cameraDoorLatchPoked')
            setTimeout(() => {
                sceneHandler(2)
            }, 300);
        }, 200);
    }, 2000);
})

//SCENE 2
const wheel = document.getElementById('wheel');
const modes = wheel.querySelectorAll('.modes');
const mLights = document.querySelector('.modeLights');
const mTrue = document.querySelector('.modeTrue');
const mDay = document.querySelector('.modeDay');
const mNight = document.querySelector('.modeNight');
const angLights = Number(mLights.dataset.rotate);
const angTrue = Number(mTrue.dataset.rotate);
const angDay = Number(mDay.dataset.rotate);
const angNight = Number(mNight.dataset.rotate);

// MAP MODES
const modeElements = {
    lights: wheel.querySelector('.modeLights'),
    true: wheel.querySelector('.modeTrue'),
    day: wheel.querySelector('.modeDay'),
    night: wheel.querySelector('.modeNight')
};

const wheelOffset = 50;

function modeWheel(mode) {
    // OBJECT (const) AS ANGLE MAP
    const rotationAngles = {
        lights: wheelOffset - angLights,
        true: wheelOffset - angTrue,
        day: wheelOffset - angDay,
        night: wheelOffset - angNight
    };

    // IF MODE IS NOT MAPPED, WARN
    if (!rotationAngles.hasOwnProperty(mode)) {
        console.warn('Invalid mode:', mode);
        return;
    }

    // RESET CLASS ON CALL
    Object.values(modeElements).forEach(elem => elem.classList.remove('MODEACTIVE'));

    // IMMEDIATELY ADD CLASS TO NEW ACTIVE MODE
    modeElements[mode].classList.add('MODEACTIVE');

    // Get the current rotation angle
    const currentRotation = rotationAngles[mode];

    // Rotate the wheel
    wheel.style.transform = `rotate(${currentRotation}deg)`;

    // Rotate menu items to keep them horizontal
    modes.forEach(mode => {
        const baseRotate = parseInt(mode.dataset.rotate);
        mode.style.transform = `
            rotate(${baseRotate}deg) 
            translateY(-570px) 
            rotate(${-(baseRotate + currentRotation)}deg)
        `;
    });
}
//modeWheel('true')

const fxElem1 = document.querySelector('.cf1')
const fxElem2 = document.querySelector('.cf2')
const colorGlobParticles = document.querySelector('.colorglob')

function fxFilter(mode) {
    switch (mode) {
        case 'lights':
            colorGlobParticles.style.mixBlendMode = 'screen'

            fxElem1.style.opacity = '.5'
            fxElem1.style.filter = 'blur(30px)'
            fxElem1.style.backgroundColor = 'var(--global-theme)'
            fxElem1.style.mixBlendMode = 'overlay'

            fxElem2.style.opacity = '0'
            break;
        case 'true':
            colorGlobParticles.style.mixBlendMode = 'normal'

            fxElem1.style.filter = 'none'
            fxElem1.style.opacity = '0'
            fxElem2.style.opacity = '0'
            break;
        case 'day':
            colorGlobParticles.style.mixBlendMode = 'normal'

            fxElem1.style.filter = 'none'
            fxElem1.style.background = 'radial-gradient(circle at top left, rgba(255,255,245,1) 0%, rgba(255, 255, 245, 0.418) 100%)';
            fxElem1.style.mixBlendMode = 'overlay'
            fxElem1.style.opacity = '1'

            fxElem2.style.backgroundColor = 'rgb(31, 31, 41)';
            fxElem2.style.mixBlendMode = 'multiply';
            fxElem2.style.opacity = '.2';
            break;
        case 'night':
            colorGlobParticles.style.mixBlendMode = 'normal'

            fxElem1.style.backgroundColor = 'rgb(36, 51, 70)';
            fxElem1.style.mixBlendMode = 'multiply';
            fxElem1.style.opacity = '.5';

            fxElem2.style.filter = 'none'
            fxElem2.style.backgroundColor = '#000000';
            fxElem2.style.mixBlendMode = 'saturation'
            fxElem2.style.opacity = '.6'

            break;

        default:
            break;
    }
}

const theWheel = document.querySelector('.wheel');

const fadeDuration = 100;

//let explainText

let currentMode;

function modeHandler(selectedMode) {
    currentMode = selectedMode
    switch (selectedMode) {
        case 'modeLights':
            console.log('Lights mode selected');
            modeWheel('lights')
            fxFilter('lights')
            break;
        case 'modeTrue':
            console.log('True mode selected');
            modeWheel('true')
            fxFilter('true')
            break;
        case 'modeDay':
            console.log('Day mode selected');
            modeWheel('day')
            fxFilter('day')
            break;
        case 'modeNight':
            console.log('Night mode selected');
            modeWheel('night')
            fxFilter('night')
            break;
    }
    return currentMode
}

// Transmit mode state
function getCurrentMode() {
    return currentMode;
}

export {
    modeHandler,
    getCurrentMode
}

theWheel.addEventListener('click', (event) => {
    // Find the closest parent with the 'modes' class
    const selectedMode = event.target.closest('.modes');

    if (selectedMode) {
        const modeClass = Array.from(selectedMode.classList)
            .find(cls => cls.startsWith('mode') && cls !== 'modes');

        modeHandler(modeClass)

    }
    theWheelContainer.style.zIndex = "0"
    filmWrapper.style.opacity = "1"
    filmWrapper.style.transform = "scale(1)"
});

modeHandler('modeTrue')

const theWheelContainer = document.querySelector('.wheelContainer');
const filmWrapper = document.querySelector('.filmWrap');
let enterTimeout, leaveTimeout;

$('.modes').on('mouseenter', function () {
    clearTimeout(leaveTimeout);

    let delay
    if (currentMode == 'modeNight') {
        delay = 100
    } else {
        delay = 800
    }
    console.log('delay', delay, 'currentMode', currentMode)
    enterTimeout = setTimeout(() => {
        theWheelContainer.style.zIndex = "5"
        filmWrapper.style.opacity = ".1"
        filmWrapper.style.transform = "scale(.9)"
    }, delay); // 100ms delay, adjust as needed
})

$('.modes').on('mouseleave', function () {
    // Clear any existing enter timeout to prevent conflicts
    clearTimeout(enterTimeout);

    leaveTimeout = setTimeout(() => {
        theWheelContainer.style.zIndex = "0"
        filmWrapper.style.opacity = "1"
        filmWrapper.style.transform = "scale(1)"
    }, 500); // 100ms delay, adjust as needed
})

let regenColor
let regenMode

//INSTANCING
Coloris({
    el: ".regenColInput",
    onChange: (color, input) => {
        regenColor = color
        input.style.backgroundColor = color
        if (randomMode == false) {
            document.querySelector('.regenButton').style.setProperty('--regen-color', color)
        }
    },
    wrap: false,
});


let regenAccentFallback = 'white'
document.querySelector('.regenButton').style.setProperty('--regen-color', regenAccentFallback)


document.addEventListener('coloris:pick', event => {
    const colorPickerClassName = event.detail.currentEl.className
    const colorPickerTargetColorValue = event.detail.currentEl.value
    console.log('global! ', colorPickerClassName, colorPickerTargetColorValue);

    //document.querySelector('.regenButton').style.setProperty('--regen-color', colorPickerTargetColorValue)

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
    //updateSets()
});

//REGEN UTIL
const genDropdown = $('.genDropdown')
const CHGOptions = $('.CHGOptions')

function updateDropdown(closed) {
    if (closed == true) {
        CHGOptions.addClass('dropdownClosed')
    } else [
        CHGOptions.removeClass('dropdownClosed')
    ]
}
genDropdown.on('click', function () {
    updateDropdown(false)
})

genDropdown.on('mouseleave', function () {
    updateDropdown(true)
})

//kept empty cus colorEngine already knows how to handle it
let selectedRegenMode
let randomMode = true

const CHGModeText = document.querySelector('.CHGModeText');

document.querySelector('.CHGOptions').addEventListener('click', event => {
    updateDropdown(true)
    // Find the closest parent with 'colorharmonyMode' class
    const targetRegenMode = event.target.closest('.colorharmonyMode');


    // Check if a valid div was clicked
    if (targetRegenMode) {
        // Extract the specific mode from the ID
        const mode = targetRegenMode.id.replace('CHG-', '');

        console.log(`Selected Color Harmony Mode: ${mode}`);


        switch (mode) {
            case 'random':
                randomMode = true
                CHGModeText.textContent = 'Random...'
                document.querySelector('.regenButton').style.setProperty('--regen-color', regenAccentFallback)
                break;
            case 'analogous':
                randomMode = false
                selectedRegenMode = 'analogous'
                CHGModeText.textContent = 'Analogous'
                if (!regenColor) {
                    document.querySelector('.regenButton').style.setProperty('--regen-color', regenAccentFallback)
                } else {
                    document.querySelector('.regenButton').style.setProperty('--regen-color', regenColor)
                }
                break;
            case 'splitComplementary':
                randomMode = false
                selectedRegenMode = 'splitComplementary'
                CHGModeText.textContent = 'Split Complementary'
                if (!regenColor) {
                    document.querySelector('.regenButton').style.setProperty('--regen-color', regenAccentFallback)
                } else {
                    document.querySelector('.regenButton').style.setProperty('--regen-color', regenColor)
                }
                break;
            case 'triadic':
                randomMode = false
                selectedRegenMode = 'triadic'
                CHGModeText.textContent = 'Triadic'
                if (!regenColor) {
                    document.querySelector('.regenButton').style.setProperty('--regen-color', regenAccentFallback)
                } else {
                    document.querySelector('.regenButton').style.setProperty('--regen-color', regenColor)
                }
                break;
            case 'tetradic':
                randomMode = false
                selectedRegenMode = 'tetradic'
                CHGModeText.textContent = 'Tertradic'
                if (!regenColor) {
                    document.querySelector('.regenButton').style.setProperty('--regen-color', regenAccentFallback)
                } else {
                    document.querySelector('.regenButton').style.setProperty('--regen-color', regenColor)
                }
                break;
            case 'complementary':
                randomMode = false
                selectedRegenMode = 'complementary'
                CHGModeText.textContent = 'Complementary'
                if (!regenColor) {
                    document.querySelector('.regenButton').style.setProperty('--regen-color', regenAccentFallback)
                } else {
                    document.querySelector('.regenButton').style.setProperty('--regen-color', regenColor)
                }
                break;

            default:
                break;
        }
    }
});

const regenButton = $('#regen')

regenButton.on('click', function () {
    if (randomMode == false) {
        paletteAppend(selectedRegenMode, regenColor)
    } else {
        paletteAppend()
        randomMode = false
    }
})

//for (let i = 0; i < 100; i++) {
//    setTimeout(() => {
//        paletteAppend();
//    }, i * 100);
//}