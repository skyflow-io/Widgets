import './switch.scss';
import Helper from '../Helper.js';
import Widget from '../Widget/Widget.js';

/**
 * Custom switch button.
 *
 * @class Switch
 * @constructor
 * @author Skyflow
 * @version 1.0.0
 * @requires Helper
 * @extends Widget
 * @example
 *      let switch = new Switch('.my-input-element');
 *      switch.on('check', (context) => {
 *          console.log(context);
 *      });
 */
export default class Switch extends Widget{

    /**
     * Constructor.
     *
     * @method constructor
     * @param {HTMLInputElement|String} target Switch target. Must be HTMLInputElement with switch type.
     * @since 1.0.0
     * @returns {Switch} Returns an instance of Switch object.
     */
    constructor(target) {
        super();

        if (Helper.isString(target)) {
            target = document.querySelector(target);
        }
        if (!Helper.isElement(target)) {
            console.error(`SkyflowSwitchError: Can not find target '${target}' element from the DOM.`);
            return this;
        }
        if (target.tagName !== 'INPUT' || target.type !== 'checkbox') {
            console.error(`SkyflowSwitchError: Target element must be a HTMLInputElement with checkbox type.`);
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
         * Switch container element.
         *
         * @property container
         * @type {HTMLElement}
         * @since 1.0.0
         * @default HTMLDivElement
         */
        this.container = document.createElement('label');
        this.addClass('skyflow-switch-container');
        Helper.insertAfter(this.container, this.target);
        this.container.appendChild(this.target);
        this.mark = document.createElement('span');
        this.mark.classList.add('skyflow-switch-mark');
        this.container.appendChild(this.mark);
        Helper.addEvent(this.target, 'change', ()=>{
            if (this.target.checked && this.config.events.check) {
                this.config.events.check.apply(null, [this]);
            }
            if (!this.target.checked && this.config.events.uncheck) {
                this.config.events.uncheck.apply(null, [this]);
            }
        });

        /**
         * Switch configuration array.
         *
         * @property config
         * @type {Object}
         * @since 1.0.0
         */
        this.config = {
            /**
             * Switch events array.
             *
             * @property config.events
             * @type {Object}
             * @since 1.0.0
             */
            events: {
                /**
                 * Switch check event.
                 *
                 * @property config.events.check
                 * @type {Function}
                 * @since 1.0.0
                 * @default null
                 */
                check: null,
                /**
                 * Switch uncheck event.
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
     * Checks Switch object.
     *
     * @method check
     * @since 1.0.0
     * @returns {Switch} Returns the current Switch object.
     */
    check(){
        this.target.checked = true;
        return this;
    }

}
