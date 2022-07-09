(async function () {
    // Text Input
    let chatMessageHistory;
    const chatBox =
        div('chatBox',
            div('chatTextInput',
                input(null, 'Message'),
                div('underline', div()),
                svg('src/sendButton.svg', 'sendButton')
            ),
            (chatMessageHistory = div('chatMessageHistory'))
        );
    document.body.appendChild(chatBox);

    addMessage('src/DefaultProfilePicture.jpg', 'WavJaby', '0w0');
    addMessage('src/DefaultProfilePicture.jpg', 'WavJaby', 'hello');

    function addMessage(profilePictureUrl, profileName, message) {
        chatMessageHistory.appendChild(
            div(null,
                div('profilePicture', img(profilePictureUrl)),
                div('nameAndMessage',
                    p(profileName, 'profileName'),
                    p(message, 'message')
                )
            )
        )
    }
})