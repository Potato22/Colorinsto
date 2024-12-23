const toastAligner = document.querySelector('.toastAlign');
const toastWrapper = document.querySelector('.toastWrap');
const toastIcon = document.querySelector('.toastIcon');
const toastTitle = document.querySelector('.toastTitle');
const toastContent = document.querySelector('.toastText');
const toastButtons = document.querySelector('.toastButtons');
const toastTransformWrap = document.querySelector('.toastTransformWrap');

function toastPush(content = {}, settings = {}) {
    toastQueue.push({ content, settings });
    if (!toasting) nextQueue();
}

const DEFAULT_TIMER = 2000;


let delayTimer, expiryTimer, resetTimer;
const toastQueue = [];
let toasting = false;

function resetTimers() {
    clearTimeout(delayTimer);
    clearTimeout(expiryTimer);
    clearTimeout(resetTimer);
}

function applyStyles(element, styles) {
    Object.assign(element.style, styles);
}

function toastDismiss() {
    resetTimers();
    toastAligner.classList.add('toasted');
    resetTimer = setTimeout(() => {
        toastWrapper.classList.remove('toastPushed', 'toastBoing');
        applyStyles(toastAligner, { display: 'none', pointerEvents: 'none' });
        nextQueue();
    }, 500);
}

function toastClear() {
    toastQueue.length = 0;
    toastDismiss();
}

const POSITION_PRESETS = {
    center: 'translate(0)',
    
    left: 'translateX(calc(-100vw / 3.9))',
    right: 'translateX(calc(100vw / 3.9))',
    top: 'translateY(calc(-100vh / 3))',
    bottom: 'translateY(calc(100vh / 3))',

    top_left: 'translate(calc(-100vw / 3.9), calc(-100vh / 3))',
    top_right: 'translate(calc(100vw / 3.9), calc(-100vh / 3))',
    bottom_left: 'translate(calc(100vw / 3.9), calc(100vh / 3))',
    bottom_right: 'translate(calc(100vw / 3.9), calc(100vh / 3))',
};

function setPosition(position) {

    if (typeof position === 'number') {

        toastTransformWrap.style.transform = `translateY(calc(100vh / ${position}))`;

    } else if (typeof position === 'object' && position.x !== undefined && position.y !== undefined) {
        const { x, y } = position;
        toastTransformWrap.style.transform = `translate(calc(${x}), calc(${y}))`
    } else {
        // Fallback to center if position is undefined or doesn't match
        const preset = POSITION_PRESETS[position] || POSITION_PRESETS.center;
        toastTransformWrap.style.transform = preset;
    }
}

function configureButtons(buttons) {
    toastButtons.innerHTML = '';
    if (!Array.isArray(buttons) || buttons.length === 0) return;

    const isVertical = buttons.length > 2 || buttons.length === 1;
    applyStyles(toastButtons, {
        flexDirection: isVertical ? 'column' : 'row',
        alignItems: isVertical ? 'center' : buttons.length === 1 ? 'space-between' : 'center',
        display: 'flex',
    });

    buttons.forEach(btn => {
        const btnElement = document.createElement('div');
        btnElement.textContent = btn.label || btn;
        btnElement.id = (btn.label || btn.id || '').replace(/\s+/g, '_').toLowerCase();
        btnElement.className = `tbButton${isVertical ? ' vertical' : ''}`;
        if (btn.highlight) btnElement.classList.add('highlight');
        if (typeof btn.onClick === 'function') btnElement.addEventListener('click', btn.onClick);
        toastButtons.appendChild(btnElement);
    });
}

function nextQueue() {
    if (toastQueue.length === 0) {
        toasting = false;
        return;
    }

    toasting = true;
    const { content, settings } = toastQueue.shift();
    const {
        title = '',
        text = '',
        icon = '',
        iconUrl = '',
        button = [],
    } = content;

    const {
        tone = 'fade',
        duration = DEFAULT_TIMER,
        delay = 0,
        position = 'center',
        hold = false,
        interactive = false,
        skippable = false,
    } = settings;

    resetTimers();

    delayTimer = setTimeout(() => {

        toastTitle.innerHTML = title;
        toastContent.innerHTML = text;
        toastIcon.style.setProperty('--toastIconUrl', `url(${iconUrl})`);

        switch (icon) {
            case 'warn':
                toastIcon.classList.add('tiWarn')
                break;
            case 'stop':
                toastIcon.classList.add('tiStop')
                break;

            default:
                break;
        }

        applyStyles(toastAligner, {
            display: 'grid',
            pointerEvents: interactive || skippable || button.length > 0 ? 'auto' : 'none',
        });

        toastAligner.classList.remove('toasted');
        toastWrapper.classList.add(tone === 'bounce' ? 'toastBoing' : 'toastPushed');

        setPosition(position);
        configureButtons(button);

        applyStyles(toastTitle, { display: title ? 'block' : 'none' });
        applyStyles(toastIcon, { display: iconUrl || icon ? 'block' : 'none' });
        applyStyles(toastButtons, { display: button.length > 0 ? 'flex' : 'none' });

        if (!hold && (!interactive || skippable) && button.length === 0) {
            expiryTimer = setTimeout(() => {
                toastDismiss();
            }, duration);
        }

        if ((interactive || skippable) && button.length === 0) {
            toastAligner.addEventListener('click', toastDismiss);
        } else {
            toastAligner.removeEventListener('click', toastDismiss)
        }

    }, delay);
}

export { toastPush, toastDismiss, toastClear };