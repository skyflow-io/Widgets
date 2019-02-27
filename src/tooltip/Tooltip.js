/**
 * Powerful widget for describing and interacting with your elements.
 *
 * @class Tooltip
 * @constructor
 * @author Skyflow
 * @version 1.0.0
 * @requires Helper
 * @example
 *      let tooltip = new Tooltip('.my-trigger-selector', 'Hello world !');
 *      tooltip.placement('left').position('-6', null).trigger('click');
 */
export default class Tooltip {

    /**
     * Constructor.
     *
     * @method constructor
     * @param {String|HTMLElement} target Tooltip target. Must be an element from the DOM.
     * @param {String|HTMLElement} content Sets Tooltip content.
     * @since 1.0.0
     * @returns {Tooltip} Returns an instance of Tooltip object.
     */
    constructor(target, content = 'Hello Tooltip !') {

        if (Helper.isString(target)) {
            target = document.querySelector(target);
        }

        if (!Helper.isElement(target)) {
            console.error(`SkyflowTooltipError: Can not find target '${target}' element from the DOM.`);

            return this;
        }

        /**
         * Target element.
         *
         * @property target
         * @type {HTMLElement}
         * @since 1.0.0
         */
        this.target = target;
        let rect = this.target.getBoundingClientRect();
        this.targetHeight = rect.height;
        this.targetWidth = rect.width;
        this.targetX = rect.x;
        this.targetY = rect.y;

        /**
         * Tooltip container element.
         *
         * @property container
         * @type {HTMLElement}
         * @since 1.0.0
         * @default HTMLDivElement
         */
        this.container = document.createElement('div');
        this.container.style.visibility = 'hidden';
        this.container.style.display = 'none';
        this.container.style.position = 'fixed';
        this.container.style.zIndex = '1000';
        this.container.dataset.skyflowPlacement = 'bottom';
        this.container.classList.add('skyflow-tooltip-container');
        document.body.appendChild(this.container);

        /**
         * Tooltip arrow element.
         *
         * @property tooltipArrow
         * @type {HTMLElement}
         * @since 1.0.0
         * @default HTMLSpanElement
         */
        this.tooltipArrow = document.createElement('span');
        this.tooltipArrow.classList.add('skyflow-tooltip-arrow');
        this.container.appendChild(this.tooltipArrow);

        /**
         * Tooltip content element.
         *
         * @property content
         * @type {HTMLElement}
         * @since 1.0.0
         * @default HTMLDivElement
         */
        this.content = document.createElement('div');
        this.content.classList.add('skyflow-tooltip-content');
        this.container.appendChild(this.content);

        /**
         * Tooltip horizontal position value.
         *
         * @property x
         * @type {Number}
         * @since 1.0.0
         */
        this.x = null;

        /**
         * Tooltip horizontal incrementation value.
         *
         * @property incrementX
         * @type {String}
         * @since 1.0.0
         */
        this.incrementX = null;

        /**
         * Tooltip vertical position value.
         *
         * @property x
         * @type {Number}
         * @since 1.0.0
         */
        this.y = null;

        /**
         * Tooltip horizontal incrementation value.
         *
         * @property incrementX
         * @type {String}
         * @since 1.0.0
         */
        this.incrementY = null;

        /**
         * Tooltip configuration array.
         *
         * @property config
         * @type {Object}
         * @since 1.0.0
         */
        this.config = {
            /**
             * Tooltip placement.
             *
             * @property config.placement
             * @type {String}
             * @since 1.0.0
             * @default 'bottom'
             */
            placement: 'bottom',
            /**
             * Tooltip trigger type.
             *
             * @property config.trigger
             * @type {String}
             * @since 1.0.0
             * @default 'hover'
             */
            trigger: 'hover',
            /**
             * Tooltip events array.
             *
             * @property config.events
             * @type {Object}
             * @since 1.0.0
             */
            events: {
                /**
                 * Tooltip show event.
                 *
                 * @property config.events.show
                 * @type {Function}
                 * @since 1.0.0
                 * @default null
                 */
                show: null,
                /**
                 * Tooltip hide event.
                 *
                 * @property config.events.hide
                 * @type {Function}
                 * @since 1.0.0
                 * @default null
                 */
                hide: null,
            },
        };

        /**
         * Tooltip placement callback functions.
         *
         * @property placementsHandler
         * @type {Object}
         * @since 1.0.0
         */
        this.placementsHandler = {
            /**
             * Tooltip bottom placement callback function.
             *
             * @property placementsHandler.bottom
             * @type {Function}
             * @since 1.0.0
             */
            bottom: () => {
                let x = this.targetX;
                let w = this.targetWidth;

                let containerWidth = this.container.getBoundingClientRect().width;

                // Case 1 : container width is greater than target width
                if (containerWidth > w) {
                    x = x - ((containerWidth - w) / 2);
                }

                // Case 2 : target width is greater than container width
                if (w > containerWidth) {
                    x = x + ((w - containerWidth) / 2);
                }

                return {x, y: this.targetY + this.targetHeight};
            },
            /**
             * Tooltip top placement callback function.
             *
             * @property placementsHandler.top
             * @type {Function}
             * @since 1.0.0
             */
            top: () => {
                let x = this.targetX;
                let w = this.targetWidth;

                let containerWidth = this.container.getBoundingClientRect().width;
                let containerHeight = this.container.getBoundingClientRect().height;

                // Case 1 : container width is greater than target width
                if (containerWidth > w) {
                    x = x - ((containerWidth - w) / 2);
                }

                // Case 2 : target width is greater than container width
                if (w > containerWidth) {
                    x = x + ((w - containerWidth) / 2);
                }

                return {x, y: this.targetY - containerHeight};
            },
            /**
             * Tooltip right placement callback function.
             *
             * @property placementsHandler.right
             * @type {Function}
             * @since 1.0.0
             */
            right: () => {
                let y = this.targetY;
                let h = this.targetHeight;

                let containerHeight = this.container.getBoundingClientRect().height;

                // Case 1 : container width is greater than target width
                if (containerHeight > h) {
                    y = y - ((containerHeight - h) / 2);
                }

                // Case 2 : target width is greater than container width
                if (h > containerHeight) {
                    y = y + ((h - containerHeight) / 2);
                }

                return {x: this.targetX + this.targetWidth, y};
            },
            /**
             * Tooltip left placement callback function.
             *
             * @property placementsHandler.left
             * @type {Function}
             * @since 1.0.0
             */
            left: () => {
                let y = this.targetY;
                let h = this.targetHeight;

                let containerWidth = this.container.getBoundingClientRect().width;
                let containerHeight = this.container.getBoundingClientRect().height;

                // Case 1 : container width is greater than target width
                if (containerHeight > h) {
                    y = y - ((containerHeight - h) / 2);
                }

                // Case 2 : target width is greater than container width
                if (h > containerHeight) {
                    y = y + ((h - containerHeight) / 2);
                }

                return {x: this.targetX - containerWidth, y};
            }

        };

        /**
         * Trigger event callback function.
         *
         * @method triggerEventCallback
         * @param {Event} e Current Event object
         * @since 1.0.0
         * @returns {Tooltip} Returns an instance of Tooltip object.
         */
        this.triggerEventCallback = (e) => {

            if (e.type === 'mouseover' || e.type === 'mouseout') {
                let related = e.relatedTarget || e[(e.type === 'mouseout') ? 'toElement' : 'fromElement'] || null;
                if (Helper.isChildOf(related, this.target) || related === this.target) {
                    return false;
                }
            }

            if (e.type === 'mouseover') {
                this.show();
            }

            if (e.type === 'mouseout') {
                this.hide();
            }

            if (e.type === 'click') {
                this.isShown() ? this.hide() : this.show();
            }

        };

        /**
         * Tooltip trigger callback functions.
         *
         * @property triggersHandler
         * @type {Object}
         * @since 1.0.0
         */
        this.triggersHandler = {
            /**
             * Tooltip hover trigger callback function.
             *
             * @property triggersHandler.hover
             * @type {Function}
             * @since 1.0.0
             */
            hover: () => {
                Helper.addEvent(this.target, 'mouseover', this.triggerEventCallback);
                Helper.addEvent(this.target, 'mouseout', this.triggerEventCallback);
            },
            /**
             * Tooltip click trigger callback function.
             *
             * @property triggersHandler.click
             * @type {Function}
             * @since 1.0.0
             */
            click: () => {
                Helper.addEvent(this.target, 'click', this.triggerEventCallback);
            },
            /**
             * Tooltip manual trigger callback function.
             *
             * @property triggersHandler.manual
             * @type {Function}
             * @since 1.0.0
             */
            manual: () => {},
        };

        /**
         * Click out event callback function.
         *
         * @method clickOutEventCallback
         * @param {Event} e Current Event object
         * @since 1.0.0
         * @returns {Tooltip} Returns an instance of Tooltip object.
         */
        this.clickOutEventCallback = (e) => {

            if (Helper.isChildOf(e.target, this.container) || (e.target === this.container)) {
                return this;
            }

            if (Helper.isChildOf(e.target, this.target) || (e.target === this.target)) {
                return this;
            }

            if (!this.isShown()) {
                return this;
            }

            return this.hide();
        };

        /**
         * Click out state.
         *
         * @property isClickOut
         * @type {Boolean}
         * @since 1.0.0
         * @default false
         */
        this.isClickOut = false;

        if (Helper.isString(content)) {
            this.html(content);
        }

        if (Helper.isElement(content)) {
            this.addChild(content);
        }

        this.trigger(this.config.trigger);

        Helper.addEvent(window, 'scroll', ()=>{
            if(this.isShown()){
                this.position(this.incrementX, this.incrementY);
            }
        });

    }

