/**
 * Main class for Scene
 * @type {{name: string, background: string, elements: Array, constructor: Function, update: Function}}
 */
TheHelpingHand.Scene = function() {

    /**
     * @var name string the name of the scene. e.g. "Restaurant"
     */
    this.name = '';

    /**
     * Grid type and sizes
     * @type {{x: number, y: number}}
     */
    this.grid = {
        x: 5,
        y: 5,
        w: 128,
        h: 64,
        image: ''
    };

    /**
     * List of available spells for the player
     * @type {Array}
     */
    this.availableSpells = [
//        {
//            object: function() { return new TheHelpingHand.SpellFoodFish(); }
//        }
    ];

    /**
     * Spawned elements from the start. Each element might be updated with 'debuffs' that can be countered with the available spells
     */
    this.elements = [];

    /**
     * Maximum players that can join
     * @type {number}
     */
    this.maxPlayers = 100;

};

TheHelpingHand.Scene.prototype.constructor = TheHelpingHand.Scene;

/**
 * Update function for rendering animations
 */
TheHelpingHand.Scene.prototype.update = function() {

    for (var element in this.elements) {
        if (typeof element.update == 'function') {
            element.update();
        }
    }

};