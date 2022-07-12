var google = {
    accounts: {
        id: {
            PromptMomentNotification: function(a){},
            cancel: function(){},
            disableAutoSelect: function(){},
            initialize: function(a){},
            intermediate: {
                notifyParentClose: function(){},
                notifyParentDone: function(){},
                notifyParentResize: function(a){},
                notifyParentTapOutsideMode: function(a){},
                verifyParentOrigin: function(a, b, c){},
            },
            prompt: function(a, b, c){},
            renderButton: function(a, b, c){},
            revoke: function(a, b){},
            setLogLevel: function(a){},
            storeCredential: function(a, b){},
        },
        oauth2: {
            CodeClient: function(a){},
            TokenClient: function(a){},
            hasGrantedAllScopes: function(a){},
            hasGrantedAnyScope: function(a){},
            initCodeClient: function(a){},
            initTokenClient: function(a){return {requestAccessToken:function(){}}},
            revoke: function(a, b){},
        }
    }
}