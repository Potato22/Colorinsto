const toastAligner = document.querySelector('.toastAlign')
const toastWrapper = document.querySelector('.toastWrap')
const toastContent = document.querySelector('.toastDashes')
const DEFAULT_TIMER = 2000


let delayTimer, expiryTimer, resetTimer

function pushToast(content, settings = {}) {
    const {
        tone = "fade",
        duration = DEFAULT_TIMER,
        delay = 0
    } = settings;

    function toastDraw() {
        toastAligner.style.display = "grid";
    }

    function toastReset() {
        toastAligner.style.display = "none";
        toastWrapper.classList.remove('toastPushed', 'toastBoing')
    }

    //Reset
    clearTimeout(delayTimer)
    clearTimeout(expiryTimer)
    clearTimeout(resetTimer)
    //toastAligner.classList.add('toasted')
    //toastReset()



    delayTimer = setTimeout(() => {
        toastContent.innerHTML = content
        toastAligner.classList.remove('toasted')

        switch (tone) {
            case "fade":
                toastDraw()
                toastWrapper.classList.add('toastPushed')
                break;
            case "boing":
                toastDraw()
                toastWrapper.classList.add('toastBoing')
                break;

            default:
                toastWrapper.classList.add('toastPushed')
                break;
        }

        expiryTimer = setTimeout(() => {
            toastAligner.classList.add('toasted')
            resetTimer = setTimeout(() => {
                toastReset()
            }, 1000);
        }, duration);
    }, delay);


}
export default pushToast