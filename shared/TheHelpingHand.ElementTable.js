/**
 * @depends TheHelpingHand.ElementTable
 */
TheHelpingHand.ElementTable = function() {

    TheHelpingHand.Element.call( this );

    this.name = 'Table';

    this.image = 'element-table-empty.png';

    /**
     * Available events
     */
    this.availableEvents = [
        {
            object: function() { return new TheHelpingHand.EventHunger(); }
        },
        {
            object: function() { return new TheHelpingHand.EventThirsty(); }
        }
    ];

};

TheHelpingHand.ElementTable.prototype = Object.create( TheHelpingHand.Element.prototype );

TheHelpingHand.ElementTable.prototype.update = function() {

    TheHelpingHand.Element.prototype.update.call(this);

};