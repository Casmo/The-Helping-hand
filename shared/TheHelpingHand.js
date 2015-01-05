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
            object: function() { return new TheHelpingHand.SceneRestaurant(); }
        }
    ]

};