/**
 * Main class for Elements
 */
TheHelpingHand.Element = function() {

    /**
     * @var name string the name of the scene. e.g. "Restaurant"
     */
    this.name = '';

    /**
     * @var image of the element
     */
    this.image = '';

    /**
     * countered by spells
     */
    this.counteredBy = [
    ];

};

TheHelpingHand.Element.prototype.constructor = TheHelpingHand.Element;

/**
 * Update function for rendering animations
 */
TheHelpingHand.Element.prototype.update = function() {

};