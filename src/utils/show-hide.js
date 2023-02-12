const hidingTimeouts = [];
export function show(element, _classname = '__show') {
    element.classList.remove('__hide', '__hidden');
    element.classList.add(_classname);
    hidingTimeouts.forEach((timeout, idx) => {
        if (timeout.element === element) {
            clearTimeout(timeout.timeout);
            hidingTimeouts.splice(idx, 1);
        }
    });
}
export function showfast(element) {
    show(element, '__showed');
}

export function __hide(element, _classname = '__hide') {
    element.classList.remove('__show', '__showed');
    element.classList.add(_classname);
    hidingTimeouts.push({
        element: element,
        timeout: setTimeout(() => { element.classList.add('__hidden'); }, 300)
    });
}
export function __hidefast(element) {
    __hide(element, '__hidden');
}


export function isClosedRoll(element) {
    return element.getAttribute('data-open-roll') === null;
}
export function closeRoll(element) {
    element.removeAttribute('data-open-roll');
    element.style.height = element.scrollHeight + "px";
    element.classList.add('closed');
    setTimeout(() => {
        element.style.removeProperty('height');
    }, 20);
}
export function freezeHeight(element) {
    element.style.height = element.scrollHeight + "px";
}
export function openRoll(element) {
    element.setAttribute('data-open-roll', '');
    element.style.height = element.scrollHeight + "px";
    setTimeout(() => {
        element.style.removeProperty('height');
        element.classList.remove('closed');
    }, 300)
}
export function fastRoll(element) {
    element.setAttribute('data-open-roll', '');
    const buffer = element.style.transition;
    element.style.transition = 'none';
    element.style.height = 'auto';
    element.style.height = element.scrollHeight + "px";
    element.style.transition = buffer;
}


export async function closeRollList(element) {
    const fromHeight = element.style.height;
    element.classList.add("__no-animations");
    element.style.removeProperty("height");

    setTimeout(() => {
        const toHeight = element.scrollHeight + "px";
        element.style.height = fromHeight;

        setTimeout(() => {
            element.classList.remove("__no-animations");
            element.style.height = toHeight;
        }, 20);
    }, 1);
}
export function openRollList(element) {
    element.setAttribute('data-open-roll', '');
    element.style.height = element.scrollHeight + "px";
    setTimeout(() => {
        element.classList.remove('closed');
    }, 300)
}
