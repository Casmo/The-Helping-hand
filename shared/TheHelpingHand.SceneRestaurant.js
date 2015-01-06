/**
 * @depends TheHelpingHand.Scene
 * @type {{name: string, background: string, availableElements: {}[], elements: Array, constructor: Function, update: Function}}
 */
TheHelpingHand.SceneRestaurant = function() {

    this.name = 'Restaurant';

    this.background = 'scene-restaurant-background.png';

    this.availableSpells = [
        {
            object: function() { return new TheHelpingHand.SpellFoodFish(); }
        },
        {
            object: function() { return new TheHelpingHand.SpellFoodWine(); }
        }
    ];

    this.availableElements = [
        {
            object: function() { return new TheHelpingHand.ElementTable(); }
        }
    ];

};

TheHelpingHand.SceneRestaurant.prototype = Object.create( TheHelpingHand.Scene.prototype );

TheHelpingHand.SceneRestaurant.prototype.update = function() {

    TheHelpingHand.Scene.prototype.update.call(this);

};