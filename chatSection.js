(function (data, updater) {
    let userCredential;
    let historyIndex = 0;
    if (data.userData) userCredential = data.userData;

    // Text Input
    const userImageCache = {};
    const maxLength = 100;
    const chatMessageHistory = div('chatMessageHistory');
    const messageInput = input(null, 'Message', ['maxlength', maxLength]);
    const messageSendButton = div('sendButton', svg('src/sendButton.svg'));
    const chatBox =
        div('chatBox',
            div('chatTextInput',
                messageInput,
                div('underline', div()),
                messageSendButton
            ),
            chatMessageHistory
        );

    if (data.initData.msg) {
        for (const msg of data.initData.msg)
            addMessage(getUserImage(msg[0]), data.initData.usr[msg[0]], new Date(msg[1]), msg[2]);
        historyIndex = data.initData.msg.length;
    }
    updater.setQuery('?h=' + historyIndex);
    document.body.appendChild(chatBox);
    updater.addListener(updateMessage);
    messageInput.addEventListener('keydown', sendMessage);
    messageSendButton.addEventListener('click', sendMessage);


    // functions
    function sendMessage(e) {
        if (messageInput.value.length === 0 || e.key && e.key !== 'Enter') return;
        if (e.shiftKey) {
            return;
        }
        if (!userCredential) {
            if (data.userData) userCredential = data.userData;
            else {
                requireUserCredential();
                return;
            }
        }
        if (messageInput.value.length > maxLength)
            messageInput.value = messageInput.value.substring(0, maxLength);
        postMessage(messageInput.value);
        // addMessage(getUserImage(userCredential.sub), userCredential.name, new Date(), messageInput.value);
        messageInput.value = '';
    }

    function addMessage(profilePicture, profileName, timestamp, message) {
        chatMessageHistory.insertBefore(
            div('messageHistory',
                div('profilePicture', profilePicture.cloneNode(true)),
                div('nameAndMessage',
                    div('header',
                        p(profileName, 'profileName'),
                        p(timestamp.toLocaleString(), 'timestamp'),
                    ),
                    p(message, 'message')
                )
            ),
            chatMessageHistory.firstChild
        );
    }

    function getUserImage(userID) {
        let user = userImageCache[userID];
        if (!user) {
            const request = new XMLHttpRequest();
            request.open('GET', `https://content-people.googleapis.com/v1/people/${userID}?personFields=photos&key=${apiKey}`, false);
            request.send();
            user = userImageCache[userID] = img(JSON.parse(request.responseText).photos[0].url);
        }
        return user;
    }

    function updateMessage(messages) {
        if(messages.i && messages.i < historyIndex) {
            historyIndex = messages.i;
            updater.setQuery('?h=' + historyIndex);
        }
        if (!messages.m || messages.i === historyIndex) return;
        for (const msg of messages.m)
            // if (msg[0] !== userCredential.sub)
            addMessage(getUserImage(msg[0]), messages.u[msg[0]], new Date(msg[1]), msg[2]);
        historyIndex = messages.i;
        updater.setQuery('?h=' + historyIndex);
    }

    let lastUploadTime = 0;
    let timeoutUploadTask = 0;
    const messageBuff = [];

    function postMessage(message) {
        // time, message
        messageBuff.push([Date.now(), message]);
        if (!timeoutUploadTask && Date.now() - lastUploadTime > updateInterval) {
            lastUploadTime = Date.now();
            postData({msg: messageBuff, uid: userCredential.sub, nam: userCredential.name});
            messageBuff.length = 0;
        } else if (!timeoutUploadTask) {
            timeoutUploadTask = setTimeout(function () {
                postData({msg: messageBuff, uid: userCredential.sub, nam: userCredential.name});
                messageBuff.length = 0;
                timeoutUploadTask = 0;
            }, updateInterval - (Date.now() - lastUploadTime));
        }
    }

    function requireUserCredential() {
        if (data.loginButton) return;
        console.log('Require User Credential');
        const loginButton = data.loginButton = div(null, ['style', 'width:300px']);
        google.accounts.id.initialize({
            client_id: clientID,
            auto_select: true,
            callback: function (loginData) {
                userCredential = data.userData = b64uToJson(loginData.credential);
                chatMessageHistory.removeChild(loginButton);
                delete data.loginButton;
            }
        });
        google.accounts.id.renderButton(loginButton, {
            type: 'standard',
            width: 300,
            theme: darkMode ? 'filled_black' : 'outline'
        });
        chatMessageHistory.insertBefore(loginButton, chatMessageHistory.firstChild);
    }
})