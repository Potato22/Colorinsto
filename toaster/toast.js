const toastAligner = document.querySelector('.toastAlign');
const toastWrapper = document.querySelector('.toastWrap');
const toastIcon = document.querySelector('.toastIcon');
const toastTitle = document.querySelector('.toastTitle');
const toastContent = document.querySelector('.toastText');
const toastButtons = document.querySelector('.toastButtons');
const toastTransformWrap = document.querySelector('.toastTransformWrap');

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

function setPosition(position) {
    if (typeof position === 'number') {
        toastTransformWrap.style.transform = `translateY(calc(100vh / ${position}))`;
    } else if (typeof position === 'object' && position.x !== undefined && position.y !== undefined) {
        const { x, y } = position;
        toastTransformWrap.style.transform = `translate(calc(${x}), calc(${y}))`;
    } else {
        const POSITION_PRESETS = {
            center: 'translate(0)',
            left: 'translateX(calc(-100vw / 3.9))',
            right: 'translateX(calc(100vw / 3.9))',
            top: 'translateY(calc(-100vh / 3))',
            bottom: 'translateY(calc(100vh / 3))',
            top_left: 'translate(calc(-100vw / 3.9), calc(-100vh / 3))',
            top_right: 'translate(calc(100vw / 3.9), calc(-100vh / 3))',
            bottom_left: 'translate(calc(-100vw / 3.9), calc(100vh / 3))',
            bottom_right: 'translate(calc(100vw / 3.9), calc(100vh / 3))',
        };
        const preset = POSITION_PRESETS[position] || POSITION_PRESETS.center;
        toastTransformWrap.style.transform = preset;
    }
}

function configureButtons(buttons, forceVerticalButtons) {
    toastButtons.innerHTML = '';
    if (!Array.isArray(buttons) || buttons.length === 0) return;

    const isVertical = buttons.length > 2 || buttons.length === 1;
    applyStyles(toastButtons, {
        flexDirection: isVertical || forceVerticalButtons ? 'column' : 'row',
        alignItems: isVertical || forceVerticalButtons ? 'center' : buttons.length === 1 ? 'space-between' : 'center',
        display: 'flex',
    });

    buttons.forEach((btn) => {
        const btnElement = document.createElement('div');
        btnElement.textContent = btn.label || btn;
        btnElement.id = (btn.label || btn.id || '').replace(/\s+/g, '_').toLowerCase();
        btnElement.className = `tbButton${isVertical || forceVerticalButtons ? ' vertical' : ''}`;
        if (btn.highlight) btnElement.classList.add('highlight');

        const handleClick = async (event) => {
            try {
                // default behavior
                if (typeof btn.onClick === 'function') {
                    await btn.onClick(event);
                }
            } finally {
                // no dissmis n clear fallback
                toastDismiss();
            }
        };

        btnElement.addEventListener('click', handleClick);
        toastButtons.appendChild(btnElement);
    });
}

// Helper function to resolve asset URLs
function resolveIconUrl(iconFileName) {
    return new URL(`./icons/${iconFileName}`, import.meta.url).href;
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
        forceVerticalButtons = false,
        onQueue,
        onInteract,
    } = settings;

    // onQueue
    if (typeof onQueue === 'function') {
        onQueue();
    }

    resetTimers();

    delayTimer = setTimeout(() => {
        toastTitle.innerHTML = title;
        toastContent.innerHTML = text;

        // Resolve iconUrl dynamically if not provided
        const resolvedIconUrl = iconUrl || (icon && resolveIconUrl(`${icon}.png`)) || '';
        toastIcon.style.setProperty('--toastIconUrl', `url(${resolvedIconUrl})`);

        switch (icon) {
            case 'warn':
                toastIcon.classList.add('tiWarn');
                break;
            case 'stop':
                toastIcon.classList.add('tiStop');
                break;
            default:
                break;
        }

        applyStyles(toastAligner, {
            display: 'grid',
            pointerEvents: interactive || skippable || button.length > 0 ? 'auto' : 'none',
        });

        toastAligner.classList.remove('toasted');

        if (interactive || skippable) {
            toastAligner.classList.add('next');
        } else {
            toastAligner.classList.remove('next');
        }

        switch (tone) {
            case 'bounce':
                toastWrapper.classList.add('toastBoing');
                break;
            case 'shake':
                toastWrapper.classList.add('toastShake');
                break;
            case 'error':
                toastWrapper.classList.add('toastErr');
                break;
            default:
                toastWrapper.classList.add('toastPushed');
                break;
        }

        setPosition(position);
        configureButtons(button, forceVerticalButtons);

        applyStyles(toastTitle, { display: title ? 'block' : 'none' });
        applyStyles(toastIcon, { display: resolvedIconUrl || icon ? 'block' : 'none' });
        applyStyles(toastButtons, { display: button.length > 0 ? 'flex' : 'none' });

        if (!hold && (!interactive || skippable) && button.length === 0) {
            expiryTimer = setTimeout(() => {
                toastDismiss();
            }, duration);
        }

        if ((interactive || skippable) && button.length === 0) {

            //this shit took WAY too long to figure out
            //I'm giving the name fuck and you can't do anything about it
            //this shit the one handles the onInteract thing
            //i'm so fuckign tired 
            const fuck = () => {
                if (typeof onInteract === 'function') {
                    onInteract();
                }
                toastDismiss();
                toastAligner.removeEventListener('click', fuck);
            }

            toastAligner.addEventListener('click', fuck);
        } else {
            toastAligner.removeEventListener('click', toastDismiss);
        }
    }, delay);
}

function toastPush(content = {}, settings = {}) {
    toastQueue.push({ content, settings });
    if (!toasting) nextQueue();
}

export { toastPush, toastDismiss, toastClear };