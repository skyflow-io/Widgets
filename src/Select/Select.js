import './select.scss';
import Helper from '../Helper.js';
import Widget from '../Widget/Widget.js';
import WidgetPart from '../WidgetPart/WidgetPart.js';

/**
 * Select object with a search field.
 *
 * @class Select
 * @constructor
 * @author Skyflow
 * @version 1.0.0
 * @scripts Helper
 * @requires WidgetPart
 * @extends Widget
 * @example
 *      let select = new Select('#friends');
 *      select.addItem('myValue', 'myLabel');
 *      select.on('unselect', (context)=>{
 *          console.log(context);
 *      });
 *      select.on('search', (context)=>{
 *          console.log(context.searchValues);
 *      });
 *      let item = select.getItemByIndex(5);
 *      select.selectItem(item);
 */
export default class Select extends Widget {

    /**
     * Constructor.
     *
     * @method constructor
     * @param {HTMLSelectElement|String} target Select target. Can be a css selector or HTML Select element.
     * @since 1.0.0
     * @return {Select} Returns an instance of Select object.
     */
    constructor(target) {
        super();

        if (Helper.isString(target)) {
            target = document.querySelector(target);
        }
        if (!Helper.isElement(target)) {
            console.error(`SkyflowSelectError: Can not find target '${target}' element from the DOM.`);
            return this;
        }
        if (target.tagName !== 'SELECT') {
            console.error(`SkyflowSelectError: Target element must be a HTMLSelectElement.`);
            return this;
        }

        /**
         * Select target element.
         *
         * @property target
         * @type {HTMLSelectElement}
         * @since 1.0.0
         */
        this.target = target;

        /**
         * Search value storage. Stores keys of each element.
         *
         * @property target
         * @type {String[]}
         * @since 1.0.0
         */
        this.searchValues = [];

        /**
         * Select target options.
         *
         * @property options
         * @type {Object}
         * @since 1.0.0
         */
        this.options = {};

        /**
         * Select items.
         *
         * @property items
         * @type {Object}
         * @since 1.0.0
         */
        this.items = {
            // '567987': {
            //     'Item': '',
            //     'Mark': '',
            //     'Label': '',
            //     'value': item value
            // }
        };

        /**
         * Select container element.
         *
         * @property container
         * @type {HTMLElement}
         * @since 1.0.0
         * @default HTMLDivElement
         */
        this.container = document.createElement('div');
        this.addClass('skyflow-select-container');
        Helper.insertAfter(this.container, this.target);

        /**
         * Select header widget.
         *
         * @property Header
         * @type {WidgetPart}
         * @since 1.0.0
         */
        this.Header = new WidgetPart(document.createElement('div'));
        this.Header.addClass('skyflow-select-header');
        this.container.appendChild(this.Header.this);
        /**
         * Select search widget.
         *
         * @property Search
         * @type {WidgetPart}
         * @since 1.0.0
         */
        this.Search = new WidgetPart(document.createElement('input'));
        this.Search.addClass('skyflow-select-search');
        this.Search.this.setAttribute('placeholder', 'Search items ...');
        this.Search.addEvent('focus', ()=>{
            this.open();
        });
        this.Search.addEvent('input', (e)=>{
            clearTimeout(this.searchTimeOutId);
            this.searchTimeOutId = setTimeout(()=>{
                const value = e.target.value;
                this.search(value);
            }, 300);
        });
        this.Header.addChild(this.Search.this);
        /**
         * Search wait id.
         *
         * @property searchTimeOutId
         * @type {Number|null}
         * @since 1.0.0
         */
        this.searchTimeOutId = null;

        /**
         * Select body widget.
         *
         * @property Body
         * @type {WidgetPart}
         * @since 1.0.0
         */
        this.Body = new WidgetPart(document.createElement('div'));
        this.Body.addClass('skyflow-select-body');
        this.container.appendChild(this.Body.this);
        /**
         * Select content wrap widget.
         *
         * @property Wrap
         * @type {WidgetPart}
         * @since 1.0.0
         */
        this.Wrap = new WidgetPart(document.createElement('ul'));
        this.Wrap.addClass('skyflow-select-body-wrap');
        this.Body.addChild(this.Wrap.this);

        /**
         * Stores the id/key of selected item.
         *
         * @property selectedItem
         * @type {String}
         * @since 1.0.0
         */
        this.selectedItem = null;

        /**
         * Stores the id/key of last selected item.
         *
         * @property lastSelectedItem
         * @type {String}
         * @since 1.0.0
         */
        this.lastSelectedItem = null;

        /**
         * Stores keys of selected items.
         *
         * @property selectedItems
         * @type {Object}
         * @since 1.0.0
         */
        this.selectedItems = {};

        this.clickOutEventCallback = this.clickOutEventCallback.bind(this);
        this.itemClickEventCallback = this.itemClickEventCallback.bind(this);

        /**
         * Select configuration array.
         *
         * @property config
         * @type {Object}
         * @since 1.0.0
         */
        this.config = {
            /**
             * Select multiple state.
             *
             * @property config.multiple
             * @type {Boolean}
             * @since 1.0.0
             */
            multiple: false,
            /**
             * Select Click out state.
             *
             * @property config.clickOut
             * @type {Boolean}
             * @since 1.0.0
             */
            clickOut: true,
            /**
             * Select events array.
             *
             * @property config.events
             * @type {Object}
             * @since 1.0.0
             */
            events: {
                /**
                 * Select open event.
                 *
                 * @property config.events.open
                 * @type {Function}
                 * @since 1.0.0
                 * @default null
                 */
                open: null,
                /**
                 * Select close event.
                 *
                 * @property config.events.close
                 * @type {Function}
                 * @since 1.0.0
                 * @default null
                 */
                close: null,
                /**
                 * Select search event.
                 *
                 * @property config.events.search
                 * @type {Function}
                 * @since 1.0.0
                 * @default null
                 */
                search: null,
                /**
                 * Select select event.
                 *
                 * @property config.events.select
                 * @type {Function}
                 * @since 1.0.0
                 * @default null
                 */
                select: null,
                /**
                 * Select unselect event.
                 *
                 * @property config.events.unselect
                 * @type {Function}
                 * @since 1.0.0
                 * @default null
                 */
                unselect: null,
            },
        };

        this.update();
    }

