/**
 * Joining, leaving games, active spells, game mechanics, etc
 * @type {{join: join, list: list, getList: getList, start: start, activateSpell: activateSpell}}
 */
TheHelpingHand.Game = {

    /**
     * List of spells the player can use with there object
     */
    spells: [
    ],

    /**
     * Current activated spell
     */
    activeSpell: -1,

    /**
     * Current scene
     */
    currentScene: {},

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

        console.log(games);
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
        for (var index in games) {
            if (!games.hasOwnProperty(index)) {
                continue;
            }
            var game = games[index];
            html += '<tr>';
            html += '<td>'+ game.name +'</td>';
            html += '<td>'+ game.players.length +'</td>';
            html += '<td><a href="#join" onclick="TheHelpingHand.Game.join('+ game.id +');" class="btn btn-default">Join</a></td>';
            html += '</tr>';
        }
        html += '</tbody>';
        html += '</table>';
        html += '</div>';
        $('#content').innerHTML = html;
        for (var index in games.elements) {
            if (!games.elements.hasOwnProperty(index)) {
                continue;
            }
            this.addElement(games.element[index]);
        }

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

        this.currentScene = TheHelpingHand.availableScenes[gameData.sceneIndex].object();

        var html = '';
        html += '<div id="scene" style="background-image: url(assets/images/'+ this.currentScene.background +');"></div>';
        html += '<div class="ui ui-top">';
        html += '<span id="stat-score"></span>';
        html += '<a href="#exit" onclick="TheHelpingHand.Client.quitGame();" class="btn btn-primary">Exit</a>';
        html += '</div>';
        html += '<div class="ui ui-bottom" id="ui">';
        for (var i = 0; i < this.currentScene.availableSpells.length; i++) {
            var spell = this.currentScene.availableSpells[i].object();
            spell.onCooldown = false;
            this.spells.push(spell);
            html += '<img id="spell-'+ i +'" class="spell" onclick="TheHelpingHand.Game.activateSpell('+ i +');" src="assets/icons/' + spell.icon +'" />';
        }
        html += '</div>';
        $('#game').innerHTML = html;
        $('#game').style.display = 'block';

    },

    /**
     * Make a spell in the interface active.
     * @param spellIndex
     */
    activateSpell: function(spellIndex) {

        if (this.activeSpell == spellIndex) {
            $('#spell-'+ spellIndex).className = 'spell';
            this.activeSpell = -1;
            return true;
        }
        // 1. Check if the spell is from cooldown
        if (this.spells[spellIndex].onCooldown == true) {
            return false;
        }

        // 2. Deactivate all other spells
        for (var i = 0; i < $('.spell').length; i++) {
            $('.spell')[i].className = 'spell';
        }

        // 3. Active this spell and make it available for casting
        $('#spell-'+ spellIndex).className = 'spell spell-active';
        this.activeSpell = spellIndex;

    },

    /**
     * Cast the current active spell
     */
    castSpell: function() {

    },

    /**
     * Add a element to the scene
     * @param elementData object with data:
     var element = {
        id: 0,
        elementIndex: randomElement,
        amount: 2,
        timeout: 5000,
        start: Date.now(),
        completed: false
    };
     */
    addElement: function(elementData) {

        var element = this.currentScene.availableElements[elementData.elementIndex].object();
        console.log(element);

        var topPos = 10 + Math.round(Math.random() * (window.innerHeight - 20));
        var leftPos = 10 + Math.round(Math.random() * (window.innerWidth - 20));

        var html = '';
        html += '<img class="element" id="element-'+ elementData.id +'" src="assets/images/'+ element.image +'" style="top: '+ topPos +'px;left: '+ leftPos +'px;" />';
        $('#game').innerHTML += html;

    }

};