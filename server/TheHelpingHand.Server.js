var WebSocketServer = require("websocket").server;
var http = require("http");

TheHelpingHand.Server = {

    clients: [],

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
            connected: true
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
        this.clients[CLIENT_ID].connected = false;
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
            default:
            console.log('Warning: Topic not implemented: ' + topic);
        }
    },

    /**
     * Sends a message to a client
     * @param CLIENT_ID
     * @param message object with the following objects
     * topic: the topic
     * data: { } multiple variables can be set here
     * @returns {boolean}
     */
    sendMessage: function(CLIENT_ID, message) {

        return this.clients[CLIENT_ID].connection.send(JSON.stringify(message));

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