    /**
     * Select click out event callback function.
     *
     * @method clickOutEventCallback
     * @param {Event} e Current Event object
     * @since 1.0.0
     * @return {Select} Returns the current Select object.
     */
    clickOutEventCallback(e) {
        if (Helper.isChildOf(e.target, this.container) || (e.target === this.container)) {
            return this;
        }
        if (Helper.isChildOf(e.target, this.target) || (e.target === this.target)) {
            return this;
        }
        if (!this.isOpen()) {
            return this;
        }
        return this.close();
    };

    /**
     * Item click event callback function.
     *
     * @method itemClickEventCallback
     * @param {Event} e Current Event object
     * @since 1.0.0
     * @return {Select} Returns the current Select object.
     */
    itemClickEventCallback(e) {
        let id = e.currentTarget.id.replace('item-', '');
        this.toggleItem(this.items[id] ? this.items[id].Item : null);
        return this;
    }

    /**
     * Adds item to Select object.
     *
     * @method addItem
     * @param {HTMLOptionElement|String} value Item value.
     * @param {String} label Item label.
     * @since 1.0.0
     * @return {Select} Returns the current Select object.
     */
    addItem(value, label) {
        let option = null;
        if (Helper.isElement(value)) {
            option = value;
            value = option.value || null;
            label = option.innerHTML || '';
        }
        if (!option) {
            option = document.createElement('option');
        }
        let id = Helper.generateUniqueId() + '';
        option.id = 'option-' + id;
        option.value = value;
        option.innerHTML = label;
        this.options[id] = option;
        if(option.parentNode !== this.target){
            this.target.appendChild(option);
        }

        let Item = new WidgetPart(document.createElement('li'));
        Item.addClass('skyflow-select-item');
        Item.this.id = 'item-' + id;
        Item.addEvent('click', this.itemClickEventCallback);
        this.items[id] = {'Item': Item};
        // Todo : export value
        this.Wrap.addChild(Item.this);

        // -- value
        this.items[id].value = value;
        // -- mark
        let Mark = new WidgetPart(document.createElement('span'));
        Mark.addClass('skyflow-select-item-mark');
        Mark.this.id = 'item-' + id + '-mark';
        Item.addChild(Mark.this);
        this.items[id].Mark = Mark;
        // -- label
        let Label = new WidgetPart(document.createElement('span'));
        Label.addClass('skyflow-select-item-label');
        Label.this.id = 'item-' + id + '-label';
        Label.this.innerHTML = label;
        Item.addChild(Label.this);
        this.items[id].Label = Label;
        return this;
    }

    /**
     * Removes item from Select object.
     *
     * @method removeItem
     * @param {WidgetPart} item Use getItemByValue or getItemByIndex method to get an item.
     * @since 1.0.0
     * @return {Select} Returns the current Select object.
     */
    removeItem(item) {
        let id = this.getItemId(item);
        if(!id){
            return this;
        }
        // Remove item
        let Item = this.items[id].Item;
        Item.remove();
        delete this.items[id];
        // Remove option
        let option = this.options[id];
        option.parentNode.removeChild(option);
        delete this.options[id];
        return this;
    }

