import $ from "jquery";
import "@melloware/coloris/dist/coloris.css";
import Coloris, {
    init
} from "@melloware/coloris";
import paletteAppend from "./colorEngine";

let currentScene = 0
console.log('currentScene', currentScene)

const sceneTitle = $("#titleSc") //0
const sceneCameraPriming = $("#camModSc") //1
const scenePlayground = $("#playgroundSc") //2

sceneHandler(2)


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

            sceneCameraPriming.addClass('SCRIPT-sceneOutLeft')
            setTimeout(() => {
                sceneCameraPriming.hide()
                sceneCameraPriming.removeClass('SCRIPT-sceneOutLeft')
                sceneTitle.hide()
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
const startButton = $('#startEvent')
startButton.on('click', function () {
    sceneHandler(1)
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
const mAlbedo = document.querySelector('.modeAlbedo');
const mDay = document.querySelector('.modeDay');
const mNight = document.querySelector('.modeNight');
const angLights = Number(mLights.dataset.rotate);
const angAlbedo = Number(mAlbedo.dataset.rotate);
const angDay = Number(mDay.dataset.rotate);
const angNight = Number(mNight.dataset.rotate);

// MAP MODES
const modeElements = {
    lights: wheel.querySelector('.modeLights'),
    albedo: wheel.querySelector('.modeAlbedo'),
    day: wheel.querySelector('.modeDay'),
    night: wheel.querySelector('.modeNight')
};

const wheelOffset = 50;

function modeWheel(mode) {
    // OBJECT (const) AS ANGLE MAP
    const rotationAngles = {
        lights: wheelOffset - angLights,
        albedo: wheelOffset - angAlbedo,
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

modeWheel('albedo')

//for (let i = 0; i < 10; i++) {
//    setTimeout(() => {
//        //modeWheel('22.5')
//    }, i * 200);
//}

const theWheel = document.querySelector('.wheel');

theWheel.addEventListener('click', (event) => {
    // Find the closest parent with the 'modes' class
    const selectedMode = event.target.closest('.modes');

    if (selectedMode) {
        const modeClass = Array.from(selectedMode.classList)
            .find(cls => cls.startsWith('mode') && cls !== 'modes');

        switch (modeClass) {
            case 'modeLights':
                console.log('Lights mode selected');
                modeWheel('lights')
                break;
            case 'modeAlbedo':
                console.log('Albedo mode selected');
                modeWheel('albedo')
                break;
            case 'modeDay':
                console.log('Day mode selected');
                modeWheel('day')
                break;
            case 'modeNight':
                console.log('Night mode selected');
                modeWheel('night')
                break;
        }
    }
});

const theWheelContainer = document.querySelector('.wheelContainer');
const filmWrapper = document.querySelector('.filmWrap');
let enterTimeout, leaveTimeout;

$('.modes').on('mouseenter', function () {
    // Clear any existing leave timeout to prevent conflicts
    clearTimeout(leaveTimeout);

    enterTimeout = setTimeout(() => {
        theWheelContainer.style.zIndex = "5"
        filmWrapper.style.opacity = ".1"
        filmWrapper.style.transform = "scale(.9)"
    }, 100); // 100ms delay, adjust as needed
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

//INSTANCING
Coloris({
    el: ".regenColInput",
    onChange: (color, input) => {
        regenColor = color
        input.style.backgroundColor = color
        document.querySelector('#regen').style.setProperty('--regen-color', color)
    },
    wrap: false,
});


let regenAccentFallback = 'white'
document.querySelector('#regen').style.setProperty('--regen-color', regenAccentFallback)


document.addEventListener('coloris:pick', event => {
    const colorPickerClassName = event.detail.currentEl.className
    const colorPickerTargetColorValue = event.detail.currentEl.value
    console.log('global! ', colorPickerClassName, colorPickerTargetColorValue);
    
    document.querySelector('#regen').style.setProperty('--regen-color', colorPickerTargetColorValue)

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
const regenButton = $('#regen')

regenButton.on('click', function(){
    paletteAppend(regenColor)
})

//for (let i = 0; i < 100; i++) {
//    setTimeout(() => {
//        paletteAppend();
//    }, i * 100);
//}