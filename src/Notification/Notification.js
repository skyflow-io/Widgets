import './notification.scss';
import Helper from '../Helper.js';
import Widget from '../Widget/Widget.js';
import WidgetPart from '../WidgetPart/WidgetPart.js';

/**
 * Display a dialog box/popup on top of the current page.
 *
 * @class Notification
 * @constructor
 * @author Skyflow
 * @version 1.0.0
 * @requires Helper
 * @example
 *      let notification = new Notification();
 *      notification.showDuration(8000);
 *      notification.success('Message body', 'Message header');
 *      notification.on('success', (context) => {
 *          console.log(context);
 *          console.log('success');
 *      });
 */
export default class Notification extends Widget{

    constructor() {
        super();

        /**
         * Notification container element.
         *
         * @property container
         * @type {HTMLElement}
         * @since 1.0.0
         * @default HTMLDivElement
         */
        this.container = document.createElement('div');
        this.addClass('skyflow-notification-container');
        Helper.addEvent(this.container, 'mouseover', ()=>{
            clearTimeout(this.setTimeoutId);
        });
        Helper.addEvent(this.container, 'mouseout', ()=>{
            this.autoHide(this.config.autoHide);
        });
        document.body.appendChild(this.container);

        /**
         * Notification close button part.
         *
         * @property CloseButton
         * @type {WidgetPart}
         * @since 1.0.0
         */
        this.CloseButton = new WidgetPart(document.createElement('span'));
        this.CloseButton.show().addClass('skyflow-notification-close-button');
        this.CloseButton.addEvent('click', ()=>{
            this.hide();
        });
        this.container.appendChild(this.CloseButton.this);

        /**
         * Notification header part.
         *
         * @property Header
         * @type {WidgetPart}
         * @since 1.0.0
         */
        this.Header = new WidgetPart(document.createElement('div'));
        this.Header.show().addClass('skyflow-notification-header');
        this.container.appendChild(this.Header.this);

        /**
         * Notification body part.
         *
         * @property Body
         * @type {WidgetPart}
         * @since 1.0.0
         */
        this.Body = new WidgetPart(document.createElement('div'));
        this.Body.show().addClass('skyflow-notification-body');
        this.container.appendChild(this.Body.this);

        /**
         * Notification configuration array.
         *
         * @property config
         * @type {Object}
         * @since 1.0.0
         */
        this.config = {
            /**
             * Set if notification must be auto hide.
             *
             * @property config.autoHide
             * @type {Boolean}
             * @since 1.0.0
             */
            autoHide: true,
            /**
             * Notification show duration time in ms.
             *
             * @property config.showDuration
             * @type {Number}
             * @since 1.0.0
             */
            showDuration: 5000,
            /**
             * Notification events array.
             *
             * @property config.events
             * @type {Object}
             * @since 1.0.0
             */
            events: {
                /**
                 * Notification show event.
                 *
                 * @property config.events.show
                 * @type {Function}
                 * @since 1.0.0
                 * @default null
                 */
                show: null,
                /**
                 * Notification hide event.
                 *
                 * @property config.events.hide
                 * @type {Function}
                 * @since 1.0.0
                 * @default null
                 */
                hide: null,
                /**
                 * Notification success event.
                 *
                 * @property config.events.success
                 * @type {Function}
                 * @since 1.0.0
                 * @default null
                 */
                success: null,
                /**
                 * Notification warning event.
                 *
                 * @property config.events.warning
                 * @type {Function}
                 * @since 1.0.0
                 * @default null
                 */
                warning: null,
                /**
                 * Notification info event.
                 *
                 * @property config.events.info
                 * @type {Function}
                 * @since 1.0.0
                 * @default null
                 */
                info: null,
                /**
                 * Notification error event.
                 *
                 * @property config.events.error
                 * @type {Function}
                 * @since 1.0.0
                 * @default null
                 */
                error: null,
            },
        };

        this.setTimeoutId = null;
    }

    /**
     * Triggers Notification auto hide feature.
     *
     * @method autoHide
     * @param {Boolean} auto
     * @since 1.0.0
     * @returns {Notification} Returns the current Notification object.
     */
    autoHide(auto){
        this.config.autoHide = auto;
        if(!this.config.autoHide){
            return this;
        }
        clearTimeout(this.setTimeoutId);
        this.setTimeoutId = setTimeout(()=>{
            this.hide();
        }, this.config.showDuration);
        return this;
    }

    /**
     * Sets Notification show duration.
     *
     * @method showDuration
     * @param {Boolean} duration Duration in ms.
     * @since 1.0.0
     * @returns {Notification} Returns the current Notification object.
     */
    showDuration(duration){
        this.config.showDuration = duration;
        return this;
    }

    /**
     * Displays notification message.
     *
     * @method notify
     * @param {String} type Type of notification like 'notify', 'success', 'error', ...
     * @param {HTMLElement|String} header Notification header content.
     * @param {HTMLElement|String} body Notification body content.
     * @since 1.0.0
     * @returns {Notification} Returns the current Notification object.
     */
    notify(type, header, body){
        setTimeout(()=>{
            this.addClass('skyflow-notification-is-shown');
            this.addClass('skyflow-notification-'+type+'-state');
            this.autoHide(this.config.autoHide);
        }, 100);
        if(Helper.isString(header)){
            this.Header.html(header);
        }
        if(Helper.isElement(header)){
            this.Header.addChild(header);
        }
        if(Helper.isString(body)){
            this.Body.html(body);
        }
        if(Helper.isElement(body)){
            this.Body.addChild(body);
        }
        if (this.config.events.show) {
            this.config.events.show.apply(null, [this]);
        }
        if (this.config.events[type]) {
            this.config.events[type].apply(null, [this]);
        }
        return this;
    }

    /**
     * Displays success notification message.
     *
     * @method success
     * @param {HTMLElement|String} body Notification body content.
     * @param {HTMLElement|String} header Notification header content.
     * @since 1.0.0
     * @returns {Notification} Returns the current Notification object.
     */
    success(body, header = 'Success'){
        return this.notify('success', header, body);
    }

    /**
     * Displays warning notification message.
     *
     * @method warning
     * @param {HTMLElement|String} body Notification body content.
     * @param {HTMLElement|String} header Notification header content.
     * @since 1.0.0
     * @returns {Notification} Returns the current Notification object.
     */
    warning(body, header = 'Warning'){
        return this.notify('warning', header, body);
    }

    /**
     * Displays info notification message.
     *
     * @method info
     * @param {HTMLElement|String} body Notification body content.
     * @param {HTMLElement|String} header Notification header content.
     * @since 1.0.0
     * @returns {Notification} Returns the current Notification object.
     */
    info(body, header = 'Info'){
        return this.notify('info', header, body);
    }

    /**
     * Displays error notification message.
     *
     * @method error
     * @param {HTMLElement|String} body Notification body content.
     * @param {HTMLElement|String} header Notification header content.
     * @since 1.0.0
     * @returns {Notification} Returns the current Notification object.
     */
    error(body, header = 'Error'){
        return this.notify('error', header, body);
    }

    /**
     * Hides Notification.
     *
     * @method hide
     * @since 1.0.0
     * @returns {Notification} Returns the current Notification object.
     */
    hide(){
        clearTimeout(this.setTimeoutId);
        this.removeClass('skyflow-notification-is-shown');
        if (this.config.events.hide) {
            this.config.events.hide.apply(null, [this]);
        }
        return this;
    }

}
