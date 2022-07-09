console.clear();
// setInterval(function () {
//     debugger
// }, 100);

// theme
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches)
    console.log('light mode');
else
    console.log('dark mode');

const locate = navigator.language || navigator.userLanguage;
const votePath = window.location.pathname;
const voteQuery = window.location.search;

window.getText = getText;

const voteSection = require('voteSection.js');
const chatSection = require('chatSection.js');
voteSection();
// chatSection();

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

window.div = div;
window.input = input;
window.p = p;
window.h1 = h1;
window.img = img;
window.svg = svg;
function div(className, ...options) {
    const element = document.createElement('div');
    if (className) element.className = className;
    if (options) addOption(element, options);
    return element;
}

function input(className, placeholder, ...options) {
    const element = document.createElement('input');
    if (className) element.className = className;
    if (placeholder) element.placeholder = placeholder;
    if (options) addOption(element, options);
    return element;
}

function p(text, className, ...options) {
    const element = document.createElement('p');
    if (className) element.className = className;
    if (text) element.textContent = text;
    if (options) addOption(element, options);
    return element;
}

function h1(text, className, ...options) {
    const element = document.createElement('h1');
    if (className) element.className = className;
    if (text) element.textContent = text;
    if (options) addOption(element, options);
    return element;
}

function img(src, className, ...options) {
    const element = document.createElement('img');
    if (className) element.className = className;
    if (src) element.src = src;
    if (options) addOption(element, options);
    return element;
}

function svg(url, className, ...options) {
    const parser = new DOMParser();
    const element = parser.parseFromString(getText(url), 'image/svg+xml').documentElement;
    if (className) element.classList.add(className)
    if (options) addOption(element, options);
    return element;
}

