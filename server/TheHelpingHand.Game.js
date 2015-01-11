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

        var _elements = [];
        for (var i = 0; i < Scene.elements.length; i++) {
            _elements.push(Scene.elements[i].object());
        }
        // Private functions and objects will not be sent to the clients!
        TheHelpingHand.Server.games.push({
            id: TheHelpingHand.Server.gamesCount,
            sceneIndex: randomScene,
            name: TheHelpingHand.Server.clients[CLIENT_ID].name +"'s game",
            players: [],
            _elements: _elements,
            _Scene: Scene,
            _timers: [],
            _update: function() {
                var gameIndex = TheHelpingHand.Game.getIndexGameById(this.id);
                // 1. Spawn stuff
                // Get a random element
                var randomElement = Math.floor(Math.random() * this._elements.length);
                if (this._elements[randomElement] != null) {
                    var currentElement = this._elements[randomElement];
                    var randomEvent = Math.floor(Math.random() * currentElement.availableEvents.length);
                    var event = currentElement.availableEvents[randomEvent].object();
                    var counteredBy = event.counteredBy;
                    var timeout = 12000;
                    var players = this.players.length;
                    var eventData = {
                        eventIndex: randomEvent,
                        amount: Math.ceil(Math.random() * (players *.6)),
                        timeout: timeout,
                        start: new Date().getTime(),
                        elementIndex: randomElement,
                        counteredBy: counteredBy
                    };
                    currentElement.events.push(eventData);
                    var eventIndex = currentElement.events.length-1;
                    var dataJson = {
                        topic: 'event',
                        data: eventData
                    };
                    TheHelpingHand.Game.sendMessageToAllPlayers(gameIndex, dataJson);

                    // remove the event
                    var timeoutEvent = setTimeout(function() { TheHelpingHand.Server.games[gameIndex]._elements[randomElement].events.splice(eventIndex, 1) }, timeout);
                    TheHelpingHand.Server.games[gameIndex]._timers.push(timeoutEvent);

                    var nextUpdate = setTimeout(function() { TheHelpingHand.Server.games[gameIndex]._update() }, 8000);
                    TheHelpingHand.Server.games[gameIndex]._timers.push(nextUpdate);
                }
            }
        });
        var nextUpdate = setTimeout(function() { TheHelpingHand.Server.games[TheHelpingHand.Server.games.length-1]._update() }, 3500);
        TheHelpingHand.Server.games[TheHelpingHand.Server.games.length-1]._timers.push(nextUpdate);
        console.log('Game created with id: ' + game_id);
        return game_id;

    },

    castSpell: function (CLIENT_ID, elementIndex, eventIndex, spellIndex) {

        var gameIndex = this.getIndexGameById(TheHelpingHand.Server.clients[CLIENT_ID].gameId);
        if (gameIndex > -1) {
            if (TheHelpingHand.Server.games[gameIndex]._elements[elementIndex] == null) {
                return false;
            }
            if (TheHelpingHand.Server.games[gameIndex]._elements[elementIndex].events[eventIndex] == null) {
                return false;
            }
            if (TheHelpingHand.Server.games[gameIndex]._Scene.availableSpells[spellIndex] == null) {
                var dataJson = {
                    topic: 'spell',
                    type: 'update',
                    data: {
                        elementIndex: elementIndex,
                        eventIndex: eventIndex,
                        amount: TheHelpingHand.Server.games[gameIndex]._elements[elementIndex].events[eventIndex].amount
                    }
                };
                TheHelpingHand.Server.sendMessage(CLIENT_ID, dataJson);
                return false;
            }
            var spell = TheHelpingHand.Server.games[gameIndex]._Scene.availableSpells[spellIndex].object();
            var spellType = spell.type;
            if (!this._inArray(spellType, TheHelpingHand.Server.games[gameIndex]._elements[elementIndex].events[eventIndex].counteredBy)) {
                var dataJson = {
                    topic: 'spell',
                    type: 'update',
                    data: {
                        elementIndex: elementIndex,
                        eventIndex: eventIndex,
                        amount: TheHelpingHand.Server.games[gameIndex]._elements[elementIndex].events[eventIndex].amount
                    }
                };
                TheHelpingHand.Server.sendMessage(CLIENT_ID, dataJson);
                return false;
            }
            TheHelpingHand.Server.games[gameIndex]._elements[elementIndex].events[eventIndex].amount--;
            var dataJson = {
                topic: 'spell',
                type: 'update',
                data: {
                    elementIndex: elementIndex,
                    eventIndex: eventIndex,
                    amount: TheHelpingHand.Server.games[gameIndex]._elements[elementIndex].events[eventIndex].amount
                }
            };
            TheHelpingHand.Game.sendMessageToAllPlayers(gameIndex, dataJson);

            var score = -1;
            for (var i = 0; i < TheHelpingHand.Server.games[gameIndex].players.length; i++) {
                if (TheHelpingHand.Server.games[gameIndex].players[i].CLIENT_ID == CLIENT_ID) {
                    TheHelpingHand.Server.games[gameIndex].players[i].score += 10;
                    score = TheHelpingHand.Server.games[gameIndex].players[i].score;
                }
            }
            if (score > 0) {
                var dataJson = {
                    topic: 'score',
                    type: 'update',
                    data: {
                        CLIENT_ID: CLIENT_ID,
                        score: score
                    }
                };
                TheHelpingHand.Game.sendMessageToAllPlayers(gameIndex, dataJson);
            }

        }
    },


    _inArray: function(needle, haystack) {
        var length = haystack.length;
        for(var i = 0; i < length; i++) {
            if(haystack[i] == needle) return true;
        }
        return false;
    },

    /**
     * Sends a socket message to all clients
     * @param gameIndex
     * @param jsonData
     */
    sendMessageToAllPlayers: function(gameIndex, dataJson) {

        for (var i = 0; i < TheHelpingHand.Server.games[gameIndex].players.length; i++) {
            TheHelpingHand.Server.sendMessage(TheHelpingHand.Server.games[gameIndex].players[i].CLIENT_ID, dataJson);
        }

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


        var gameInfo = TheHelpingHand.Server.games[gameIndex];
        var dataJson = {
            topic: 'game',
            type: 'start',
            data: gameInfo
        };
        TheHelpingHand.Server.sendMessage(CLIENT_ID, dataJson);

        var dataJson = {
            topic: 'game',
            type: 'playerJoined',
            data: {
                CLIENT_ID: CLIENT_ID,
                name: currentPlayer.name
            }
        };
        this.sendMessageToAllPlayers(gameIndex, dataJson);
        for (var i = 0; i < gameInfo.players.length; i++) {
            if (gameInfo.players[i].CLIENT_ID == null || gameInfo.players[i].CLIENT_ID == CLIENT_ID) {
                continue;
            }
            var dataJson = {
                topic: 'game',
                type: 'playerJoined',
                data: {
                    CLIENT_ID: gameInfo.players[i].CLIENT_ID,
                    name: gameInfo.players[i].name
                }
            };
            TheHelpingHand.Server.sendMessage(CLIENT_ID, dataJson);
        }

        // Get the current events and push it to the player
        for (var i = 0; i < gameInfo._elements.length; i++) {
            for (var j = 0; j < gameInfo._elements[i].events.length; j++) {
                var eventData = gameInfo._elements[i].events[j];
                eventData.timeout = eventData.timeout - (new Date().getTime() - eventData.start);
                var dataJson = {
                    topic: 'event',
                    data: eventData
                };
                TheHelpingHand.Server.sendMessage(CLIENT_ID, dataJson);
            }
        }
        return true;
    }

};