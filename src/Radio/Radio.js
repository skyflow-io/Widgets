import './radio.scss';
import Helper from '../Helper.js';
import Widget from '../Widget/Widget.js';

/**
 * Custom radio button.
 *
 * @class Radio
 * @constructor
 * @author Skyflow
 * @version 1.0.0
 * @requires Helper
 * @extends Widget
 * @example
 *      let radio = new Radio('.my-input-element');
 *      radio.on('check', (context) => {
 *          console.log(context);
 *      });
 */
export default class Radio extends Widget{

    /**
     * Constructor.
     *
     * @method constructor
     * @param {HTMLInputElement|String} target Radio target. Must be HTMLInputElement with radio type.
     * @param {String} label Radio label.
     * @since 1.0.0
     * @returns {Radio} Returns an instance of Radio object.
     */
    constructor(target, label) {
        super();

        if (Helper.isString(target)) {
            target = document.querySelector(target);
        }
        if (!Helper.isElement(target)) {
            console.error(`SkyflowRadioError: Can not find target '${target}' element from the DOM.`);
            return this;
        }
        if (target.tagName !== 'INPUT' || target.type !== 'radio') {
            console.error(`SkyflowRadioError: Target element must be a HTMLInputElement with radio type.`);
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
         * Radio container element.
         *
         * @property container
         * @type {HTMLElement}
         * @since 1.0.0
         * @default HTMLDivElement
         */
        this.container = document.createElement('label');
        this.addClass('skyflow-radio-container');
        Helper.insertAfter(this.container, this.target);
        this.container.appendChild(this.target);
        this.mark = document.createElement('span');
        this.mark.classList.add('skyflow-radio-mark');
        this.container.appendChild(this.mark);
        this.label = document.createElement('span');
        this.label.classList.add('skyflow-radio-label');
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
         * Radio configuration array.
         *
         * @property config
         * @type {Object}
         * @since 1.0.0
         */
        this.config = {
            /**
             * Radio events array.
             *
             * @property config.events
             * @type {Object}
             * @since 1.0.0
             */
            events: {
                /**
                 * Radio check event.
                 *
                 * @property config.events.check
                 * @type {Function}
                 * @since 1.0.0
                 * @default null
                 */
                check: null,
                /**
                 * Radio uncheck event.
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
     * Checks Radio object.
     *
     * @method check
     * @since 1.0.0
     * @returns {Radio} Returns the current Radio object.
     */
    check(){
        this.target.checked = true;
        return this;
    }

}
