/**
 * Food - fish spell
 */
TheHelpingHand.SpellFoodFish = function() {

    TheHelpingHand.Spell.call( this );

    /**
     * @var name string the name of the scene. e.g. "Restaurant"
     */
    this.name = 'Serve fish';

    this.type = 'food';

    /**
     * @var background string the background image of the scene. E.g. restaurant.jpg
     */
    this.icon = 'angler-fish.png';

    /**
     * Cooldown in microseconds
     */
    this.cooldown = 5000;

};

TheHelpingHand.SpellFoodFish.prototype = Object.create( TheHelpingHand.Spell.prototype );

TheHelpingHand.SpellFoodFish.prototype.update = function() {

    TheHelpingHand.Spell.prototype.update.call(this);

};