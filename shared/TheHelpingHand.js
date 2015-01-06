var TheHelpingHand = TheHelpingHand || {

    settings: {

        host: '192.168.1.11',
        port: 1337

    },

    /**
     * List of avaialble scenes
     */
    availableScenes: [
        {
            object: function() { return new TheHelpingHand.SceneRestaurant(); }
        }
    ]

};