import Helper from '../Helper.js';

/**
 * Base widget class.
 *
 * @class Widget
 * @constructor
 * @author Skyflow
 * @version 1.0.0
 * @requires Helper
 */
export default class Widget {

    constructor() {
        this.config = {
            events: {},
        };
    }

    /**
     * Sets events.
     *
     * @method on
     * @param {String} event Event name. See config.events to know list of events.
     * @param {Function} callback Function to trigger.
     * @since 1.0.0
     * @returns {Widget} Returns the current Widget object.
     */
    on(event, callback) {
        if (Helper.hasProperty(this.config.events, event)) {
            this.config.events[event] = callback;
        }
        return this;
    }

    /**
     * Removes events.
     *
     * @method off
     * @param {String} event Event name. See config.events to know list of events.
     * @since 1.0.0
     * @returns {Widget} Returns the current Widget object.
     */
    off(event) {
        if (Helper.hasProperty(this.config.events, event)) {
            this.config.events[event] = null;
        }
        return this;
    }

    /**
     * Adds class to Widget container.
     *
     * @method addClass
     * @param {String} name Class name.
     * @since 1.0.0
     * @returns {Widget} Returns the current Widget object.
     */
    addClass(name){
        this.container.classList.add(name);
        return this;
    }

    /**
     * Removes class from Widget container.
     *
     * @method removeClass
     * @param {String} name Class name.
     * @since 1.0.0
     * @returns {Widget} Returns the current Widget object.
     */
    removeClass(name){
        this.container.classList.remove(name);
        return this;
    }

    /**
     * Removes Widget element from DOM.
     *
     * @method remove
     * @since 1.0.0
     * @returns {Widget} Returns the current Widget object.
     */
    remove(){
        this.container.parentNode.removeChild(this.container);
        return this;
    }

}
