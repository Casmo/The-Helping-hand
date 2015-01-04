/**
 * @depends TheHelpingHand.Scene
 * @type {{name: string, background: string, availableElements: {}[], elements: Array, constructor: Function, update: Function}}
 */
TheHelpingHand.SceneRestaurant = function() {

    this.name = 'Restaurant';

    this.background = 'wood.png';

};

TheHelpingHand.SceneRestaurant.prototype = Object.create( TheHelpingHand.Scene.prototype );