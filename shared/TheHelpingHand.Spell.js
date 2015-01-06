/**
 * Main class for Spells
 */
TheHelpingHand.Spell = function() {

    /**
     * @var name string the name of the scene. e.g. "Restaurant"
     */
    this.name = '';

    this.type = ''; // Type of the spell. Can be used in the event countered list.

    /**
     * @var background string the background image of the scene. E.g. restaurant.jpg
     */
    this.icon = '';

    /**
     * Cooldown in microseconds
     */
    this.cooldown = 1000;

};

TheHelpingHand.Spell.prototype.constructor = TheHelpingHand.Spell;

/**
 * Update function for rendering animations
 */
TheHelpingHand.Spell.prototype.update = function() {

    // Not sure what to update here

};