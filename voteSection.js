(async function () {
    const apiUrl = 'https://script.google.com/macros/s/AKfycbxtOk7_EpLTj0JRaCmuSxGHrxY-A809CBLyEIOc4FTCFpKjVVgdzfIRvuVybFaz107Iiw/exec';
    const postHeader = new Headers();
    postHeader.append("Content-Type", "text/plain; charset=utf-8");

    const voteData = await getVotes();
    const uncheckImage = svg('src/uncheck.svg');
    const checkedImage = svg('src/checked.svg');

    // Vote box
    const votedText = locate === 'zh-TW' ? ' 票' : ' voted';
    const optionsSection = div('voteOptionsSection');
    const totalVoteCount = div('totalVoteCount');
    const voteBox = div('voteBox',
        div('voteLeftBar', img(voteData.proPic, 'accountPic')),
        div('voteMainDiv',
            p(voteData.proName, 'accountName'),
            h1(voteData.title, 'voteTitle'),
            totalVoteCount,
            optionsSection
        )
    )

    // init
    const options = [];
    const cookieIndex = document.cookie.indexOf('selOptI');
    const selectOptionIndex = cookieIndex ? -1 : parseInt(document.cookie.substring(cookieIndex + 8));

    let selectCheckBox, selectOption;
    let total = voteData.ops.reduce((a, b) => a instanceof Array ? a[1] + b[1] : a + b[1]);
    let lastUpdateVotes = voteData.ops.reduce((a, b) => a instanceof Array ? a[1] + ',' + b[1] : a + ',' + b[1]);
    for (const opt of voteData.ops)
        createOption(opt[0], opt[1]);
    totalVoteCount.textContent = total + votedText;
    document.body.appendChild(voteBox);
    updateAll();
    setInterval(getUpdate, 5000);
    window.addEventListener('resize', updateAll);
    document.getElementById('loader').remove();

    // functions
    function createOption(optionTitle, count) {
        const percent = (count / total * 100) | 0;
        const optionCheckBox = div('optionCheckBox',
            (options.length === selectOptionIndex ? checkedImage : uncheckImage).cloneNode(true));
        const optionPercent = div('optionPercent',
            div('optionText', ['textContent', optionTitle]),
            div('optionPercentText', ['textContent', percent + '%'])
        );
        const option = div('voteOption', optionCheckBox, optionPercent);
        option.tabIndex = 0;
        option.count = count;
        option.percent = percent;
        option.index = options.length;
        optionPercent.style.width = percent + '%';

        options.push(option);
        optionsSection.appendChild(option);
        if (option.index === selectOptionIndex) {
            selectCheckBox = optionCheckBox;
            selectOption = option;
        }

        option.addEventListener('click', function () {
            if (selectOption) {
                selectCheckBox.replaceChild(uncheckImage.cloneNode(true), selectCheckBox.firstChild);
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

                selectCheckBox = optionCheckBox;
                selectCheckBox.replaceChild(checkedImage.cloneNode(true), selectCheckBox.firstChild);
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

    async function getIP() {
        const data = (await fetch('https://www.cloudflare.com/cdn-cgi/trace')).text();
    }

    async function getUpdate() {
        let votes = await (await fetch(apiUrl + '?t=1')).text();
        if (lastUpdateVotes === votes) return;
        lastUpdateVotes = votes;
        votes = votes.split(',').map(i => parseInt(i));
        total = votes.reduce((a, b) => a + b);

        let i = 0;
        for (const element of optionsSection.children) {
            const optionPercent = element.children[1];
            element.count = votes[i++];
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
    }

    async function postVote(body) {
        const requestOptions = {
            method: 'POST',
            headers: postHeader,
            body: JSON.stringify(body),
            redirect: 'follow',
        };
        return (await fetch(apiUrl, requestOptions)).text();
    }
})