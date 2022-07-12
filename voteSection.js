(function (voteData, updater) {
    const uncheckImage = svg('src/uncheck.svg');
    const checkedImage = svg('src/checked.svg');

    // Vote box
    const votedText = locate === 'zh-TW' ? ' 票' : ' voted';
    const optionsSection = div('voteOptionsSection');
    const totalVoteCount = div('totalVoteCount');
    const voteBox = div('voteBox',
        div('voteLeftBar', img(voteData.pic, 'accountPic')),
        div('voteMainDiv',
            p(voteData.nam, 'accountName'),
            h1(voteData.tit, 'voteTitle'),
            totalVoteCount,
            optionsSection
        )
    )

    // init
    const options = [];
    const cookieIndex = document.cookie.indexOf('selOptI');
    const selectOptionIndex = cookieIndex ? -1 : parseInt(document.cookie.substring(cookieIndex + 8));

    let selectCheckBox, selectOption, lastUpdateSelectIndex = -1;
    let total = voteData.ops.reduce((a, b) => a instanceof Array ? a[1] + b[1] : a + b[1]);
    let lastUpdateVotes = voteData.ops.reduce((a, b) => a instanceof Array ? a[1] + ',' + b[1] : a + ',' + b[1]);
    for (const opt of voteData.ops)
        createOption(opt[0], opt[1]);
    totalVoteCount.textContent = total + votedText;
    document.body.appendChild(voteBox);
    updateAll();
    window.addEventListener('resize', updateAll);
    updater.addListener(updateVotes);

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
            lastUpdateSelectIndex = option.index;
        }

        option.addEventListener('click', function () {
            if (selectOption) {
                selectCheckBox.replaceChild(uncheckImage.cloneNode(true), selectCheckBox.firstChild);
                selectOption.count--;
                total--;
            }
            if (selectOption === option) {
                selectCheckBox = selectOption = null;
                document.cookie = 'selOptI=-1';
            } else {
                selectCheckBox = optionCheckBox;
                selectCheckBox.replaceChild(checkedImage.cloneNode(true), selectCheckBox.firstChild);
                selectOption = option;
                selectOption.count++;
                total++;
                document.cookie = `selOptI=${selectOption.index}`;
            }
            postVote();
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

    async function getIP() {
        const data = (await fetch('https://www.cloudflare.com/cdn-cgi/trace')).text();
    }

    function updateVotes(votes) {
        // // request time
        // console.log((Date.now() - this.startTime));
        console.log(votes)
        votes = votes.v;
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

    let lastUploadTime = 0;
    let timeoutUploadTask = 0;

    function postVote() {
        if (!timeoutUploadTask && Date.now() - lastUploadTime > updateInterval) {
            lastUploadTime = Date.now();
            postVoteData();
        } else if (!timeoutUploadTask) {
            timeoutUploadTask = setTimeout(function () {
                postVoteData();
                timeoutUploadTask = 0;
            }, updateInterval - (Date.now() - lastUploadTime));
        }
    }

    function postVoteData() {
        if (lastUpdateSelectIndex === -1) {
            if (selectOption)
                postData({sel: selectOption.index});
        } else if (!selectOption) {
            if (lastUpdateSelectIndex !== -1)
                postData({deSel: lastUpdateSelectIndex});
        } else if (selectOption.index !== lastUpdateSelectIndex)
            postData({sel: selectOption.index, deSel: lastUpdateSelectIndex});
        lastUpdateSelectIndex = selectOption ? selectOption.index : -1;
    }
})