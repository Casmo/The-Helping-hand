/**
 * Main class for Events
 */
TheHelpingHand.Event = function() {

    /**
     * @var name string the name of the event e.g. "food"
     */
    this.name = '';

    /**
     * @var icon of the event
     */
    this.icon = '';

    /**
     * List of spell types that can counter this event
     */
    this.counteredBy = [];

};

TheHelpingHand.Event.prototype.constructor = TheHelpingHand.Event;

/**
 * Update function for rendering animations
 */
TheHelpingHand.Event.prototype.update = function() {

};