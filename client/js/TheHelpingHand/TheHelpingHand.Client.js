/**
 * Parsing and receiving data from and to the server.
 * @type {{socket: {}, connected: boolean, client: {}, _timers: {error: null}, connect: connect, disconnect: disconnect, setClient: setClient, removeClient: removeClient, parseMessage: parseMessage, displayError: displayError, hideError: hideError}}
 */
TheHelpingHand.Client = {

    socket: {},

    /**
     * @param connected boolean if the client is connected to the server
     */
    connected: false,

    /**
     * Current client information
     */
    client: {},

    /**
     * Timers for interval, timeouts, etc
     */
    _timers: {
        error: null
    },

    connect: function() {

        /**
         CONNECTING 0 The connection is not yet open.
         OPEN 1 The connection is open and ready to communicate.
         CLOSING 2 The connection is in the process of closing.
         CLOSED 3 The connection is closed or couldn't be opened.
         */
        if (this.socket != null && (this.socket.readyState == 2 || this.socket.readyState == 1)) {
            return true;
        }
        this.socket = new WebSocket("ws://"+ TheHelpingHand.settings.host +":" + TheHelpingHand.settings.port);
        this.socket.onmessage = function (event) {
            TheHelpingHand.Client.parseMessage(event.data);
        };
        this.socket.onopen = function (event) {
            TheHelpingHand.Client.connected = true;
        };
        this.socket.onclose = function(event) {
            TheHelpingHand.Client.connected = false;
        };
        this.socket.onerror = function(event) {};
        this.connected = true;

    },

    disconnect: function() {

        if (this.socket != null) {
            this.socket.close();
        }
        this.connected = true;

    },

    /**
     * Some logic after player quits the game. Remove stuff
     */
    quitGame: function() {

        var jsonData = {
            topic: 'game',
            type: 'quit',
            data: {
            }
        };
        TheHelpingHand.Client.socket.send(JSON.stringify(jsonData));
        TheHelpingHand.Game.currentScene = {};
        $('#game').style.display = 'none';
        $('#game').innerHTML = '';
    },

    /**
     * Sets the current client information
     * @param message object
     * @returns {boolean}
     */
    setClient: function (message) {

        if (message.CLIENT_ID == null || message.CLIENT_ID == '') {
            return false;
        }
        document.cookie = "CLIENT_ID="+ message.CLIENT_ID +"; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
        if (message.name != null && message.name != '') {
            $('#client-name').innerHTML = message.name;
            document.cookie = "name=" + message.name + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
        }

        this.client = message;

    },

    /**
     * Removes the cookie and logs out the user
     */
    removeClient: function() {

        document.cookie = "CLIENT_ID=; expires=Fri, 31 Dec 0000 23:59:59 GMT; path=/";
        document.cookie = "name=; expires=Fri, 31 Dec 0000 23:59:59 GMT; path=/";

    },

    /**
     * parse a message received from the server.
     * @param data object stringify json object
     * @returns {boolean}
     */
    parseMessage: function (data) {

        var data = JSON.parse(data);
        if (data.topic == null) {
            console.warn('Topic not set');
            return false;
        }
        switch (data.topic) {
            case 'identity':
                TheHelpingHand.Client.setClient(data.data);
            break;
            case 'game':
                if (data.type == 'list') {
                    TheHelpingHand.Game.list(data.data.games);
                }
                else if (data.type == 'start') {
                    TheHelpingHand.Game.start(data.data);
                }
              else if (data.type == 'playerJoined') {
                    if ($('#players') != null) {
                        $('#players').innerHTML += '<div id="player-'+ data.data.CLIENT_ID +'">' + data.data.name + ' (<span id="score-'+ data.data.CLIENT_ID +'">0</span>)</div>';
                    }
                }
            break;
            case 'score':
                if (data.type == 'update') {
                    if ($('#score-' + data.data.CLIENT_ID) != null) {
                        $('#score-' + data.data.CLIENT_ID).innerHTML = data.data.score;
                    }
                }
            break;
            case 'event':
              TheHelpingHand.Game.addEvent(data.data);
            break;
            case 'spell':
              if (data.type == 'update') {
                  TheHelpingHand.Game.updateEvent(data.data.elementIndex, data.data.eventIndex, data.data.amount);
              }
            break;
            case 'error':
              this.displayError(data.data.message);
            break;
            default:
                console.warn('Topic not implemented: ' + data.topic);
        }
        return false;

    },

    displayError: function (message) {

        if (this._timers.error != null) {
            window.clearTimeout(this._timers.error);
        }
        $('#error').innerHTML += message;
        $('#error').style.display = 'block';
        this._timers.error = setTimeout(this.hideError, 2000);

    },

    hideError: function() {

        this._timers.error = null;
        $('#error').style.display = 'none';
        $('#error').innerHTML = '';


    }

};