    /**
     * Shows Tooltip.
     *
     * @method show
     * @since 1.0.0
     * @returns {Tooltip} Returns an instance of Tooltip object.
     */
    show() {

        this.container.style.display = 'block';
        this.position(this.incrementX, this.incrementY);
        this.container.classList.add('skyflow-tooltip-is-shown');
        this.container.style.visibility = 'visible';
        // Trigger event
        if (this.config.events.show) {
            this.config.events.show.apply(null, [this]);
        }

        return this;
    }

    /**
     * Sets Tooltip position.
     *
     * @method position
     * @param {String} incrementX Horizontal position incrementation.
     * @param {String} incrementY Vertical position incrementation.
     * @since 1.0.0
     * @returns {Tooltip} Returns an instance of Tooltip object.
     */
    position(incrementX = '+0', incrementY = '+0') {

        this.incrementX = incrementX;
        this.incrementY = incrementY;

        let rect = this.target.getBoundingClientRect();
        this.targetX = rect.x;
        this.targetY = rect.y;

        let {x, y} = this.placementsHandler[this.config.placement]();

        if (Helper.isNumber(incrementX)) {
            x = incrementX;
        }

        if (Helper.isNumber(incrementY)) {
            y = incrementY;
        }

        if (Helper.isString(incrementX)) {
            x = eval(x + incrementX);
        }

        if (Helper.isString(incrementY)) {
            y = eval(y + incrementY);
        }

        this.x = x;
        this.y = y;

        this.container.style.left = this.x + 'px';
        this.container.style.top = this.y + 'px';

        return this;
    }

