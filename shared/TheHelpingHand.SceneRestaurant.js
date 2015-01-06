/**
 * @depends TheHelpingHand.Scene
 * @type {{name: string, background: string, availableElements: {}[], elements: Array, constructor: Function, update: Function}}
 */
TheHelpingHand.SceneRestaurant = function() {

    TheHelpingHand.Scene.call( this );

    this.name = 'Restaurant';

    this.grid = {
        x: 8,
        y: 8,
        w: 128,
        h: 64,
        image: 'scene-restaurant-tile.png'
    };

    this.availableSpells = [
        {
            object: function() { return new TheHelpingHand.SpellFoodFish(); }
        },
        {
            object: function() { return new TheHelpingHand.SpellFoodWine(); }
        }
    ];

    this.elements = [
        {
            object: function() { return new TheHelpingHand.ElementTable(); },
            grid: 1
        },
        {
            object: function() { return new TheHelpingHand.ElementTable(); },
            grid: 4
        },
        {
            object: function() { return new TheHelpingHand.ElementTable(); },
            grid: 8
        },
        {
            object: function() { return new TheHelpingHand.ElementTable(); },
            grid: 9
        },
        {
            object: function() { return new TheHelpingHand.ElementTable(); },
            grid: 15
        },
        {
            object: function() { return new TheHelpingHand.ElementTable(); },
            grid: 18
        }
    ];

};

TheHelpingHand.SceneRestaurant.prototype = Object.create( TheHelpingHand.Scene.prototype );

TheHelpingHand.SceneRestaurant.prototype.update = function() {

    TheHelpingHand.Scene.prototype.update.call(this);

};