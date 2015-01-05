TheHelpingHand.Game = {

    /**
     * Join or create a game
     * @param game_id
     */
    join: function(game_id) {

        if (game_id == null) {
            game_id = '';
        }
        var jsonData = {
            topic: 'game',
            data: {
                type: 'join',
                id: game_id
            }
        };
        TheHelpingHand.Client.socket.send(JSON.stringify(jsonData));

    },

    /**
     * Creates html output for games
     * @param games
     */
    list: function(games) {

        var html = '<a href="#join" onclick="TheHelpingHand.Game.join();" class="btn btn-primary">New game</a>';
        html += '<table class="table table-striped">';
        html += '<thead>';
        html += '<tr>';
        html += '<th>Game</th>';
        html += '<th>Players</th>';
        html += '<th>Options</th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
        if (games.length == 0) {
            html += '<tr><td colspan="3">No games available. <a href="#join" onclick="TheHelpingHand.Game.join();" class="btn btn-primary">New game</a></td></tr>';
        }
        else {
            console.log(games);
            for (var i = 0; i < games.length; i++) {
                var game = games[i];
                console.log(game);
                html += '<tr>';
                html += '<td>'+ game.name +'</td>';
                html += '<td>'+ game.players.length +'</td>';
                html += '<td><a href="#join" onclick="TheHelpingHand.Game.join('+ game.id +');" class="btn btn-default">Join</a></td>';
                html += '</tr>';
            }
        }
        html += '</tbody>';
        html += '</table>';
        $('#content').innerHTML = html;

    },

    getList: function() {

        if (TheHelpingHand.Client.connected == false) {
            return [];
        }
        var jsonData = {
            topic: 'game',
            data: {
                type: 'list'
            }
        };
        TheHelpingHand.Client.socket.send(JSON.stringify(jsonData));

    }

};