console.clear();
// setInterval(function () {
//     debugger
// }, 100);

// theme
const darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
console.log(darkMode ? 'dark mode' : 'light mode');

// settings
const locate = navigator.language;

// const
const apiUrls = [
    'https://script.google.com/macros/s/AKfycbxxXpZAQ772e4gHs2sHpRvJxD9k-57s4ZTK8M2Rtn2eYtWmlfyI8Up6y1ZXehQcMg4TvA/exec',
    'https://script.google.com/macros/s/AKfycbzpkVVMQk94um-psm1zVLPqPcPuraeg8B0GWHePIi-fTMac_vZEZP9qafKdFOLv5yKbaQ/exec',
    'https://script.google.com/macros/s/AKfycbwm2TkE5VegB3uXuaHs3mtGjhomKZBF_F4DxtIK5A-V1QxXT9aFLGeJcGP-lCnOiOYzLw/exec',
    'https://script.google.com/macros/s/AKfycbxYLj1dunoeyRtIU0gO_UGUfQiLhkWz-0LQQO-PKsqw4yaQtFV90ByNftHRhf8Lw-KT/exec',
    'https://script.google.com/macros/s/AKfycbzjJNWBgvC-QVtfwZxEEYlcoryEoabANKAgvIrOAtLPXh_kB518Rucj0mEQYosBSC2fbQ/exec'
];
const postHeader = new Headers();
postHeader.append("Content-Type", "text/plain; charset=utf-8");
const clientID = '37794333274-pp209ka9k4mcgngmcv6klehpdl5jfsqi.apps.googleusercontent.com';
const apiKey = 'AIzaSyAGwVlLaNF7VnM26HnK8r7GQvh3_BCweOE';
// const updateInterval = 1000 / apiUrls.length + 100;
const updateInterval = 500;

let apiUrlIndex = 0;

// app
(async function () {
    const data = {};
    const userData = loginGoogle(data);
    let initData = getDataJson('?i=t');
    const voteSection = require('voteSection.js');
    const chatSection = require('chatSection.js');
    const getUpdate = require('getUpdate.js')();
    data.initData = await initData;
    voteSection(data.initData, getUpdate);
    document.getElementById('loader').remove();
    chatSection(data, getUpdate);
    getUpdate.start();
    data.userData = await userData;
})();

function loginGoogle(data) {
    return new Promise((resolve, reject) => {
        google.accounts.id.initialize({
            client_id: clientID,
            auto_select: true,
            callback: function (loginData) {
                resolve(b64uToJson(loginData.credential));
                if (data.loginButton) {
                    data.loginButton.remove();
                    delete data.loginButton;
                }
            }
        });
        google.accounts.id.prompt(function (notification) {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                // continue with another identity provider.
                resolve(null);
            }
        });
    });
}

function nextAPIUrl() {
    const api = apiUrls[apiUrlIndex];
    if (apiUrls.length > 1 && ++apiUrlIndex === apiUrls.length)
        apiUrlIndex = 0;
    return api;
}

async function postData(body) {
    const requestOptions = {
        method: 'POST',
        headers: postHeader,
        body: JSON.stringify(body),
        redirect: 'follow',
    };
    return (await fetch(nextAPIUrl(), requestOptions)).text();
}

async function getDataJson(query) {
    if (query)
        return (await fetch(nextAPIUrl() + query)).json();
    else
        return (await fetch(nextAPIUrl())).json();
}

async function getDataText(query) {
    return (await fetch(nextAPIUrl() + query)).text();
}

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

