console.clear();
// setInterval(function () {
//     debugger
// }, 100);

// theme
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches)
    console.log('light mode');
else
    console.log('dark mode');

const locate = navigator.language;
const votePath = window.location.pathname;
const voteQuery = window.location.search;

const voteSection = require('voteSection.js');
const chatSection = require('chatSection.js');
voteSection();
// chatSection();

window.locate = locate;
window.getText = getText;
window.div = div;
window.input = input;
window.p = p;
window.h1 = h1;
window.img = img;
window.svg = svg;

/**
 * @param url file url
 * @return any|null
 * Object after eval
 * */
function require(url) {
    const request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.send();
    if (request.status === 200)
        return eval(request.responseText);
    else
        return null;
}

/**
 * @param url file url
 * @return string
 * */
function getText(url) {
    const request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.send();
    if (request.status === 200)
        return request.responseText;
    else
        return '';
}

function addOption(element, options) {
    for (let i = 0; i < options.length; i++)
        if (options[i] instanceof Element)
            element.appendChild(options[i]);
        else
            element[options[i][0]] = options[i][1];
}

/**
 * @param classN Class Name
 * @param options Option for element
 * @return HTMLElement
 * */
function div(classN = undefined, ...options) {
    const element = document.createElement('div');
    if (classN) element.className = classN;
    if (options) addOption(element, options);
    return element;
}

/**
 * @param classN Class Name
 * @param placeholder
 * @param options Option for element
 * @return HTMLElement
 * */
function input(classN = undefined, placeholder = undefined, ...options) {
    const element = document.createElement('input');
    if (classN) element.className = classN;
    if (placeholder) element.placeholder = placeholder;
    if (options) addOption(element, options);
    return element;
}

/**
 * @param text Class Name
 * @param classN Class Name
 * @param options Option for element
 * @return HTMLElement
 * */
function p(text = undefined, classN = undefined, ...options) {
    const element = document.createElement('p');
    if (classN) element.className = classN;
    if (text) element.textContent = text;
    if (options) addOption(element, options);
    return element;
}

/**
 * @param text Class Name
 * @param classN Class Name
 * @param options Option for element
 * @return HTMLElement
 * */
function h1(text = undefined, classN = undefined, ...options) {
    const element = document.createElement('h1');
    if (classN) element.className = classN;
    if (text) element.textContent = text;
    if (options) addOption(element, options);
    return element;
}

/**
 * @param url
 * @param classN Class Name
 * @param options Option for element
 * @return HTMLElement
 * */
function img(url = undefined, classN = undefined, ...options) {
    const element = document.createElement('img');
    if (classN) element.className = classN;
    if (url) element.src = url;
    if (options) addOption(element, options);
    return element;
}

/**
 * @param url
 * @param classN Class Name
 * @param options Option for element
 * @return HTMLElement
 * */
function svg(url = undefined, classN = undefined, ...options) {
    const parser = new DOMParser();
    const element = parser.parseFromString(getText(url), 'image/svg+xml').documentElement;
    if (classN) element.classList.add(classN)
    if (options) addOption(element, options);
    return element;
}

