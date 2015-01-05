TheHelpingHand.Game = {

    /**
     * Get the index of a game by it's unique id.
     * @param game_id
     * @returns {number}
     */
    getGameById: function(game_id) {

        for (var i = 0; i < TheHelpingHand.Server.games.length; i++) {
            if (TheHelpingHand.Server.games[i].id == game_id) {
                return i;
            }
        }
        return -1;

    },

    /**
     * Creates a new game with a random scene
     * @param CLIENT_ID string the id of the player
     * @return int -1 on false or index of the game or false or false the id of the name game
     */
    create: function(CLIENT_ID) {

        var randomScene = Math.floor(Math.random() * TheHelpingHand.Server.availableScenes.length);
        if (TheHelpingHand.Server.availableScenes[randomScene] == null) {
            return -1;
        }

        var Scene = new TheHelpingHand.Server.availableScenes[randomScene].object();
        TheHelpingHand.Server.gamesCount++;
        var game_id = TheHelpingHand.Server.gamesCount;
        console.log(TheHelpingHand.Server.games);
        TheHelpingHand.Server.games.push({
            id: TheHelpingHand.Server.gamesCount,
            Scene: Scene,
            name: TheHelpingHand.Server.clients[CLIENT_ID].name +"'s game",
            players: []
        });
        console.log('Game created with id: ' + game_id);
        return game_id;

    },

    join: function(CLIENT_ID, game_id) {

        if (game_id == null) {
            game_id = '';
        }

        var gameIndex = this.getGameById(game_id);
        if (gameIndex == -1) {
            // Create a game
            game_id = this.create(CLIENT_ID);
            if (game_id == -1) {
                var dataJson = {
                    topic: 'error',
                    data: {
                        message: 'Game couldn\'t be created.'
                    }
                };
                TheHelpingHand.Server.sendMessage(CLIENT_ID, dataJson);
                return false;
            }
            gameIndex = this.getGameById(game_id);
        }
        var currentPlayer = {
            name: TheHelpingHand.Server.clients[CLIENT_ID].name,
            score: 0
        };
        console.log('Player: ' + CLIENT_ID + ' joined game: ' + game_id + ' with index: ' + gameIndex);
        TheHelpingHand.Server.games[gameIndex].players[CLIENT_ID] = currentPlayer;
        TheHelpingHand.Server.disconnectPlayerFromCurrentGame(CLIENT_ID);
        TheHelpingHand.Server.clients[CLIENT_ID].gameId = game_id;

        var dataJson = {
            topic: 'game',
            data: {
                type: 'playerJoined',
                CLIENT_ID: CLIENT_ID
            }
        };
        for (var PLAYER_CLIENT_ID in TheHelpingHand.Server.games[gameIndex].players) {
            TheHelpingHand.Server.sendMessage(PLAYER_CLIENT_ID, dataJson);
        }
    }

};