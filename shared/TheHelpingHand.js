var TheHelpingHand = TheHelpingHand || {

    settings: {

        host: 'localhost',
        port: 1337

    },

    /**
     * List of avaialble scenes
     */
    availableScenes: [
        {
            object: function() { return new TheHelpingHand.SceneRestaurant(); },
            name: 'Restaurant'
        }
    ]

};
if (typeof window != 'undefined' && window.location != null && window.location.hostname != null) {
    TheHelpingHand.settings.host = window.location.hostname;
}