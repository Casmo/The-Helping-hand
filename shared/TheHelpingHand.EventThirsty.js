/**
 * @depends TheHelpingHand.ElementTable
 */
TheHelpingHand.EventThirsty = function() {

    TheHelpingHand.Event.call( this );

    this.name = 'Thirsty';

    this.icon = 'drink-me.png';

    this.counteredBy = ['drink'];

};

TheHelpingHand.EventThirsty.prototype = Object.create( TheHelpingHand.Event.prototype );

TheHelpingHand.EventThirsty.prototype.update = function() {

    TheHelpingHand.Event.prototype.update.call(this);

};