    /**
     * Gets Select item id.
     *
     * @method getItemId
     * @param {WidgetPart} item Use getItemByValue or getItemByIndex method to get an item.
     * @since 1.0.0
     * @return {String|null} Returns item id or null if id not found.
     */
    getItemId(item){
        try {
            return item.this.id.replace('item-', '');
        }catch (e) {
            return null;
        }
    }

    /**
     * Gets Select item using its id.
     *
     * @method getItemById
     * @param {String} id Id of item.
     * @since 1.0.0
     * @return {WidgetPart|null} Returns WidgetPart of item.
     */
    getItemById(id) {
        try {
            return this.items[id].Item;
        }catch (e) {
            return null;
        }
    }

    /**
     * Gets Select item using its value.
     *
     * @method getItemByValue
     * @param {String} value Value of item.
     * @since 1.0.0
     * @return {WidgetPart} Returns WidgetPart of item.
     */
    getItemByValue(value) {
        let item = null;
        let keys = Object.keys(this.items);
        for (let k = 0; k < keys.length; k++) {
            if(this.items[keys[k]].value === value){
                return this.items[keys[k]].Item;
            }
        }
        return item;
    }

    /**
     * Gets Select item using its index.
     *
     * @method getItemByIndex
     * @param {Number} index Index of item.
     * @since 1.0.0
     * @return {WidgetPart} Returns WidgetPart of item.
     */
    getItemByIndex(index) {
        let option = this.target.options[index];
        try {
            let id = option.id.replace('option-', '');
            return this.getItemById(id);
        }catch (e) {
            return null;
        }
    }

    /**
     * Selects item.
     *
     * @method selectItem
     * @param {WidgetPart} item Use getItemByValue or getItemByIndex method to get an item.
     * @since 1.0.0
     * @return {Select} Returns the current Select object.
     */
    selectItem(item) {
        let id = this.getItemId(item);
        if(!id){
            return this;
        }
        if(id === this.selectedItem){
            return this;
        }
        let option = this.options[id];
        let Item = this.items[id] ? this.items[id].Item : null;
        if (!Item || !option) {
            return this;
        }
        if (!this.config.multiple && this.selectedItem === id) {
            return this;
        }
        if(this.items[this.selectedItem] && !this.config.multiple){
            this.options[this.selectedItem].selected = false;
            this.items[this.selectedItem].Item.removeClass('skyflow-select-item-selected');
        }
        option.selected = true;
        Item.addClass('skyflow-select-item-selected');
        this.selectedItem = id;
        if(!this.isOpen()){
            this.Search.this.value = this.getSelectedLabels().join(', ');
        }
        if(this.config.multiple){
            this.selectedItems[id] = true;
        }
        if (this.config.events.select) {
            this.config.events.select.apply(null, [this]);
        }
        return this;
    }

    /**
     * Un-selects item.
     *
     * @method unSelectItem
     * @param {WidgetPart} item Use getItemByValue or getItemByIndex method to get an item.
     * @since 1.0.0
     * @return {Select} Returns the current Select object.
     */
    unSelectItem(item) {
        let id = this.getItemId(item);
        if(!id){
            return this;
        }
        let option = this.options[id];
        let Item = this.items[id] ? this.items[id].Item : null;
        if (!Item || !option) {
            return this;
        }
        if (!this.config.multiple && this.selectedItem === id) {
            return this;
        }
        option.selected = false;
        Item.removeClass('skyflow-select-item-selected');
        this.selectedItem = null;
        this.lastSelectedItem = id;
        if(!this.isOpen()){
            this.Search.this.value = this.getSelectedLabels().join(', ');
        }
        if(this.config.multiple){
            delete this.selectedItems[id];
        }
        if (this.config.events.unselect) {
            this.config.events.unselect.apply(null, [this]);
        }
        return this;
    }

    /**
     * Toggles item selection.
     *
     * @method toggleItem
     * @param {WidgetPart} item Use getItemByValue or getItemByIndex method to get an item.
     * @since 1.0.0
     * @return {Select} Returns the current Select object.
     */
    toggleItem(item) {
        let id = this.getItemId(item);
        if(!id){
            return this;
        }
        let option = this.options[id];
        if (!option) {
            return this;
        }
        this[option.selected ? 'unSelectItem' : 'selectItem'](item);
        return this;
    }

