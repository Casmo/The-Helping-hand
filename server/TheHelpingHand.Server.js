var WebSocketServer = require("websocket").server;
var http = require("http");
var _ = require('underscore');

TheHelpingHand.Server = {

    clients: [
        //{
        //    connection: connection,
        //    name: '',
        //    connected: true,
        //    gameId: 0,
        //}
    ],

    games: [],
//[
        //{
        //    id: this.gamesCount,
        //    name: 'dummy game',
        //    sceneIndex: 0, // See TheHelpingHand::availableScenes
        //    players: [],
        //    _timers: [], // list of timers such as interval and timeouts
        //    update: function() { } // The update function for interacting with the game
        //}
  //  ],

    /**
     * For creating a unique game number. Starts with 1 because zero will be a new game.
     */
    gamesCount: 0,

    start: function() {

        var server = http.createServer(function (request, response) {});
        server.listen(TheHelpingHand.settings.port, function () {});
        console.log('Server running on '+ TheHelpingHand.settings.host +':' + TheHelpingHand.settings.port);

        var wsServer = new WebSocketServer({
            httpServer: server
        });

        wsServer.on("request", function (request) {
            var CLIENT_ID = Math.floor((1 + Math.random()) * 0x10000) + '' + Math.floor((1 + Math.random()) * 0x10000) + '' + Math.floor((1 + Math.random()) * 0x10000) + '' + Math.floor((1 + Math.random()) * 0x10000);
            var cookies = TheHelpingHand.Server._parseCookie(request);
            if (cookies.CLIENT_ID != null && TheHelpingHand.Server.clients[cookies.CLIENT_ID] != null) {
                CLIENT_ID = cookies.CLIENT_ID;
            }
            TheHelpingHand.Server.addClient(request, CLIENT_ID);
        });

    },

    /**
     * Adds a player to this.clients[].
     * @param request object the Websocket request
     */
    addClient: function (request, CLIENT_ID) {

        var connection = request.accept(null, request.origin);
        var client = {
            connection: connection,
            name: 'Guest (' + (Object.keys(this.clients).length + 1) + ')',
            connected: true,
            gameId: 0
        };
        if (this.clients[CLIENT_ID] != null) {
            for (var attr in this.clients[CLIENT_ID]) {
                client[attr] = client[attr];
            }
        }
        connection.on("message", function (message) {
            TheHelpingHand.Server.receiveMessage(CLIENT_ID, message);
        });
        connection.on("close", function (connection) {
            TheHelpingHand.Server.removeClient(CLIENT_ID);
        });
        this.clients[CLIENT_ID] = client;
        console.log('Client ('+ Object.keys(this.clients).length +') added: ' + CLIENT_ID);

        var dataJson = {
            topic: 'identity',
            data: {
                CLIENT_ID: CLIENT_ID,
                name: client.name
            }
        };
        this.sendMessage(CLIENT_ID, dataJson);

    },

    /**
     * Removes the client from the game and send messages to opponent
     * @param CLIENT_ID
     */
    removeClient: function (CLIENT_ID) {
        console.log('Client disconnected: ' + CLIENT_ID);
        this.disconnectPlayerFromCurrentGame(CLIENT_ID);
        this.clients[CLIENT_ID].connected = false;
    },

    /**
     * Disconnect a player from the game he/she is playing at the moment.
     * @param CLIENT_ID
     */
    disconnectPlayerFromCurrentGame: function(CLIENT_ID) {

        // @todo might wanna do this with a timeout so the player can reconnect on time...?
        var gameIndex = TheHelpingHand.Game.getIndexGameById(this.clients[CLIENT_ID].gameId);
        if (gameIndex == -1) {
            return;
        }
        for (var i = 0; i < this.games[gameIndex].players.length; i++) {
            if (this.games[gameIndex].players[i].CLIENT_ID == CLIENT_ID) {
                this.games[gameIndex].players.splice(i);
            }
        }
        // Loop through players and push them a message
        var dataJson = {
            topic: 'game',
            type: 'playerLeft',
            data: {
                CLIENT_ID: CLIENT_ID
            }
        };
        console.log(this.games[gameIndex]);
        if (this.games[gameIndex].players.length <= 0) {
            // Game over. Delete it.
            this.deleteGame(this.games[gameIndex].id);
        }
        else {
            for (var i = 0; i < this.games[gameIndex].players.length; i++) {
                this.sendMessage(this.games[gameIndex].players[i].CLIENT_ID, dataJson);
            }
        }
        this.clients[CLIENT_ID].gameId = 0;

    },

    /**
     * Deletes a game.
     * @param game_id
     */
    deleteGame: function(game_id) {

        var gameIndex = TheHelpingHand.Game.getIndexGameById(game_id);
        if (this.games[gameIndex] != null) {
            console.log('Delete game: ' + gameIndex);
            if (this.games[gameIndex]._timers != null) {
                for (var i = 0; i < this.games[gameIndex]._timers.length; i++) {
                    clearTimeout(this.games[gameIndex]._timers[i]);
                }
            }
            this.games.splice(gameIndex, 1);
        }
    },

    /**
     * Receives and process a message from the server.
     * @param CLIENT_ID string the id of the client that sent the message
     * @param message object message contains a JSON stringify object with at least a topic param
     */
    receiveMessage: function (CLIENT_ID, message) {
        message = message.utf8Data;
        console.log('Message received from client: ' + CLIENT_ID + ', message: ' + message);
        message = JSON.parse(message);
        if (message.topic == null) {
            return false;
        }
        switch (message.topic) {
            case 'game':
                if (message.type == 'list') {
                    var dataJson = {
                        topic: 'game',
                        type: 'list',
                        data: {
                            games: this.games
                        }
                    };
                    console.log(dataJson);
                    this.sendMessage(CLIENT_ID, dataJson);
                }
                // Player joins a game
                else if (message.type == 'join') {
                    TheHelpingHand.Game.join(CLIENT_ID, message.data.id);
                }
                // Player leaves a game
                else if (message.type == 'quit') {
                    this.disconnectPlayerFromCurrentGame(CLIENT_ID);
                }
            break;
            case 'spell':
              if (message.type == 'cast') {
                  TheHelpingHand.Game.castSpell(CLIENT_ID, message.data.elementIndex, message.data.eventIndex, message.data.spellIndex);
              }
            break;
            // Let the player rename his name...
            case 'identify':
              if (message.data.name != null && message.data.name != '') {
                  this.clients[CLIENT_ID].name = message.data.name;
                  // @todo might wanna update the game where he is at...
              }
            break;
            default:
            console.log('Warning: Topic not implemented: ' + topic);
        }
    },

    /**
     * Sends a message to a client
     * @param CLIENT_ID
     * @param dataJson object with the following objects
     * topic: the topic
     * data: { } multiple variables can be set here
     * @returns {boolean}
     */
    sendMessage: function(CLIENT_ID, dataJson) {

        var dataToSend = this.clearPrivateData(dataJson);
        return this.clients[CLIENT_ID].connection.send(JSON.stringify(dataToSend));

    },

    /**
     * Clear private variables from the json data object.
     * @todo fix that arrays will be arrays and not objects.
     * @param dataJson
     * @returns {{}}
     */
    clearPrivateData: function(dataJson) {
        var dataToSend = {};
        for (var key in dataJson) {
            if (key.indexOf('_') != 0) {
                if (typeof dataJson[key] == 'object' || typeof dataJson[key] == 'array') {
                    dataToSend[key] = this.clearPrivateData(dataJson[key]);
                }
                else {
                    dataToSend[key] = dataJson[key];
                }
            }
        }
        return dataToSend;
    },

    /**
     * Parse all cookies from a request
     * @param request
     */
    _parseCookie: function (request) {

        var list = [];
        for (var i = 0; i < request.cookies.length; i++) {
            var cookie = request.cookies[i];
            list[cookie.name] = cookie.value;
        }
        return list;
    }

};