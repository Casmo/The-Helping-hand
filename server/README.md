Run `node server.js` to run the server.

# Data specs
The following data can be send back and forth to the server

### Basic usage
    var jsonData = {
      topic: 'topic',
      type: 'x',
      data: {
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
        type: 'list',
        data: {
        }
    };

### Join game (id: 1) Client -> Server
    var jsonData = {
        topic: 'game',
        type: 'join',
        data: {
            id: 1
        }
    };

### Quit game Client -> server
    var jsonData = {
        topic: 'game',
        type: 'quit',
        data: {
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
        type: 'playerLeft',
        data: {
            CLIENT_ID: 'abc-def-ghi'
        }
    };
### Player joined a game
    var dataJson = {
        topic: 'game',
        type: 'playerJoined',
        data: {
            CLIENT_ID: 'abc-def-ghi'
        }
    };

### Initial for creating a game
    var gameInfo = TheHelpingHand.Server.games[gameIndex];
    gameInfo.Scene = null;
    gameInfo.type = 'start';
    topic: 'game',
    var dataJson = {
        data: gameInfo
    };

### Send a list of games to the player
    var dataJson = {
        topic: 'game',
        type: 'list',
        data: {
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

### Send an event to a player
    var eventData = {
        eventIndex: randomEvent,
        amount: 1,
        timeout: 5000,
        start: Date.now(),
        elementIndex: randomElement
    };
    currentElement.push(eventData);
    var dataJson = {
        topic: event,
        data: eventData
    };