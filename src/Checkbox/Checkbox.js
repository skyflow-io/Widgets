/**
 * Custom checkbox button.
 *
 * @class Checkbox
 * @constructor
 * @author Skyflow
 * @version 1.0.0
 * @requires Helper
 * @example
 *      let checkbox = new Checkbox('.my-input-element');
 *      checkbox.on('check', (context) => {
 *          console.log(context);
 *      });
 */
export default class Checkbox {

    /**
     * Constructor.
     *
     * @method constructor
     * @param {HTMLInputElement|String} target Checkbox target. Must be HTMLInputElement with checkbox type.
     * @param {String} label Checkbox label.
     * @since 1.0.0
     * @returns {Checkbox} Returns an instance of Checkbox object.
     */
    constructor(target, label) {

        if (Helper.isString(target)) {
            target = document.querySelector(target);
        }
        if (!Helper.isElement(target)) {
            console.error(`SkyflowCheckboxError: Can not find target '${target}' element from the DOM.`);
            return this;
        }
        if (target.tagName !== 'INPUT' || target.type !== 'checkbox') {
            console.error(`SkyflowCheckboxError: Target element must be a HTMLInputElement with checkbox type.`);
            return this;
        }

        /**
         * Target element.
         *
         * @property target
         * @type {HTMLInputElement}
         * @since 1.0.0
         */
        this.target = target;

        /**
         * Checkbox container element.
         *
         * @property container
         * @type {HTMLElement}
         * @since 1.0.0
         * @default HTMLDivElement
         */
        this.container = document.createElement('label');
        this.addClass('skyflow-checkbox-container');
        Helper.insertAfter(this.container, this.target);
        this.container.appendChild(this.target);
        this.mark = document.createElement('span');
        this.mark.classList.add('skyflow-checkbox-mark');
        this.container.appendChild(this.mark);
        this.label = document.createElement('span');
        this.label.classList.add('skyflow-checkbox-label');
        if(Helper.isString(label)){
            this.label.innerHTML = label;
        }
        this.container.appendChild(this.label);
        Helper.addEvent(this.target, 'change', ()=>{
            if (this.target.checked && this.config.events.check) {
                this.config.events.check.apply(null, [this]);
            }
            if (!this.target.checked && this.config.events.uncheck) {
                this.config.events.uncheck.apply(null, [this]);
            }
        });

        /**
         * Checkbox configuration array.
         *
         * @property config
         * @type {Object}
         * @since 1.0.0
         */
        this.config = {
            /**
             * Checkbox events array.
             *
             * @property config.events
             * @type {Object}
             * @since 1.0.0
             */
            events: {
                /**
                 * Checkbox check event.
                 *
                 * @property config.events.check
                 * @type {Function}
                 * @since 1.0.0
                 * @default null
                 */
                check: null,
                /**
                 * Checkbox uncheck event.
                 *
                 * @property config.events.uncheck
                 * @type {Function}
                 * @since 1.0.0
                 * @default null
                 */
                uncheck: null,
            },
        };

    }

    /**
     * Checks Checkbox object.
     *
     * @method check
     * @since 1.0.0
     * @returns {Checkbox} Returns the current Checkbox object.
     */
    check(){
        this.target.checked = true;
        return this;
    }

    /**
     * Un-checks Checkbox object.
     *
     * @method uncheck
     * @since 1.0.0
     * @returns {Checkbox} Returns the current Checkbox object.
     */
    uncheck(){
        this.target.checked = false;
        return this;
    }

    /**
     * Toggles Checkbox object.
     *
     * @method toggle
     * @since 1.0.0
     * @returns {Checkbox} Returns the current Checkbox object.
     */
    toggle(){
        this.target.checked = !this.target.checked;
        return this;
    }

    /**
     * Sets events for Checkbox object.
     *
     * @method on
     * @param {String} event Event name. See config.events to know list of events.
     * @param {Function} callback Function to trigger.
     * @since 1.0.0
     * @example
     *      let checkbox = new Checkbox();
     *      checkbox.on('check', (context) => {
     *          console.log(context);
     *      })
     * @returns {Checkbox} Returns the current Checkbox object.
     */
    on(event, callback) {
        if (Helper.hasProperty(this.config.events, event)) {
            this.config.events[event] = callback;
        }
        return this;
    }

    /**
     * Removes events for Checkbox object.
     *
     * @method off
     * @param {String} event Event name. See config.events to know list of events.
     * @since 1.0.0
     * @returns {Checkbox} Returns the current Checkbox object.
     */
    off(event) {
        if (Helper.hasProperty(this.config.events, event)) {
            this.config.events[event] = null;
        }
        return this;
    }

    /**
     * Adds class to Checkbox container.
     *
     * @method addClass
     * @param {String} name Class name.
     * @since 1.0.0
     * @returns {Checkbox} Returns the current Checkbox object.
     */
    addClass(name){
        this.container.classList.add(name);
        return this;
    }

    /**
     * Removes class from Checkbox container.
     *
     * @method removeClass
     * @param {String} name Class name.
     * @since 1.0.0
     * @returns {Checkbox} Returns the current Checkbox object.
     */
    removeClass(name){
        this.container.classList.remove(name);
        return this;
    }

    /**
     * Removes Checkbox element from DOM.
     *
     * @method remove
     * @since 1.0.0
     * @returns {Checkbox} Returns the current Checkbox object.
     */
    remove(){
        this.container.parentNode.removeChild(this.container);
        return this;
    }

}
