/**
 * @depends TheHelpingHand.Scene
 * @type {{name: string, background: string, availableElements: {}[], elements: Array, constructor: Function, update: Function}}
 */
TheHelpingHand.SceneRestaurant = function() {

    TheHelpingHand.Scene.call( this );

    this.name = 'Restaurant';

    this.grid = {
        x: 5,
        y: 7,
        w: 108,
        h: 62,
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
            grid: 5
        },
        {
            object: function() { return new TheHelpingHand.ElementTable(); },
            grid: 10
        },
        {
            object: function() { return new TheHelpingHand.ElementTable(); },
            grid: 15
        },
        {
            object: function() { return new TheHelpingHand.ElementTable(); },
            grid: 19
        },
        {
            object: function() { return new TheHelpingHand.ElementTable(); },
            grid: 24
        }
    ];

};

TheHelpingHand.SceneRestaurant.prototype = Object.create( TheHelpingHand.Scene.prototype );

TheHelpingHand.SceneRestaurant.prototype.update = function() {

    TheHelpingHand.Scene.prototype.update.call(this);

};