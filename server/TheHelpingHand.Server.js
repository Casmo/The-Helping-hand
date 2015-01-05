var WebSocketServer = require("websocket").server;
var http = require("http");

TheHelpingHand.Server = {

    clients: [
        //{
        //    connection: connection,
        //    name: '',
        //    connected: true,
        //    gameId: 0,
        //}
    ],

    /**
     * List of avaialble scenes
     */
    availableScenes: [
        {
            object: function() { return TheHelpingHand.SceneRestaurant(); }
        }
    ],

    games: [],
//[
        //{
        //    id: this.gamesCount,
        //    name: 'dummy game',
        //    Scene: {},
        //    players: [],
        //}
  //  ],

    /**
     * For creating a unique game number. Starts with 1 because zero will be a new game.
     */
    gamesCount: 0,

    start: function() {

        var server = http.createServer(function (request, response) {});
        server.listen(TheHelpingHand.settings.port, function () {});
        console.log('Server running on port: ' + TheHelpingHand.settings.port);

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
        var gameIndex = TheHelpingHand.Game.getGameById(this.clients[CLIENT_ID].gameId);
        if (gameIndex == -1) {
            return;
        }
        this.games[gameIndex].players[CLIENT_ID] = null;
        // Loop through players and push them a message
        var dataJson = {
            topic: 'game',
            data: {
                type: 'playerLeft',
                CLIENT_ID: CLIENT_ID
            }
        };
        if (this.games[gameIndex].players.length == 0) {
            // Game over. Delete it.
            this.deleteGame(gameIndex);
        }
        else {
            for (var PLAYER_CLIENT_ID in this.games[gameIndex].players) {
                this.sendMessage(PLAYER_CLIENT_ID, dataJson);
            }
        }
        this.clients[CLIENT_ID].gameId = 0;

    },

    /**
     * Deletes a game.
     * @param game_id
     */
    deleteGame: function(gameIndex) {

        if (this.games[gameIndex] != null) {
            console.log('Delete game: ' + gameIndex);
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
        message = JSON.parse(message);
        console.log('Message received from client: ' + CLIENT_ID);
        console.log(message);
        if (message.topic == null) {
            return false;
        }
        switch (message.topic) {
            case 'game':
                if (message.data.type == 'list') {
                    var dataJson = {
                        topic: 'game',
                        data: {
                            type: 'list',
                            games: this.games
                        }
                    };
                    this.sendMessage(CLIENT_ID, dataJson);
                }
                // Player joins a game
                else if (message.data.type == 'join') {
                    TheHelpingHand.Game.join(CLIENT_ID, message.data.id);
                }
                // Player leaves a game
                else if (message.data.type == 'leave') {
                    this.disconnectPlayerFromCurrentGame(CLIENT_ID);
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

        return this.clients[CLIENT_ID].connection.send(JSON.stringify(dataJson));

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