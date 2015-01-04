TheHelpingHand.Game = {

    /**
     * Creates a new game with a random scene
     * @param CLIENT_ID string the id of the player
     * @return mixed int|boolean of the game or false or false the id of the name game
     */
    create: function(CLIENT_ID) {

        var randomScene = Math.floor(Math.random() * TheHelpingHand.Server.availableScenes.length);
        if (TheHelpingHand.Server.availableScenes[randomScene] == null) {
            return false;
        }

        var Scene = new TheHelpingHand.Server.availableScenes[randomScene].object();
        var game_id = TheHelpingHand.Server._gamesCount;
        TheHelpingHand.Server._gamesCount++;
        TheHelpingHand.Server.games[game_id] = {
            id: game_id,
            Scene: Scene,
            players: []
        };
        return game_id;

    },

    join: function(CLIENT_ID, game_id) {

        if (game_id == null) {
            game_id = '';
        }

        if (TheHelpingHand.games[game_id] == null || TheHelpingHand.Server.games[game_id].players.length > TheHelpingHand.games[game_id].Server.scene.maxPlayers) {
            // Create a game
            game_id = this.create(CLIENT_ID);
            if (game_id === false) {
                var dataJson = {
                    topic: 'error',
                    data: {
                        message: 'Game couldn\'t be created.'
                    }
                };
                TheHelpingHand.Server.sendMessage(CLIENT_ID, dataJson);
                return false;
            }
        }
        var currentPlayer = {
            name: TheHelpingHand.Server.clients[CLIENT_ID].name,
            score: 0
        };
        TheHelpingHand.games[game_id].players[CLIENT_ID] = currentPlayer;
    }

};