    /**
     * Opens Select.
     *
     * @method open
     * @since 1.0.0
     * @return {Select} Returns the current Select object.
     */
    open() {
        this.Search.this.value = '';
        this.addClass('skyflow-select-is-open');
        let keys = Object.keys(this.items);
        keys.map((key) => {
            this.items[key].Item.removeClass('skyflow-select-item-not-found');
        });
        if (this.config.events.open) {
            this.config.events.open.apply(null, [this]);
        }
        return this;
    }

    /**
     * Closes Select.
     *
     * @method close
     * @since 1.0.0
     * @return {Select} Returns the current Select object.
     */
    close() {
        this.Search.this.value = this.getSelectedLabels().join(', ');
        this.removeClass('skyflow-select-is-open');
        if (this.config.events.close) {
            this.config.events.close.apply(null, [this]);
        }
        return this;
    }

    /**
     * Checks if Select is open.
     *
     * @method isOpen
     * @since 1.0.0
     * @return {Boolean} Returns true if Select is open and false otherwise.
     */
    isOpen() {
        return this.container.classList.contains('skyflow-select-is-open');
    }

    /**
     * Sets if Select will close on click outside of the Select.
     *
     * @method clickOut
     * @param {Boolean} close If true, Select will be close.
     * @since 1.0.0
     * @return {Select} Returns the current Select object.
     */
    clickOut(close = true) {
        this.config.clickOut = close;
        Helper.removeEvent(document, 'mouseup', this.clickOutEventCallback);
        if (this.config.clickOut) {
            Helper.addEvent(document, 'mouseup', this.clickOutEventCallback);
        }
        return this;
    }

    /**
     * Sets if Select will have multiple selection.
     *
     * @method multiple
     * @param {Boolean} multiple If true, Select will have multiple selection.
     * @since 1.0.0
     * @return {Select} Returns the current Select object.
     */
    multiple(multiple = true) {
        this.config.multiple = multiple;
        this.target.removeAttribute('multiple');
        if(multiple){
            this.target.setAttribute('multiple', 'multiple');
        }
        this[multiple ? 'addClass' : 'removeClass']('skyflow-select-multiple-type');
        return this;
    }

    /**
     * Gets selected values.
     *
     * @method getSelected
     * @since 1.0.0
     * @return {String[]} Returns array containing the values.
     */
    getSelected(){
        let result = [];
        let items = null;
        if(this.config.multiple){
            items = Object.keys(this.selectedItems);
        }else {
            items = [this.selectedItem]
        }
        items.map((item)=>{
            result.push(this.items[item].value);
        });
        return result;
    }

    /**
     * Gets selected labels.
     *
     * @method getSelectedLabels
     * @since 1.0.0
     * @return {String[]} Returns array containing the labels.
     */
    getSelectedLabels(){
        let result = [];
        let keys = null;
        if(this.config.multiple){
            keys = Object.keys(this.selectedItems);
        }else {
            keys = [this.selectedItem]
        }
        keys.map((key)=>{
            let label = this.items[key].Item.this.querySelector('#item-' + key + '-label');
            result.push(label.textContent);
        });
        return result;
    }

    /**
     * Updates Select object.
     *
     * @method update
     * @since 1.0.0
     * @return {Select} Returns the current Select object.
     */
    update(){
        this.multiple(this.target.hasAttribute('multiple'));
        let options = Helper.convertToArray(this.target.options);
        options.map((option) => {
            this.addItem(option);
            if(option.selected){
                let id = option.id.replace('option-', '');
                this.selectItem(this.items[id].Item);
            }
        });
        if(!this.config.multiple){
            let id = this.target.options[this.target.selectedIndex].id.replace('option-', '');
            let item = this.items[id];
            this.selectItem(item ? item.Item : null);
        }
        this.clickOut(this.config.clickOut);
        this.Search.this.value = this.getSelectedLabels().join(', ');
        return this;
    }

    /**
     * Search values using value or label.
     *
     * @method search
     * @param {String} value Value or label to search.
     * @since 1.0.0
     * @return {String[]} Returns keys of each element. Found values ​​are stored in the searchValues property
     */
    search(value){
        value = Helper.slugify(value);
        this.searchValues = [];
        let keys = Object.keys(this.items);
        keys.map((key) => {
            let itemValue = this.items[key].value;
            let itemLabel = this.items[key].Label.this.textContent;
            if (
                Helper.slugify(itemValue.toLowerCase()).indexOf(value) > -1
                || Helper.slugify(itemLabel.toLowerCase()).indexOf(value) > -1
            ) {
                this.items[key].Item.removeClass('skyflow-select-item-not-found');
                this.searchValues.push(key);
            } else {
                this.items[key].Item.addClass('skyflow-select-item-not-found');
            }
        });
        if (this.config.events.search) {
            this.config.events.search.apply(null, [this]);
        }
        return this.searchValues;
    }

}
