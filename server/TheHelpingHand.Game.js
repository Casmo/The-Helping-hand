TheHelpingHand.Game = {

    /**
     * Get the index of a game by it's unique id.
     * @param game_id
     * @returns {number}
     */
    getIndexGameById: function(game_id) {

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

        var randomScene = Math.floor(Math.random() * TheHelpingHand.availableScenes.length);
        if (TheHelpingHand.availableScenes[randomScene] == null) {
            return -1;
        }

        var Scene = TheHelpingHand.availableScenes[randomScene].object();
        TheHelpingHand.Server.gamesCount++;
        var game_id = TheHelpingHand.Server.gamesCount;
        console.log(TheHelpingHand.Server.games);
        // Private functions and objects will not be sent to the clients!
        TheHelpingHand.Server.games.push({
            id: TheHelpingHand.Server.gamesCount,
            sceneIndex: randomScene,
            name: TheHelpingHand.Server.clients[CLIENT_ID].name +"'s game",
            players: [],
            elements: [],
            _Scene: Scene,
            _timers: [],
            _update: function() {
                var gameIndex = TheHelpingHand.Game.getIndexGameById(this.id);
                TheHelpingHand.Server.games[gameIndex]._timers = [];
                // 1. Spawn stuff @todo do something here with the amount of players...
                var randomElement = Math.floor(Math.random() * this._Scene.availableElements.length);
                if (this._Scene.availableElements[randomElement] != null) {
                    var element = {
                        id: TheHelpingHand.Server.games[gameIndex].elements.length,
                        elementIndex: randomElement,
                        amount: Math.round(TheHelpingHand.Server.games[gameIndex].players *.6),
                        timeout: 5000,
                        start: Date.now(),
                        completed: false
                    };
                    TheHelpingHand.Server.games[gameIndex].elements.push(element);
                    var dataJson = {
                        topic: 'element',
                        type: 'add',
                        data: element
                    };

                    for (var i = 0; i < TheHelpingHand.Server.games[gameIndex].players.length; i++) {
                        TheHelpingHand.Server.sendMessage(TheHelpingHand.Server.games[gameIndex].players[i].CLIENT_ID, dataJson);
                    }
                }
                // 2. Refresh tick
                var nextUpdate = setTimeout(function() { TheHelpingHand.Server.games[gameIndex]._update(); } , ((Math.random() * 1) + 1) * 1000);
                TheHelpingHand.Server.games[gameIndex]._timers.push(nextUpdate);
            }
        });
        setTimeout(TheHelpingHand.Server.games[TheHelpingHand.Server.games.length-1]._update(), 1000);
        console.log('Game created with id: ' + game_id);
        return game_id;

    },

    /**
     * Add a client to the game and send the initial json data back to the client
     * @param CLIENT_ID
     * @param game_id
     * @returns {boolean}
     */
    join: function(CLIENT_ID, game_id) {

        if (game_id == null) {
            game_id = '';
        }
        var oldGameId = TheHelpingHand.Server.clients[CLIENT_ID].gameId;
        if (game_id != '' && game_id == oldGameId) {
            console.log('Player already in this game.');
            return false;
        }
        TheHelpingHand.Server.disconnectPlayerFromCurrentGame(CLIENT_ID);

        var gameIndex = this.getIndexGameById(game_id);
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
            gameIndex = this.getIndexGameById(game_id);
        }
        var currentPlayer = {
            CLIENT_ID: CLIENT_ID,
            name: TheHelpingHand.Server.clients[CLIENT_ID].name,
            score: 0
        };
        console.log('Player: ' + CLIENT_ID + ' joined game: ' + game_id + ' with index: ' + gameIndex);
        TheHelpingHand.Server.games[gameIndex].players.push(currentPlayer);
        TheHelpingHand.Server.clients[CLIENT_ID].gameId = game_id;

        var dataJson = {
            topic: 'game',
            type: 'playerJoined',
            data: {
                CLIENT_ID: CLIENT_ID
            }
        };
        for (var i = 0; i < TheHelpingHand.Server.games[gameIndex].players.length; i++) {
            TheHelpingHand.Server.sendMessage(TheHelpingHand.Server.games[gameIndex].players[i].CLIENT_ID, dataJson);
        }

        var gameInfo = TheHelpingHand.Server.games[gameIndex];
        var dataJson = {
            topic: 'game',
            type: 'start',
            data: gameInfo
        };
        TheHelpingHand.Server.sendMessage(CLIENT_ID, dataJson);
        return true;
    }

};