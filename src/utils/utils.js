import {BASE_URL_PATH} from "../constants";

export function getChildrenHeight(el) {
    const children = Array.from(el.children);
    let res = 0;
    if (!children)
        return res;
    children.forEach((child) => {
        res += child.scrollHeight;
    })
    return res;
}

const _timedTimeouts = [];
export function setTimedClass(elements, className, timeout = 1500) {
    _timedTimeouts.forEach((timeout, idxTime) => {
        elements.forEach((el, idxEl) => {
            if (el === timeout.element) {
                clearTimeout(timeout.timeout);
                _timedTimeouts.splice(idxTime, 1);
            }
        });
    });
    elements.forEach(element => {
        element.classList.add(className);

        _timedTimeouts.push({
            element: element,
            timeout: setTimeout(() => element.classList.remove(className), timeout)
        });
    });
}

export function deepClone(obj = {}) {
    return JSON.parse(JSON.stringify(obj));
}

export async function hashSHA256(str) {
    const msgBuffer = new TextEncoder('utf-8').encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
}

export function generateUid(len) {
    const arr = new Uint8Array((len || 40) / 2);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, (dec) => dec.toString(16).padStart(2, "0")).join('');
}

export function secondsToStrTime(seconds) {
    let val, units;
    if (seconds < 60) {
        val = seconds;
        units = 'сек';
    } else if (seconds < 60*60) {
        val = seconds / 60;
        units = 'мин';
    } else if (seconds < 60*60*24) {
        val = seconds / (60*60);
        units = 'ч';
    } else if (seconds < 60*60*24*30) {
        val = seconds / (60*60*24);
        units = 'дн';
    } else if (seconds < 60*60*24*365) {
        val = seconds / (60*60*24*30);
        units = 'мес';
    } else {
        val = seconds / (60*60*24*365);
        units = 'лет';
    }
    return val.toFixed(1).toString() + ' ' + units;
}

export function dateToStr(date, strict=false) {
    const now = new Date();
    date = new Date(date);
    const dateYear = date.getFullYear();
    const dateMonth = date.getMonth();
    const dateDay = date.getDate();

    let year = '';
    if (now.getFullYear() !== dateYear)
        year = ' ' + dateYear;
    const months = ['янв', 'фев', 'марта', 'апр', 'мая', 'июня', 'июля', 'фвг', 'сент', 'окт', 'ноя', 'дек'];
    if (!strict)
        return `${dateDay} ${months[Number(dateMonth)]}${year}`;
    return `${String(dateDay).padStart(2, '0')}.${String(dateMonth).padStart(2, '0')}.${String(dateYear).padStart(4, '0')}`
}
export function timeToStr(time) {
    if (!time && time !== '')
        return '';

    time = new Date('0001-01-01T'+time);

    const hours = time.getHours();
    const minutes = time.getMinutes();

    return `${("0" + hours).slice(-2)}:${("0" + minutes).slice(-2)}`;
}

export function cropText(text, maxLength) {
    return (text?.slice(0, maxLength) || '') + (text?.length > maxLength ? '...' : '');
}

export function cleanupMarkdownPreview(text) {
    if (!text)
        return "";

    return text
      .replaceAll(/[-#_~*>`]/g, '') // remove symbols
      .replaceAll(/!?\[.+\]\(.+\)/g, '') // remove links and images
}

let scrollTopPrev = Infinity;
let stopScroll = undefined;
export function scrollSmoothly(element, scrollVal, start=true, smoothness=8) {
    if (start)
        stopScroll = false;
    const scrollTop = element.scrollTop;
    const newScrollTop = scrollTop + (scrollVal - scrollTop) / smoothness;
    if ((Math.abs(scrollTopPrev - scrollVal) <= Math.abs(scrollTop - scrollVal)) || (stopScroll === true)) {
        // User scroll in different side while auto scrolling => stop scrolling
        scrollTopPrev = Infinity;
        stopScroll = false;
        return;
    } else if (Math.abs(newScrollTop - scrollVal) <= Math.abs(newScrollTop - scrollTop)) {
        // End of auto scrolling
        element.scrollTop = scrollVal;
        scrollTopPrev = Infinity;
        stopScroll = false;
        return;
    } else {
        // Auto scrolling in process
        window.requestAnimationFrame(() => scrollSmoothly(element, scrollVal, false, smoothness));
        element.scrollTop = newScrollTop;
    }
    scrollTopPrev = scrollTop;
}

export function scrollSmoothlyStop() {
    stopScroll = true;
}
