import $ from "jquery";

let currentScene = 0
console.log('currentScene', currentScene)

const sceneTitle = $("#titleSc") //0
const sceneCameraPriming = $("#camModSc") //1
const scenePlayground = $("#playgroundSc") //2

sceneHandler(0)


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
                scenePlayground.hide()
                sceneCameraPriming.show()
            }, 500);
            break;
        case 2:
            currentScene = 2

            sceneCameraPriming.addClass('SCRIPT-sceneOutLeft')
            setTimeout(() => {
                sceneCameraPriming.hide()
                sceneTitle.hide()
                scenePlayground.show()
            }, 1000);
            break;

        default:
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

cameraDoor.on("click", function() {
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
            setTimeout(() => {
                cameraDoorLatch.removeClass('cameraDoorLatchPoked')
                sceneHandler(2)
            }, 500);
        }, 200);
    }, 2000);
})