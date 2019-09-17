import './modal.scss';
import Helper from '../Helper.js';
import Widget from '../Widget/Widget.js';
import WidgetPart from '../WidgetPart/WidgetPart.js';

/**
 * Display a dialog box/popup on top of the current page.
 *
 * @class Modal
 * @constructor
 * @author Skyflow
 * @version 1.0.0
 * @scripts Helper
 * @requires WidgetPart
 * @extends Widget
 * @example
 *      let modal = new Modal();
 *      modal.Header.text('My modal title');
 *      modal.Body.text('My modal body content');
 *      modal.trigger('.my-trigger');
 *      modal.on('show', (context) => {
 *          console.log(context);
 *          console.log('show');
 *      }).on('hide', (context) => {
 *          console.log(context);
 *          console.log('hide');
 *      });
 */
export default class Modal extends Widget{

    constructor() {
        super();

        /**
         * Modal container element.
         *
         * @property container
         * @type {HTMLElement}
         * @since 1.0.0
         * @default HTMLDivElement
         */
        this.container = document.createElement('div');
        this.addClass('skyflow-modal-container');
        document.body.appendChild(this.container);

        /**
         * Header, body and footer container element.
         *
         * @property wrap
         * @type {HTMLElement}
         * @since 1.0.0
         * @default HTMLDivElement
         */
        this.wrap = document.createElement('div');
        this.wrap.classList.add('skyflow-modal-wrap');
        this.container.appendChild(this.wrap);

        /**
         * Modal close button part.
         *
         * @property CloseButton
         * @type {WidgetPart}
         * @since 1.0.0
         */
        this.CloseButton = new WidgetPart(document.createElement('span'));
        this.CloseButton.show().addClass('skyflow-modal-close-button');
        this.CloseButton.addEvent('click', ()=>{
            this.hide();
        });
        this.wrap.appendChild(this.CloseButton.this);

        /**
         * Modal header part.
         *
         * @property Header
         * @type {WidgetPart}
         * @since 1.0.0
         */
        this.Header = new WidgetPart(document.createElement('div'));
        this.Header.show().addClass('skyflow-modal-header');
        this.wrap.appendChild(this.Header.this);

        /**
         * Modal body part.
         *
         * @property Body
         * @type {WidgetPart}
         * @since 1.0.0
         */
        this.Body = new WidgetPart(document.createElement('div'));
        this.Body.show().addClass('skyflow-modal-body');
        this.wrap.appendChild(this.Body.this);

        /**
         * Modal footer part.
         *
         * @property Footer
         * @type {WidgetPart}
         * @since 1.0.0
         */
        this.Footer = new WidgetPart(document.createElement('div'));
        this.Footer.show().addClass('skyflow-modal-footer');
        this.wrap.appendChild(this.Footer.this);

        /**
         * Modal accept button part.
         *
         * @property AcceptButton
         * @type {WidgetPart}
         * @since 1.0.0
         */
        this.AcceptButton = new WidgetPart(document.createElement('button'));
        this.AcceptButton.addClass('skyflow-modal-accept-button').text('Accept');
        this.AcceptButton.addEvent('click', ()=>{
            if (this.config.events.accept) {
                this.config.events.accept.apply(null, [this]);
            }
        });
        this.Footer.addChild(this.AcceptButton.this);

        /**
         * Modal cancel button part.
         *
         * @property CancelButton
         * @type {WidgetPart}
         * @since 1.0.0
         */
        this.CancelButton = new WidgetPart(document.createElement('button'));
        this.CancelButton.addClass('skyflow-modal-cancel-button').text('Cancel');
        this.CancelButton.addEvent('click', ()=>{
            if (this.config.events.cancel) {
                this.config.events.cancel.apply(null, [this]);
            }
        });
        this.Footer.addChild(this.CancelButton.this);

        /**
         * Modal configuration array.
         *
         * @property config
         * @type {Object}
         * @since 1.0.0
         */
        this.config = {
            /**
             * Modal trigger element.
             *
             * @property config.trigger
             * @type {HTMLElement}
             * @since 1.0.0
             * @default null
             */
            trigger: null,
            /**
             * Modal events array.
             *
             * @property config.events
             * @type {Object}
             * @since 1.0.0
             */
            events: {
                /**
                 * Modal show event.
                 *
                 * @property config.events.show
                 * @type {Function}
                 * @since 1.0.0
                 * @default null
                 */
                show: null,
                /**
                 * Modal hide event.
                 *
                 * @property config.events.hide
                 * @type {Function}
                 * @since 1.0.0
                 * @default null
                 */
                hide: null,
                /**
                 * Modal accept event.
                 *
                 * @property config.events.accept
                 * @type {Function}
                 * @since 1.0.0
                 * @default null
                 */
                accept: null,
                /**
                 * Modal cancel event.
                 *
                 * @property config.events.cancel
                 * @type {Function}
                 * @since 1.0.0
                 * @default null
                 */
                cancel: null,
            },
        };

        this.triggerEventCallback = this.triggerEventCallback.bind(this);

    }