    /**
     * Hides Tooltip.
     *
     * @method show
     * @since 1.0.0
     * @returns {Tooltip} Returns an instance of Tooltip object.
     */
    hide() {
        this.container.style.display = 'none';
        this.container.style.visibility = 'hidden';
        this.container.classList.remove('skyflow-tooltip-is-shown');
        // Trigger event
        if (this.config.events.hide) {
            this.config.events.hide.apply(null, [this]);
        }

        return this;
    }

    /**
     * Sets how to show and hide Tooltip.
     *
     * @method trigger
     * @param {String} trigger Type of trigger.
     * @since 1.0.0
     * @returns {Tooltip} Returns an instance of Tooltip object.
     */
    trigger(trigger) {

        if (!Helper.hasProperty(this.triggersHandler, trigger)) {
            return this;
        }

        Helper.removeEvent(this.target, 'mouseover', this.triggerEventCallback);
        Helper.removeEvent(this.target, 'mouseout', this.triggerEventCallback);
        Helper.removeEvent(this.target, 'click', this.triggerEventCallback);

        this.config.trigger = trigger;
        this.triggersHandler[trigger]();
        this.clickOut(this.isClickOut);

        return this;
    }

    /**
     * Sets string as Tooltip content.
     *
     * @method text
     * @param {String} text Content of Tooltip.
     * @since 1.0.0
     * @returns {Tooltip} Returns an instance of Tooltip object.
     */
    text(text) {
        this.content.textContent = text;

        return this;
    }

