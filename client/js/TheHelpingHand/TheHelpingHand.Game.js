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

        var html = '<div class="top-buffer">';
        html += '<a href="#join" onclick="TheHelpingHand.Game.join();" class="btn btn-primary">New game</a> ';
        html += '<a href="#join" onclick="TheHelpingHand.Game.getList();" class="btn btn-default">Refresh</a>';
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
            html += '<tr><td colspan="3">No games available.</td></tr>';
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
        html += '</div>';
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

    },

    /**
     * Starts a game and create the scene!
     * @param gameData object with game attributes. E.g.
     * {
     *      id: this.gamesCount,
            name: 'dummy game',
            sceneIndex: 0, // See TheHelpingHand::availableScenes
            players: []
     * }
     */
    start: function(gameData) {

        var Scene = TheHelpingHand.availableScenes[gameData.sceneIndex].object();

        console.log(Scene);

        var html = '';
        html += '<div id="scene" style="background-image: url(assets/images/'+ Scene.background +');">abc</div>';
        html += '<div id="ui">';
        for (var i = 0; i < Scene.availableSpells.length; i++) {
            var spell = Scene.availableSpells[i].object();
            console.log(spell);
            html += '<img src="assets/icons/' + spell.icon +'" />';
        }
        html += '</div>';
        $('#game').innerHTML = html;
        $('#game').style.display = 'block';

    }

};