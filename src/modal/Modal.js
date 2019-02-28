/**
 * Display a dialog box/popup on top of the current page.
 *
 * @class Modal
 * @constructor
 * @author Skyflow
 * @version 1.0.0
 * @requires Helper
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
export default class Modal {

    constructor() {

        function Part(part) {

            /**
             * Stores part element.
             *
             * @property container
             * @type {HTMLElement}
             * @since 1.0.0
             */
            this.this = part;

            /**
             * Shows Part.
             *
             * @method Part.show
             * @since 1.0.0
             * @returns {Part} Returns the current Part object.
             */
            this.show = ()=>{
                this.this.style.display = 'block';
                return this;
            };

            /**
             * Checks if Part is displayed.
             *
             * @method Part.isActive
             * @since 1.0.0
             * @returns {Boolean} Returns true if Part is displayed and false otherwise.
             */
            this.isActive = ()=>{
                return (window.getComputedStyle(this.this, null).getPropertyValue('display') !== 'none');
            };

            /**
             * Hides Part.
             *
             * @method Part.hide
             * @since 1.0.0
             * @returns {Part} Returns the current Part object.
             */
            this.hide = ()=>{
                this.this.style.display = 'none';
                return this;
            };

            /**
             * Sets string as Part content.
             *
             * @method Part.text
             * @param {String} text Content of Part.
             * @since 1.0.0
             * @returns {Part} Returns an instance of Part object.
             */
            this.text = (text)=>{
                this.this.textContent = text;
                return this;
            };

            /**
             * Sets HTML string as Part content.
             *
             * @method Part.html
             * @param {String} html Content of Part.
             * @since 1.0.0
             * @returns {Part} Returns an instance of Part object.
             */
            this.html = (html)=>{
                this.this.innerHTML = html;
                return this;
            };

            /**
             * Adds child element to Part.
             *
             * @method Part.addChild
             * @param {HTMLElement} child Child to add.
             * @since 1.0.0
             * @returns {Part} Returns an instance of Part object.
             */
            this.addChild = (child)=>{
                this.this.appendChild(child);
                return this;
            };

            /**
             * Adds class to Part.
             *
             * @method Part.addClass
             * @param {String} name Class name.
             * @since 1.0.0
             * @returns {Part} Returns an instance of Part object.
             */
            this.addClass = (name)=>{
                this.this.classList.add(name);
                return this;
            };

            /**
             * Removes class from Part.
             *
             * @method Part.removeClass
             * @param {String} name Class name.
             * @since 1.0.0
             * @returns {Part} Returns an instance of Part object.
             */
            this.removeClass = (name)=>{
                this.this.classList.remove(name);
                return this;
            };

            /**
             * Removes Part element from DOM.
             *
             * @method Part.remove
             * @since 1.0.0
             * @returns {Part} Returns the current Part object.
             */
            this.remove = ()=>{
                this.this.parentNode.removeChild(this.this);
                return this;
            };

            /**
             * Adds event to Part element.
             *
             * @method Part.addEvent
             * @param {String} event Event name.
             * @param {Function} callback Event callback.
             * @since 1.0.0
             * @returns {Part} Returns the current Part object.
             */
            this.addEvent = (event, callback)=>{
                Helper.addEvent(this.this, event, callback);
                return this;
            };

            /**
             * Removes event from Part element.
             *
             * @method Part.removeEvent
             * @param {String} event Event name.
             * @param {Function} callback Event callback.
             * @since 1.0.0
             * @returns {Part} Returns the current Part object.
             */
            this.removeEvent = (event, callback)=>{
                Helper.removeEvent(this.this, event, callback);
                return this;
            };

        }

        /**
         * Modal container element.
         *
         * @property container
         * @type {HTMLElement}
         * @since 1.0.0
         * @default HTMLDivElement
         */
        this.container = document.createElement('div');
        this.container.classList.add('skyflow-modal-overlay');
        this.container.classList.add('skyflow-modal-container');
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
         * @type {Part}
         * @since 1.0.0
         */
        this.CloseButton = new Part(document.createElement('span'));
        this.CloseButton.show().addClass('skyflow-modal-close-button');
        this.CloseButton.addEvent('click', ()=>{
            this.hide();
        });
        this.wrap.appendChild(this.CloseButton.this);

        /**
         * Modal header part.
         *
         * @property Header
         * @type {Part}
         * @since 1.0.0
         */
        this.Header = new Part(document.createElement('div'));
        this.Header.show().addClass('skyflow-modal-header');
        this.wrap.appendChild(this.Header.this);

        /**
         * Modal body part.
         *
         * @property Body
         * @type {Part}
         * @since 1.0.0
         */
        this.Body = new Part(document.createElement('div'));
        this.Body.show().addClass('skyflow-modal-body');
        this.wrap.appendChild(this.Body.this);

        /**
         * Modal footer part.
         *
         * @property Footer
         * @type {Part}
         * @since 1.0.0
         */
        this.Footer = new Part(document.createElement('div'));
        this.Footer.show().addClass('skyflow-modal-footer');
        this.wrap.appendChild(this.Footer.this);

        /**
         * Modal accept button part.
         *
         * @property AcceptButton
         * @type {Part}
         * @since 1.0.0
         */
        this.AcceptButton = new Part(document.createElement('button'));
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
         * @type {Part}
         * @since 1.0.0
         */
        this.CancelButton = new Part(document.createElement('button'));
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
             * @type {String}
             * @since 1.0.0
             * @default 'hover'
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

        /**
         * Trigger event callback function.
         *
         * @method triggerEventCallback
         * @since 1.0.0
         * @returns {Modal} Returns the current Modal object.
         */
        this.triggerEventCallback = () => {
            this.show();
        };

    }

    /**
     * Shows Modal.
     *
     * @method show
     * @since 1.0.0
     * @returns {Modal} Returns the current Modal object.
     */
    show(){
        this.container.classList.add('skyflow-modal-is-shown');
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
     * @returns {Modal} Returns the current Modal object.
     */
    hide(){
        this.container.classList.remove('skyflow-modal-is-shown');
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
     * @returns {Boolean} Returns true if Modal is shown and false otherwise.
     */
    isShown() {
        return (window.getComputedStyle(this.container, null).getPropertyValue('visibility') !== 'hidden');
    }

    /**
     * Sets HTMLElement to use to trigger Modal.
     *
     * @method trigger
     * @param {HTMLElement|String} element Type of trigger.
     * @since 1.0.0
     * @returns {Modal} Returns the current Modal object.
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
     * Sets events for Modal object.
     *
     * @method on
     * @param {String} event Event name.
     * @param {Function} callback Function to trigger.
     * @since 1.0.0
     * @example
     *      let modal = new Modal();
     *      modal.on('show', (context) => {
     *          console.log(context);
     *      })
     * @returns {Modal} Returns the current Modal object.
     */
    on(event, callback) {
        if (Helper.hasProperty(this.config.events, event)) {
            this.config.events[event] = callback;
        }
        return this;
    }

    /**
     * Removes events for Modal object.
     *
     * @method off
     * @param {String} event Event name.
     * @since 1.0.0
     * @returns {Modal} Returns the current Modal object.
     */
    off(event) {
        if (Helper.hasProperty(this.config.events, event)) {
            this.config.events[event] = null;
        }
        return this;
    }

    /**
     * Removes Modal element from DOM.
     *
     * @method remove
     * @since 1.0.0
     * @returns {Modal} Returns the current Modal object.
     */
    remove(){
        this.container.parentNode.removeChild(this.container);
        return this;
    }

    /**
     * Adds class to Modal container.
     *
     * @method addClass
     * @param {String} name Class name.
     * @since 1.0.0
     * @returns {Modal} Returns the current Modal object.
     */
    addClass(name){
        this.container.classList.add(name);
        return this;
    }

    /**
     * Removes class from Modal container.
     *
     * @method removeClass
     * @param {String} name Class name.
     * @since 1.0.0
     * @returns {Modal} Returns the current Modal object.
     */
    removeClass(name){
        this.container.classList.remove(name);
        return this;
    }

    /**
     * Adds style to Modal container.
     *
     * @method addStyle
     * @param {String} name Name of style.
     * @param {String} value Value of style.
     * @since 1.0.0
     * @returns {Modal} Returns Returns the current Modal object.
     */
    addStyle(name, value){
        this.container.style[name] = value;
        return this;
    }

    /**
     * Removes style from Modal container.
     *
     * @method removeStyle
     * @param {String} name Name of style.
     * @since 1.0.0
     * @returns {Modal} Returns Returns the current Modal object.
     */
    removeStyle(name){
        this.container.style[name] = null;
        return this;
    }

}
