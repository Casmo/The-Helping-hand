/**
 * @depends TheHelpingHand.ElementTable
 */
TheHelpingHand.ElementTable = function() {

    this.name = 'Restaurant';

    this.image = 'element-table-empty.png';

};

TheHelpingHand.ElementTable.prototype = Object.create( TheHelpingHand.Element.prototype );

TheHelpingHand.ElementTable.prototype.update = function() {

    TheHelpingHand.Element.prototype.update.call(this);

};