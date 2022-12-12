const hidingTimeouts = [];
export function show(element, _classname = 'show') {
    element.classList.remove('hide', 'hidden');
    element.classList.add(_classname);
    hidingTimeouts.forEach((timeout, idx) => {
        if (timeout.element === element) {
            clearTimeout(timeout.timeout);
            hidingTimeouts.splice(idx, 1);
        }
    });
}
export function showfast(element) {
    show(element, 'showed');
}

export function hide(element, _classname = 'hide') {
    element.classList.remove('show', 'showed');
    element.classList.add(_classname);
    hidingTimeouts.push({
        element: element,
        timeout: setTimeout(() => { element.classList.add('hidden'); }, 300)
    });
}
export function hidefast(element) {
    hide(element, 'hidden');
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
    element.classList.add("no-animations");
    element.style.removeProperty("height");

    setTimeout(() => {
        const toHeight = element.scrollHeight + "px";
        element.style.height = fromHeight;

        setTimeout(() => {
            element.classList.remove("no-animations");
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
