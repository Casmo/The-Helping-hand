/**
 * @depends TheHelpingHand.ElementTable
 */
TheHelpingHand.EventHunger = function() {

    TheHelpingHand.Event.call( this );

    this.name = 'Hunger';

    this.icon = 'meat.png';

};

TheHelpingHand.EventHunger.prototype = Object.create( TheHelpingHand.Event.prototype );

TheHelpingHand.EventHunger.prototype.update = function() {

    TheHelpingHand.Event.prototype.update.call(this);

};