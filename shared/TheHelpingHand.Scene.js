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
     * @var background string the background image of the scene. E.g. restaurant.jpg
     */
    this.background = '';

    /**
     * List of available elements here. E.g. Chair, Cook, Waiter
     */
    this.availableElements = [];

    /**
     * List of available spells for the player
     * @type {Array}
     */
    this.availableSpells = [];

    /**
     * Spawned elements
     */
    this.elements = [];

    /**
     * Maximum players that can join
     * @type {number}
     */
    this.maxPlayers = 100;

};

TheHelpingHand.Scene.prototype.constructor = function() {

};

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