import Helper from './Helper';

/**
 * Skyflow Select - Select object with a search field.
 *
 * @class Select
 * @constructor
 * @author Skyflow
 * @version 1.0.0
 * @requires Helper
 */
export default class Select {

    /**
     * Constructor.
     *
     * @method constructor
     * @param {Object|Array|HTMLSelectElement} data Data for select object. If HTMLSelectElement is given, the container will be automatically created.
     * @param {String|Element} container Container of select object. Must be an element from the DOM.
     * @param {Object} config
     * @since 1.0.0
     * @returns {Select} Returns an instance of Select object.
     */
    constructor(data, container, config) {

        if (!Helper.isObject(config)) {
            config = {};
        }

        /**
         * Default configuration array.
         *
         * @property config
         * @type Object
         * @default
         *      {
         *          search: true,
         *          multiple: false,
         *          events: {
         *              show: null, // Function
         *              hide: null, // Function
         *              select: null, // Function
         *              unselect: null, // Function
         *              search: null, // Function
         *          },
         *          selectElement: null, // Element
         *          itemElement: null, // Element
         *      }
         *
         * @since 1.0.0
         */
        this.config = {
            search: true,
            multiple: false,
            events: {
                show: null,
                hide: null,
                select: null,
                unselect: null,
                search: null,
            },
            selectElement: null,
            itemElement: null,
        };
        if (Helper.isObject(config)) {
            this.config = Object.assign({}, this.config, config);
        }

        /**
         * Original select element.
         *
         * @property HTMLSelectElement
         * @type HTMLSelectElement|null
         * @since 1.0.0
         */
        this.HTMLSelectElement = null;

        /**
         * Container of select object. Must be an element from the DOM.
         *
         * @property container
         * @type String|Element
         * @since 1.0.0
         */
        this.container = null;

        if (Helper.isString(container)) {
            this.container = document.querySelector(container);
        }

        if (Helper.isElement(container)) {
            this.container = container;
        }

        if (Helper.isElement(data) && data.tagName.toLowerCase() === 'select') {

            this.HTMLSelectElement = data;

            this.config.multiple = data.hasAttribute('multiple');

            // Create and add container
            if (!this.container) {
                this.container = document.createElement('div');
                let parent = data.parentNode, next = data.nextElementSibling;
                next ? parent.insertBefore(this.container, next) : parent.appendChild(this.container);
            }

            data = Helper.convertToArray(data.options);

        }

        /**
         * Data for select object.
         *
         * @property data
         * @type Object|Array
         * @since 1.0.0
         * @example
         *      const select = new Select();
         *      select.data = {
         *          'key1': 'value1',
         *          'key2': 'value2'
         *      }
         */
        this.data = data;

        /**
         * Data keys for select object.
         *
         * @property keys
         * @type Array
         * @since 1.0.0
         */
        this.keys = Object.keys(data);

        /**
         * Data values for select object.
         *
         * @property values
         * @type Array
         * @since 1.0.0
         */
        this.values = Object.values(data);

        /**
         * Search element.
         *
         * @property searchElement
         * @type Element
         * @default HTMLInputElement
         * @since 1.0.0
         */
        this.searchElement = document.createElement('input');
        this.searchElement.style.display = 'none';
        this.searchElement.classList.add('skyflow-select-search');

        /**
         * Select element container.
         *
         * @property contentElement
         * @type HTMLDivElement
         * @since 1.0.0
         */
        this.contentElement = null;

        /**
         * Select element.
         *
         * @property selectElement
         * @type Element
         * @default HTMLUlElement
         * @since 1.0.0
         */
        this.selectElement = Helper.isElement(this.config.selectElement) ? this.config.selectElement : document.createElement('ul');
        this.selectElement.classList.add('skyflow-select-items-container');

        /**
         * Item element.
         *
         * @property itemElement
         * @type Element
         * @default HTMLLiElement
         * @since 1.0.0
         */
        this.itemElement = Helper.isElement(this.config.itemElement) ? this.config.itemElement : document.createElement('li');
        this.itemElement.classList.add('skyflow-select-item');

        /**
         * List of items.
         *
         * @property items
         * @type Element[]
         * @since 1.0.0
         */
        this.items = [];

        /**
         * Selected element. Stores selected elements.
         *
         * @property selected
         * @type Element|Element[]
         * @default false|[]
         * @since 1.0.0
         */
        this.selected = this.config.multiple ? [] : false;

        /**
         * Search values.
         *
         * @property searchValues
         * @type Element[]
         * @default false|[]
         * @since 1.0.0
         */
        this.searchValues = [];

        this.searchElement.addEventListener('input', (e) => {
            const value = Helper.slugify(e.target.value.toLowerCase());

            this.searchValues = [];

            this.items.map((item) => {
                if (
                    Helper.slugify(item.dataset.key.toLowerCase()).indexOf(value) > -1
                    || Helper.slugify(item.textContent.toLowerCase()).indexOf(value) > -1
                ) {
                    item.style.display = 'block';
                    this.searchValues.push(item);
                } else {
                    item.style.display = 'none';
                }
            });

            if (Helper.isCallback(this.config.events.search)) {
                this.config.events.search.apply(null, [this]);
            }
        }, false);

        this.reload();

        return this
    }