    /**
     * Sets HTML string as Tooltip content.
     *
     * @method html
     * @param {String} html Content of Tooltip.
     * @since 1.0.0
     * @returns {Tooltip} Returns an instance of Tooltip object.
     */
    html(html) {
        this.content.innerHTML = html;

        return this;
    }

    /**
     * Adds child element to Tooltip.
     *
     * @method addChild
     * @param {Element} child Child to add.
     * @since 1.0.0
     * @returns {Tooltip} Returns an instance of Tooltip object.
     */
    addChild(child) {
        this.content.appendChild(child);

        return this;
    }

    /**
     * Sets Tooltip placement.
     *
     * @method placement
     * @param {String} placement Tooltip placement.
     * @since 1.0.0
     * @returns {Tooltip} Returns an instance of Tooltip object.
     */
    placement(placement = 'bottom') {
        if (!Helper.hasProperty(this.placementsHandler, placement)) {
            return this;
        }
        this.config.placement = placement;
        this.container.dataset.skyflowPlacement = placement;
        if (this.isShown()) {
            this.show();
        }

        return this;
    }

    /**
     * Checks if Tooltip is shown.
     *
     * @method isShown
     * @since 1.0.0
     * @returns {Boolean} Returns true if Tooltip is shown and false otherwise.
     */
    isShown() {
        return !(window.getComputedStyle(this.container, null).getPropertyValue("visibility") === 'hidden');
    }

    /**
     * Sets events for Tooltip object.
     *
     * @method on
     * @param {String} event Event name.
     * @param {Function} callback Function to trigger.
     * @since 1.0.0
     * @example
     *      let tooltip = new Tooltip('.my-tooltip-selector');
     *      tooltip.on('show', (context) => {
     *          console.log(context);
     *      })
     * @returns {Tooltip} Returns the current Tooltip object.
     */
    on(event, callback) {
        if (Helper.hasProperty(this.config.events, event)) {
            this.config.events[event] = callback;
        }

        return this;
    }

    /**
     * Removes events for Tooltip object.
     *
     * @method off
     * @param {String} event Event name.
     * @since 1.0.0
     * @returns {Tooltip} Returns the current Tooltip object.
     */
    off(event) {
        if (Helper.hasProperty(this.config.events, event)) {
            this.config.events[event] = null;
        }

        return this;
    }

    /**
     * Sets if Tooltip will close on click outside of the Tooltip and reference element.
     *
     * @method clickOut
     * @param {Boolean} close Set if Tooltip will be close or not.
     * @since 1.0.0
     * @returns {Tooltip} Returns the current Tooltip object.
     */
    clickOut(close = true) {
        
        this.isClickOut = close;
        if (this.config.trigger === 'hover') {
            return this;
        }
        Helper.removeEvent(document, 'mouseup', this.clickOutEventCallback);
        if (this.isClickOut === true) {
            Helper.addEvent(document, 'mouseup', this.clickOutEventCallback);
        }

        return this;
    }

    /**
     * Removes Tooltip element from DOM.
     *
     * @method remove
     * @since 1.0.0
     * @returns {Tooltip} Returns the current Tooltip object.
     */
    remove(){
        this.container.parentNode.removeChild(this.container);

        return this;
    }

    /**
     * Adds class to Tooltip container.
     *
     * @method addClass
     * @param {String} name Class name.
     * @since 1.0.0
     * @returns {Tooltip} Returns an instance of Tooltip object.
     */
    addClass(name){
        this.container.classList.add(name);

        return this;
    }

    /**
     * Removes class from Tooltip container.
     *
     * @method removeClass
     * @param {String} name Class name.
     * @since 1.0.0
     * @returns {Tooltip} Returns an instance of Tooltip object.
     */
    removeClass(name){
        this.container.classList.remove(name);

        return this;
    }

    /**
     * Adds style to Tooltip container.
     *
     * @method addStyle
     * @param {String} name Name of style.
     * @param {String} value Value of style.
     * @since 1.0.0
     * @returns {Tooltip} Returns an instance of Tooltip object.
     */
    addStyle(name, value){
        this.container.style[name] = value;

        return this;
    }

    /**
     * Removes style from Tooltip container.
     *
     * @method removeStyle
     * @param {String} name Name of style.
     * @since 1.0.0
     * @returns {Tooltip} Returns an instance of Tooltip object.
     */
    removeStyle(name){
        this.container.style[name] = null;

        return this;
    }

}
