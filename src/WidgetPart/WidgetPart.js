import Helper from '../Helper.js';

/**
 * Widget part class.
 *
 * @class WidgetPart
 * @constructor
 * @author Skyflow
 * @version 1.0.0
 * @requires Helper
 */
export default class WidgetPart {

    constructor(part) {

        /**
         * Stores part element.
         *
         * @property container
         * @type {HTMLElement}
         * @since 1.0.0
         */
        this.this = part;

    }

    /**
     * Shows WidgetPart .
     *
     * @method show
     * @since 1.0.0
     * @returns {WidgetPart} Returns the current WidgetPart object.
     */
    show(){
        this.this.style.display = 'block';
        return this;
    };

    /**
     * Checks if WidgetPart is displayed.
     *
     * @method isActive
     * @since 1.0.0
     * @returns {Boolean} Returns true if WidgetPart is displayed and false otherwise.
     */
    isActive(){
        return (window.getComputedStyle(this.this, null).getPropertyValue('display') !== 'none');
    };

    /**
     * Hides WidgetPart.
     *
     * @method hide
     * @since 1.0.0
     * @returns {WidgetPart} Returns the current WidgetPart object.
     */
    hide(){
        this.this.style.display = 'none';
        return this;
    };

    /**
     * Sets string as WidgetPart content.
     *
     * @method text
     * @param {String} text Content of WidgetPart.
     * @since 1.0.0
     * @returns {WidgetPart} Returns an instance of WidgetPart object.
     */
    text(text){
        this.this.textContent = text;
        return this;
    };

    /**
     * Sets HTML string as WidgetPart content.
     *
     * @method html
     * @param {String} html Content of WidgetPart.
     * @since 1.0.0
     * @returns {WidgetPart} Returns an instance of WidgetPart object.
     */
    html(html){
        this.this.innerHTML = html;
        return this;
    };

    /**
     * Adds child element to WidgetPart.
     *
     * @method addChild
     * @param {HTMLElement} child Child to add.
     * @since 1.0.0
     * @returns {WidgetPart} Returns an instance of WidgetPart object.
     */
    addChild(child){
        this.this.appendChild(child);
        return this;
    };

    /**
     * Adds class to WidgetPart.
     *
     * @method addClass
     * @param {String} name Class name.
     * @since 1.0.0
     * @returns {WidgetPart} Returns an instance of WidgetPart object.
     */
    addClass(name){
        this.this.classList.add(name);
        return this;
    };

    /**
     * Removes class from WidgetPart.
     *
     * @method removeClass
     * @param {String} name Class name.
     * @since 1.0.0
     * @returns {WidgetPart} Returns an instance of WidgetPart object.
     */
    removeClass(name){
        this.this.classList.remove(name);
        return this;
    };

    /**
     * Removes WidgetPart element from DOM.
     *
     * @method remove
     * @since 1.0.0
     * @returns {WidgetPart} Returns the current WidgetPart object.
     */
    remove(){
        this.this.parentNode.removeChild(this.this);
        return this;
    };

    /**
     * Adds event to WidgetPart element.
     *
     * @method addEvent
     * @param {String} event Event name.
     * @param {Function} callback Event callback.
     * @since 1.0.0
     * @returns {WidgetPart} Returns the current WidgetPart object.
     */
    addEvent(event, callback){
        Helper.addEvent(this.this, event, callback);
        return this;
    };

    /**
     * Removes event from WidgetPart element.
     *
     * @method removeEvent
     * @param {String} event Event name.
     * @param {Function} callback Event callback.
     * @since 1.0.0
     * @returns {WidgetPart} Returns the current WidgetPart object.
     */
    removeEvent(event, callback){
        Helper.removeEvent(this.this, event, callback);
        return this;
    };

}
