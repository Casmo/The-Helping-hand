TheHelpingHand.Client = {

    socket: {},

    /**
     * Current client information
     */
    client: {},

    connect: function() {

        /**
         *
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
            var data = JSON.parse(event.data);
            if (data.topic == null) {
                return false;
            }
            switch (data.topic) {
                case 'identity':
                    TheHelpingHand.Client.setClient(data.data);
                break;
                default:
                console.warn('Topic not implemented: ' + data.topic);
            }
            return false;
        };
        this.socket.onopen = function (event) {};
        this.socket.onclose = function(event) {};
        this.socket.onerror = function(event) {};

    },

    disconnect: function() {

        if (this.socket != null) {
            this.socket.close();
        }

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

    }

};