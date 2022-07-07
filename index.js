// theme
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches)
    console.log('light mode');
else
    console.log('dark mode');

const locate = navigator.language || navigator.userLanguage;
const votePath = window.location.pathname;

(async function () {
    const apiUrl = 'https://script.google.com/macros/s/AKfycbzmgU05idEitNRoty5enjPQZ2Ju8zmSXmczt0zj7091xOEPUnj3K4WNgaPRC2iAntVGoQ/exec';
    const uncheckImage = await getSvg('http://localhost:63342/uncheck.svg');
    const checkedImage = await getSvg('http://localhost:63342/checked.svg')
    const voteData = await getVotes();

    // Vote box
    const voteBox = document.createElement('div');
    voteBox.className = 'voteBox';
    const leftBar = document.createElement('div');
    leftBar.className = 'voteLeftBar';
    voteBox.appendChild(leftBar);
    const main = document.createElement('div');
    main.className = 'voteMainDiv';
    voteBox.appendChild(main);


    // account
    const account = document.createElement('p');
    account.className = 'accountName';
    account.textContent = voteData.proName;
    main.appendChild(account);
    const accountPic = document.createElement('img');
    accountPic.className = 'accountPic';
    accountPic.src = voteData.proPic;
    leftBar.appendChild(accountPic);


    // question
    const title = document.createElement('h1');
    title.className = 'voteTitle';
    title.textContent = voteData.title;
    main.appendChild(title);

    const votedText = locate === 'zh-TW' ? ' 票' : ' voted';
    const totalVoteCount = document.createElement('div');
    totalVoteCount.className = 'totalVoteCount';
    main.appendChild(totalVoteCount);


    // options
    let selectOption, selectCheckBox = null;
    const optionsSection = document.createElement('div');
    optionsSection.className = 'voteOptionsSection';
    main.appendChild(optionsSection);


    // init
    const options = [];
    const cookieIndex = document.cookie.indexOf('selOptI');
    const selectOptionIndex = cookieIndex ? -1 : parseInt(document.cookie.substring(cookieIndex + 8));
    let total = voteData.ops.reduce((a, b) => a instanceof Array ? a[1] + b[1] : a + b[1]);
    for (const opt of voteData.ops)
        createOption(opt[0], opt[1]);
    totalVoteCount.textContent = total + votedText;
    document.body.appendChild(voteBox);
    updateAll();
    document.getElementById('loader').remove();

    function createOption(optionTitle, count) {
        const option = document.createElement('div');
        option.className = 'voteOption';
        const optionCheckBox = document.createElement('div');
        optionCheckBox.className = 'optionCheckBox';
        optionCheckBox.innerHTML = options.length === selectOptionIndex ? checkedImage : uncheckImage;
        option.appendChild(optionCheckBox);
        const optionPercent = document.createElement('div');
        optionPercent.className = 'optionPercent';
        const optionText = document.createElement('div');
        optionText.className = 'optionText';
        optionPercent.appendChild(optionText);
        const optionPercentText = document.createElement('div');
        optionPercentText.className = 'optionPercentText';
        optionPercent.appendChild(optionPercentText);
        option.appendChild(optionPercent);
        optionsSection.appendChild(option);

        if (options.length === selectOptionIndex) {
            selectCheckBox = optionCheckBox;
            selectOption = option;
        }

        option.count = count;
        option.percent = (count / total * 100) | 0;
        option.index = options.length;
        options.push(option);

        optionText.textContent = optionTitle;
        optionPercent.style.width = optionPercentText.textContent = option.percent + '%';

        option.addEventListener('click', function () {
            if (selectOption) {
                selectCheckBox.innerHTML = uncheckImage;
                selectOption.count--;
                total--;
            }
            if (selectOption === option) {
                postVote({deSel: selectOption.index});
                selectCheckBox = selectOption = null;
                document.cookie = 'selOptI=-1';
            } else {
                if (selectOption)
                    postVote({sel: option.index, deSel: selectOption.index});
                else
                    postVote({sel: option.index});

                optionCheckBox.innerHTML = checkedImage;
                selectCheckBox = optionCheckBox;
                selectOption = option;
                selectOption.count++;
                total++;
                document.cookie = `selOptI=${selectOption.index}`;
            }
            for (const element of optionsSection.children) {
                const optionPercent = element.children[1];
                const newPercent = (element.count / total * 100) | 0;
                if (newPercent !== element.percent) {
                    element.percent = newPercent;
                    const optionText = optionPercent.children[0];
                    const optionPercentText = optionPercent.children[1];
                    optionPercent.style.width = optionPercentText.textContent = newPercent + '%';
                    if (optionPercent.offsetWidth > optionText.offsetWidth + 15 + optionPercentText.offsetWidth + 5)
                        optionPercentText.style.position = 'absolute';
                    else
                        optionPercentText.style.position = null;
                }
            }
            totalVoteCount.textContent = total + votedText;
        });
    }

    function updateAll() {
        for (const element of optionsSection.children) {
            const optionPercent = element.children[1];
            const optionText = optionPercent.children[0];
            const optionPercentText = optionPercent.children[1];
            if (optionPercent.offsetWidth > optionText.offsetWidth + 15 + optionPercentText.offsetWidth + 5)
                optionPercentText.style.position = 'absolute';
            else
                optionPercentText.style.position = null;
        }
    }

    function deleteCookie(name) {
        document.cookie = name + '=;expires=01 Jan 1970 00:00:00 UTC';
    }

    async function getVotes() {
        return (await fetch(apiUrl)).json();
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/plain; charset=utf-8");

    async function postVote(body) {
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(body),
            redirect: 'follow',
        };
        return (await fetch(apiUrl, requestOptions)).text();
    }

    window.addEventListener('resize', updateAll);
})();

// setInterval(function () {
//     debugger
// }, 10);

async function getSvg(url) {
    return (await fetch(url)).text();
}


