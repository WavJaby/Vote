(function () {
    const listeners = [];
    let interval;
    let requestIndex = 0;
    let query = '';
    let lastResponse;
    const requests = new Array(apiUrls.length + 3);
    console.log('requests queue length: ' + requests.length);
    console.log('update interval: ' + updateInterval);
    for (let i = 0; i < requests.length; i++) {
        const request = requests[i] = new XMLHttpRequest();
        request.onload = onload;
    }

    function onload() {
        if (lastResponse === this.responseText) return;
        lastResponse = this.responseText;
        const response = JSON.parse(this.responseText);
        for (const i of listeners) i(response);
    }

    function getUrlForFetch() {
        const request = requests[requestIndex];
        if (request.readyState !== 0 && request.readyState !== 4) {
            console.warn('skip')
            return;
        }
        // // request time
        // request.startTime = Date.now();
        request.open('GET', nextAPIUrl() + query, true);
        request.send();
        if (++requestIndex === requests.length)
            requestIndex = 0;
    }

    function addListener(listener) {
        listeners.push(listener);
    }

    function start() {
        interval = setInterval(getUrlForFetch, updateInterval);
    }

    function setQuery(queryString) {
        query = queryString;
    }

    return {addListener: addListener, start: start, setQuery: setQuery};
})