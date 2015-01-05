Run `node server.js` to run the server.

# Data specs
The following data can be send back and forth to the server

### Basic usage
    var jsonData = {
      topic: 'topic',
      data: {
        type: 'x',
        var2: 'y',
        id: 6
      }
    }
    TheHelpingHand.Client.socket.send(JSON.stringify(jsonData));

## Client requesting data from server
Below examples for the client requesting or pusing data to the server

### Get game list Client -> Server
    var jsonData = {
        topic: 'game',
        data: {
            type: 'list'
        }
    };

### Join game (id: 1) Client -> Server
    var jsonData = {
        topic: 'game',
        data: {
            type: 'join',
            id: 1
        }
    };

### Player leaves a game
    var dataJson = {
        topic: 'game',
        data: {
            type: 'leave'
        }
    };

## Server pushing data to the client
Below examples for the server pushing data to the client

### Send an error message
    var dataJson = {
        topic: 'error',
        data: {
            message: 'This is an ugly error!'
        }
    };

### Send the user info
    var dataJson = {
        topic: 'identity',
        data: {
            CLIENT_ID: 'abc-def-ghi',
            name: 'Guest (1)'
        }
    };

### Player left a game
    var dataJson = {
        topic: 'game',
        data: {
            type: 'playerLeft',
            CLIENT_ID: 'abc-def-ghi'
        }
    };
### Player joined a game
    var dataJson = {
        topic: 'game',
        data: {
            type: 'playerJoined',
            CLIENT_ID: 'abc-def-ghi'
        }
    };

### Initial for creating a game
    var gameInfo = TheHelpingHand.Server.games[gameIndex];
    gameInfo.Scene = null;
    gameInfo.type = 'start';
    var dataJson = {
        topic: 'game',
        data: gameInfo
    };

### Send a list of games to the player
    var dataJson = {
        topic: 'game',
        data: {
            type: 'list',
            games: [
               {
                   id: 0,
                   name: 'dummy game',
                   Scene: {},
                   players: [],
               }
           ]
        }
    };