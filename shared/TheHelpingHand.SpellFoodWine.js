/**
 * Food - wine spell
 */
TheHelpingHand.SpellFoodWine = function() {

    TheHelpingHand.Spell.call( this );

    /**
     * @var name string the name of the scene. e.g. "Restaurant"
     */
    this.name = 'Serve wine';

    this.type = 'drink';

    /**
     * @var icon
     */
    this.icon = 'wine-glass.png';

    /**
     * Cooldown in microseconds
     */
    this.cooldown = 5000;

};

TheHelpingHand.SpellFoodWine.prototype = Object.create( TheHelpingHand.Spell.prototype );

TheHelpingHand.SpellFoodWine.prototype.update = function() {

    TheHelpingHand.Spell.prototype.update.call(this);

};