    /**
     * Enabled or disabled search element.
     *
     * @method search
     * @param {Boolean} search Set true to enable and false to disable.
     * @since 1.0.0
     * @returns {Select} Returns the current Select object.
     */
    search(search = true) {
        this.searchElement.style.display = (search ? 'block' : 'none');
        this.config.search = search;

        return this;
    }

    /**
     * Show select object.
     *
     * @method show
     * @since 1.0.0
     * @returns {Select} Returns the current Select object.
     */
    show() {
        this.contentElement.style.display = 'block';
        this.search(this.config.search);
        if (Helper.isCallback(this.config.events.show)) {
            this.config.events.show.apply(null, [this]);
        }

        return this;
    }

    /**
     * Hide select object.
     *
     * @method hide
     * @since 1.0.0
     * @returns {Select} Returns the current Select object.
     */
    hide() {
        this.contentElement.style.display = 'none';
        this.searchElement.style.display = 'none';
        if (Helper.isCallback(this.config.events.hide)) {
            this.config.events.hide.apply(null, [this]);
        }

        return this;
    }

    /**
     * Set events for select object.
     *
     * @method on
     * @param {String} event Event name.
     * @param {Function} callback Function to trigger.
     * @since 1.0.0
     * @returns {Select} Returns the current Select object.
     */
    on(event, callback) {
        if (Helper.hasProperty(this.config.events, event)) {
            this.config.events[event] = callback;
        }

        return this;
    }

    /**
     * Remove events for select object.
     *
     * @method off
     * @param {String} event Event name.
     * @since 1.0.0
     * @returns {Select} Returns the current Select object.
     */
    off(event) {
        if (Helper.hasProperty(this.config.events, event)) {
            this.config.events[event] = null;
        }

        return this;
    }

    // Todo : comment doc
    reload() {

        this.keys.map((key, index) => {

            const option = this.itemElement.cloneNode(true);
            option.dataset.selected = '0';

            option.addEventListener('click', (e) => {

                const isSelected = Math.abs(parseInt(e.target.dataset.selected, 10) - 1);
                e.target.dataset.selected = isSelected;
                this.searchElement.focus();

                if (this.HTMLSelectElement) {
                    let opt = this.HTMLSelectElement.options[parseInt(e.target.dataset.index, 10)];
                    if (opt) {
                        opt.selected = (isSelected === 1);
                    }
                }

                if (this.config.multiple) {
                    let selectedItems = this.selectElement.querySelectorAll("[data-selected='1']");
                    selectedItems = Helper.convertToArray(selectedItems);
                    this.selected = selectedItems;
                    e.target.classList.toggle('skyflow-select-item-selected');
                } else {
                    if (this.selected) {
                        this.selected.dataset.selected = '0';
                        this.selected.classList.remove('skyflow-select-item-selected');
                    }
                    this.selected = this.selectElement.querySelector("[data-selected='1']") || false;
                    if (this.selected) {
                        this.selected.dataset.selected = '1';
                        this.selected.classList.add('skyflow-select-item-selected');
                    }

                    // Set default selected option
                    if (this.HTMLSelectElement) {
                        let i = this.HTMLSelectElement.selectedIndex;
                        this.selected = this.items[i];
                        this.selected.dataset.selected = '1';
                        this.selected.classList.add('skyflow-select-item-selected');
                    }
                }

                if (isSelected === 1 && Helper.isCallback(this.config.events.select)) {
                    this.config.events.select.apply(null, [this]);
                }

                if (isSelected === 0 && Helper.isCallback(this.config.events.unselect)) {
                    this.config.events.unselect.apply(null, [this]);
                }

            }, false);

            option.dataset.index = index + '';

            option.dataset.key = key;
            let value = this.values[index];

            if (Helper.isElement(value) && value.tagName.toLowerCase() === 'option') {

                if (value.selected || value.hasAttribute('selected')) {

                    if (this.config.multiple) {

                        option.dataset.selected = '1';
                        option.classList.add('skyflow-select-item-selected');
                        this.selected.push(option);

                    } else {

                        if (this.selected) {

                            this.selected.dataset.selected = '0';
                            this.selected.classList.remove('skyflow-select-item-selected');

                        }

                        option.dataset.selected = '1';
                        option.classList.add('skyflow-select-item-selected');
                        this.selected = option;

                    }
                }

                option.dataset.key = value.value;
                value = value.innerHTML;

            }

            option.innerHTML = value;
            this.selectElement.appendChild(option);
            this.items.push(option);

            return key;

        });

        // Set select container classes and append search and content elements
        if (Helper.isElement(this.container)) {
            this.container.classList.add('skyflow-select-container');
            if (this.config.multiple) {
                this.container.classList.add('skyflow-select-multiple');
            }
            this.container.appendChild(this.searchElement);

            this.contentElement = document.createElement('div');
            this.contentElement.classList.add('skyflow-select-content');
            this.contentElement.appendChild(this.selectElement);
            this.contentElement.style.display = 'none';

            this.container.appendChild(this.contentElement);
        }

        return this;
    }

    /**
     * Select or unselect item.
     *
     * @method toggleByIndex
     * @param {int} index Index of item.
     * @since 1.0.0
     * @returns {Select} Returns the current Select object.
     */
    toggleByIndex(index) {
        let item = this.items[index];
        if (item) {
            item.click();
        }

        return this;
    }

}
