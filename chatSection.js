(function () {
    // Text Input
    const chatMessageHistory = div('chatMessageHistory');
    const messageInput = input(null, 'Message', ['maxlength', 50]);
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
    document.body.appendChild(chatBox);

    function sendMessage(e) {
        if (messageInput.value.length === 0 || e.key && e.key !== 'Enter') return;
        addMessage('src/DefaultProfilePicture.jpg', 'WavJaby', messageInput.value);
        messageInput.value = '';
    }

    messageInput.addEventListener('keydown', sendMessage);
    messageSendButton.addEventListener('click', sendMessage);

    function addMessage(profilePictureUrl, profileName, message) {
        chatMessageHistory.insertBefore(
            div('messageHistory',
                div('profilePicture', img(profilePictureUrl)),
                div('nameAndMessage',
                    p(profileName, 'profileName'),
                    p(message, 'message')
                )
            ),
            chatMessageHistory.firstChild
        );
    }
})