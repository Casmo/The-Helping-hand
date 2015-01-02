TheHelpingHand.Game = {

    join: function(game_id) {

    },

    /**
     * Creates html output for games
     * @param games
     */
    list: function(games) {

        var html = '<table class="table table-striped">';
        html += '<thead>';
        html += '<tr>';
        html += '<th>Game</th>';
        html += '<th>Options</th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
        for (var i = 0; i < games.length; i++) {
            var game = games[i];
            html += '<tr>';
            html += '<td>'+ game.name +'</td>';
            html += '<td><a href="#join" onclick="TheHelpingHand.Game.join('+ game.id +');" class="btn btn-default">Join</a></td>';
            html += '</tr>';
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