    /**
     * Trigger event callback function.
     *
     * @method triggerEventCallback
     * @since 1.0.0
     * @return {Modal} Returns the current Modal object.
     */
    triggerEventCallback(e) {
        e.preventDefault();
        this.show();
    };

    /**
     * Shows Modal.
     *
     * @method show
     * @since 1.0.0
     * @return {Modal} Returns the current Modal object.
     */
    show(){
        this.addClass('skyflow-modal-is-shown');
        this.container.style.display = 'block';
        let h = 0;
        if(this.Header.isActive()){
            h += this.Header.this.getBoundingClientRect().height;
        }
        if(this.Body.isActive()){
            h += this.Body.this.getBoundingClientRect().height;
        }
        if(this.Footer.isActive()){
            h += this.Footer.this.getBoundingClientRect().height;
        }
        this.wrap.style.height = h + 'px';
        this.container.style.visibility = 'visible';
        if (this.config.events.show) {
            this.config.events.show.apply(null, [this]);
        }
        return this;
    }

    /**
     * Hides Modal.
     *
     * @method hide
     * @since 1.0.0
     * @return {Modal} Returns the current Modal object.
     */
    hide(){
        this.removeClass('skyflow-modal-is-shown');
        this.container.style.display = 'none';
        this.container.style.visibility = 'hidden';
        if (this.config.events.hide) {
            this.config.events.hide.apply(null, [this]);
        }
        return this;
    }

    /**
     * Checks if Modal is shown.
     *
     * @method isShown
     * @since 1.0.0
     * @return {Boolean} Returns true if Modal is shown and false otherwise.
     */
    isShown() {
        return (window.getComputedStyle(this.container, null).getPropertyValue('visibility') !== 'hidden');
    }

    /**
     * Sets HTMLElement to use to trigger Modal.
     *
     * @method trigger
     * @param {HTMLElement|String} element HTMLElement to use.
     * @since 1.0.0
     * @return {Modal} Returns the current Modal object.
     */
    trigger(element){
        if(Helper.isString(element)){
            element = document.querySelector(element);
        }
        if (!Helper.isElement(element)) {
            return this;
        }
        if(this.config.trigger){
            Helper.removeEvent(this.config.trigger, 'click', this.triggerEventCallback);
        }
        this.config.trigger = element;
        Helper.addEvent(element, 'click', this.triggerEventCallback);
        return this;
    }

    /**
     * Removes Modal container from DOM.
     *
     * @method destroy
     * @since 1.0.0
     * @returns {Modal} Returns the current Modal object.
     */
    destroy(){
        if(this.config.trigger){
            Helper.removeEvent(this.config.trigger, 'click', this.triggerEventCallback);
        }
        if(this.container.parentNode){
            this.container.parentNode.removeChild(this.container);
        }
        return this;
    }

}
