import './advanced-uploader.scss';
import Helper from '../Helper.js';
import Widget from '../Widget/Widget.js';
import WidgetPart from '../WidgetPart/WidgetPart.js';

/**
 * Advanced file uploader.
 *
 * @class AdvancedUploader
 * @constructor
 * @author Skyflow
 * @version 1.0.0
 * @requires Helper
 * @requires WidgetPart
 * @extends Widget
 * @example
 *      let au = new AdvancedUploader('#file');
 *      au.thumbnails({
 *          gif: "<i class='icon-skyflow-advanced-uploader-gif'></i>",
 *          pdf: (context, item, type)=>{
 *              return "<i class='icon-skyflow-advanced-uploader-" + type + "'></i>";
 *          }
 *      });
 *      au.thumbnails({
 *          gif: false,
 *          png: 5000,
 *          csv: true,
 *          doc: true,
 *      });
 *      au.on('error', (context, item)=>{
 *          item.Error.html('my custom error');
 *      });
 */
export default class AdvancedUploader extends Widget{

    /**
     * Constructor.
     *
     * @method constructor
     * @param {HTMLInputElement|String} target AdvancedUploader target. Can be a css selector or HTML Input element with file type.
     * @since 1.0.0
     * @returns {AdvancedUploader} Returns an instance of AdvancedUploader object.
     */
    constructor(target) {
        super();

        if (Helper.isString(target)) {
            target = document.querySelector(target);
        }
        if (!Helper.isElement(target)) {
            console.error(`SkyflowAdvancedUploaderError: Can not find target '${target}' element from the DOM.`);
            return this;
        }
        if (target.tagName !== 'INPUT' || target.type !== 'file') {
            console.error('SkyflowAdvancedUploaderError: Target element must be a HTMLInputElement with file type.');
            return this;
        }

        window.URL = window.URL || window.webkitURL;

        /**
         * AdvancedUploader target element.
         *
         * @property target
         * @type {HTMLInputElement}
         * @since 1.0.0
         */
        this.target = target;

        /**
         * AdvancedUploader items.
         *
         * @property items
         * @type {Object}
         * @since 1.0.0
         */
        this.items = {
            // 898978: {
                // Item: new WidgetPart(document.createElement('li')),
                // Thumbnail: new WidgetPart(document.createElement('span')),
                // Name: new WidgetPart(document.createElement('span')),
                // Action: new WidgetPart(document.createElement('span')),
                // File: Native File
                // EditButton: new WidgetPart(document.createElement('i'))
                // RemoveButton: new WidgetPart(document.createElement('i'))
                // SendButton: new WidgetPart(document.createElement('i'))
            // }
        };

        /**
         * AdvancedUploader container element.
         *
         * @property container
         * @type {HTMLElement}
         * @since 1.0.0
         * @default HTMLDivElement
         */
        this.container = document.createElement('div');
        this.addClass('skyflow-advanced-uploader-container');
        Helper.insertAfter(this.container, this.target);

        /**
         * AdvancedUploader body.
         *
         * @property Body
         * @type {WidgetPart}
         * @since 1.0.0
         */
        this.Body = new WidgetPart(document.createElement('ul'));
        this.Body.addClass('skyflow-advanced-uploader-body');
        this.container.appendChild(this.Body.this);

        /**
         * AdvancedUploader footer.
         *
         * @property Footer
         * @type {WidgetPart}
         * @since 1.0.0
         */
        this.Footer = new WidgetPart(document.createElement('div'));
        this.Footer.addClass('skyflow-advanced-uploader-footer');
        this.container.appendChild(this.Footer.this);

        /**
         * AdvancedUploader select files button.
         *
         * @property SelectButton
         * @type {WidgetPart}
         * @since 1.0.0
         */
        this.SelectButton = new WidgetPart(document.createElement('label'));
        this.SelectButton.addClass('skyflow-advanced-uploader-select-files-button');
        this.Footer.addChild(this.SelectButton.this);

        /**
         * AdvancedUploader select files button label.
         *
         * @property SelectButtonLabel
         * @type {WidgetPart}
         * @since 1.0.0
         */
        this.SelectButtonLabel = new WidgetPart(document.createElement('span'));
        this.SelectButtonLabel.addClass('skyflow-advanced-uploader-select-files-label');
        this.SelectButtonLabel.html('Select files');
        this.SelectButton.addChild(this.SelectButtonLabel.this);
        this.SelectButton.addChild(this.target);

        /**
         * AdvancedUploader send all files button.
         *
         * @property SendAllButton
         * @type {WidgetPart}
         * @since 1.0.0
         */
        this.SendAllButton = new WidgetPart(document.createElement('label'));
        this.SendAllButton.addClass('skyflow-advanced-uploader-select-send-all-button');
        this.SendAllButton.html('Send files');
        this.SendAllButton.hide();
        this.Footer.addChild(this.SendAllButton.this);

        /**
         * AdvancedUploader configuration array.
         *
         * @property config
         * @type {Object}
         * @since 1.0.0
         */
        this.config = {
            /**
             * AdvancedUploader trigger element.
             *
             * @property config.trigger
             * @type {HTMLElement}
             * @since 1.0.0
             * @default null
             */
            trigger: null,
            /**
             * AdvancedUploader multiple state.
             *
             * @property config.multiple
             * @type {Boolean}
             * @since 1.0.0
             */
            multiple: true,
            /**
             * AdvancedUploader actions configuration array.
             *
             * @property config.actions
             * @type {Object}
             * @since 1.0.0
             */
            actions: {
                /**
                 * AdvancedUploader item actions configuration array.
                 *
                 * @property config.actions.item
                 * @type {Object}
                 * @since 1.0.0
                 */
                item: {
                    /**
                     * AdvancedUploader item remove action state.
                     *
                     * @property config.actions.item.remove
                     * @type {Boolean}
                     * @since 1.0.0
                     * @default true
                     */
                    remove: true,
                    /**
                     * AdvancedUploader item edit action state.
                     *
                     * @property config.actions.item.edit
                     * @type {Boolean}
                     * @since 1.0.0
                     * @default true
                     */
                    edit: true,
                    /**
                     * AdvancedUploader item send action state.
                     *
                     * @property config.actions.item.send
                     * @type {Boolean}
                     * @since 1.0.0
                     * @default true
                     */
                    send: true,
                },
                /**
                 * AdvancedUploader global actions configuration array.
                 *
                 * @property config.actions.global
                 * @type {Object}
                 * @since 1.0.0
                 */
                global: {
                    /**
                     * AdvancedUploader select files action state.
                     *
                     * @property config.actions.global.select
                     * @type {Boolean}
                     * @since 1.0.0
                     * @default true
                     */
                    select: true,
                    /**
                     * AdvancedUploader global send action state.
                     *
                     * @property config.actions.global.send
                     * @type {Boolean}
                     * @since 1.0.0
                     * @default true
                     */
                    send: true,
                },
            },
            /**
             * AdvancedUploader events array.
             *
             * @property config.events
             * @type {Object}
             * @since 1.0.0
             */
            events: {
                /**
                 * AdvancedUploader error event.
                 *
                 * @property config.events.error
                 * @type {Function}
                 * @since 1.0.0
                 * @default null
                 */
                error: null
            },
            /**
             * AdvancedUploader thumbnails configuration array:
             * - Set true for preview image.
             * - Set string for html content.
             * - Set HTMlElement for appending child.
             * - Set function for custom value.
             *
             * @property config.thumbnails
             * @type {Object}
             * @since 1.0.0
             */
            thumbnails: {
                png: true,
                jpg: true,
                jpeg: true,
                gif: true,
                gitignore: "<i class='icon-skyflow-advanced-uploader-git'></i>",
                htm: "<i class='icon-skyflow-advanced-uploader-html'></i>",
                scss: "<i class='icon-skyflow-advanced-uploader-sass'></i>",
            },
            /**
             * AdvancedUploader allowed type configuration array.
             *
             * @property config.allowedTypes
             * @type {Object}
             * @since 1.0.0
             * @default
             *      {
             *          png: true,
             *          jpg: true,
             *          jpeg: true,
             *          gif: true,
             *          pdf: true,
             *      }
             */
            allowedTypes: {
                png: true,
                jpg: true,
                jpeg: true,
                gif: true,
                pdf: true,
            },
        };

        this.config.multiple = this.target.hasAttribute('multiple');

        this.triggerEventCallback = this.triggerEventCallback.bind(this);
        this.editItemEventCallback = this.editItemEventCallback.bind(this);
        this.validEditionItemEventCallback = this.validEditionItemEventCallback.bind(this);
        this.removeItemEventCallback = this.removeItemEventCallback.bind(this);
        this.sendFileEventCallback = this.sendFileEventCallback.bind(this);
        this.selectFilesEventCallback = this.selectFilesEventCallback.bind(this);
        Helper.addEvent(this.target, 'change', this.selectFilesEventCallback);

        this.update();
    }

    /**
     * Trigger event callback function.
     *
     * @method triggerEventCallback
     * @since 1.0.0
     * @returns {AdvancedUploader} Returns the current AdvancedUploader object.
     */
    triggerEventCallback() {
        this.target.click();
        return this;
    };

    /**
     * Callback to use for validation of item name editing.
     *
     * @method validEditionItemEventCallback
     * @param {Event} e Current Event object
     * @since 1.0.0
     * @returns {AdvancedUploader} Returns the current AdvancedUploader object.
     */
    validEditionItemEventCallback(e){
        if(e.type === 'keyup' && e.keyCode !== 13){
            return this;
        }
        let id = e.target.dataset.id;
        if(!id){
            return this;
        }
        this.items[id].EditButton.this.style.display = 'inline-block';
        let NameLabel = this.items[id].NameLabel;
        let NameEdit = this.items[id].NameEdit;
        NameLabel.html(NameEdit.this.value || NameLabel.this.innerHTML);
        NameEdit.hide();
        NameLabel.show();
        return this;
    }

    /**
     * Callback to use for editing item name.
     *
     * @method editItemEventCallback
     * @param {Event} e Current Event object
     * @since 1.0.0
     * @returns {AdvancedUploader} Returns the current AdvancedUploader object.
     */
    editItemEventCallback(e){
        let id = e.target.dataset.id;
        let item = this.items[id];
        return item ? this.editItem(item.Item) : this;
    }

    /**
     * Callback to use for deleting an item.
     *
     * @method removeItemEventCallback
     * @param {Event} e Current Event object
     * @since 1.0.0
     * @returns {AdvancedUploader} Returns the current AdvancedUploader object.
     */
    removeItemEventCallback(e){
        let id = e.target.dataset.id;
        let item = this.items[id];
        return item ? this.removeItem(item.Item) : null;
    }

    sendFileEventCallback(e){

    }

    selectFilesEventCallback(){

        this.Body.html('');

        let validFiles = [];

        let files = this.target.files;

        for(let k=0; k < files.length; k++){

            let type = files[k].name.split('.').pop().toLowerCase();
            if(!Helper.hasProperty(this.config.allowedTypes, type)){
                continue;
            }
            if(Helper.hasProperty(this.config.allowedTypes, type) && this.config.allowedTypes[type] === false){
                continue;
            }

            let id = Helper.generateUniqueId() + '';
            let item = {
                Item: new WidgetPart(document.createElement('li')),
                Thumbnail: new WidgetPart(document.createElement('span')),
                Name: new WidgetPart(document.createElement('span')),
                NameLabel: new WidgetPart(document.createElement('span')),
                NameEdit: new WidgetPart(document.createElement('input')),
                Action: new WidgetPart(document.createElement('span')),
                File: files[k]
            };
            item.Item.addClass('skyflow-advanced-uploader-item');
            item.Item.this.id = 'item-' + id;

            item.Thumbnail.addClass('skyflow-advanced-uploader-thumbnail');
            if(Helper.hasProperty(this.config.thumbnails, type)){
                let thumbnail = this.config.thumbnails[type];
                if(Helper.isFunction(thumbnail)){
                    thumbnail = thumbnail(this, item, type);
                }
                if(Helper.isBoolean(thumbnail) && thumbnail){
                    let img = document.createElement("img");
                    img.src = window.URL.createObjectURL(item.File);
                    img.onload = (e) =>{
                        window.URL.revokeObjectURL(e.target.src);
                    };
                    item.Thumbnail.html('').addChild(img);
                }
                if(Helper.isString(thumbnail)){
                    item.Thumbnail.html(thumbnail);
                }
                if(Helper.isElement(thumbnail)){
                    item.Thumbnail.html('').addChild(thumbnail);
                }
            }else {
                let i = document.createElement('i');
                i.classList.add('icon-skyflow-advanced-uploader-' + type);
                item.Thumbnail.html('').addChild(i);
            }
            item.Item.addChild(item.Thumbnail.this);

            item.NameLabel.addClass('skyflow-advanced-uploader-file-name-label');
            item.NameLabel.html(item.File.name);

            item.NameEdit.addClass('skyflow-advanced-uploader-file-name-edit');
            item.NameEdit.hide();
            item.NameEdit.this.dataset.id = id;
            item.NameEdit.addEvent('blur', this.validEditionItemEventCallback);
            item.NameEdit.addEvent('keyup', this.validEditionItemEventCallback);

            item.Name.addClass('skyflow-advanced-uploader-file-name');
            item.Name.addChild(item.NameEdit.this);
            item.Name.addChild(item.NameLabel.this);
            item.Item.addChild(item.Name.this);

            item.Action.addClass('skyflow-advanced-uploader-action');
            item.Item.addChild(item.Action.this);

            // Check for errors
            let Error = new WidgetPart(document.createElement('span'));
            Error.addClass('skyflow-advanced-uploader-error-message');
            let typeValue = this.config.allowedTypes[type];
            if(Helper.isNumber(typeValue) && item.File.size > typeValue){
                item.Item.addClass('skyflow-advanced-uploader-item-error');
                Error.html('Error: File size not allowed!');
                item.Name.addChild(Error.this);
                item.Error = Error;
            }

            if(!item.Error){
                validFiles.push(id);
            }else {
                if (this.config.events.error) {
                    this.config.events.error.apply(null, [this, item]);
                }
            }

            // Action edit
            if(!item.Error && this.config.actions.item.edit === true){
                let EditButton = (new WidgetPart(document.createElement('i')))
                    .addClass('icon-skyflow-advanced-uploader-edit')
                    .addClass('skyflow-advanced-uploader-edit-button')
                    .addEvent('click', this.editItemEventCallback);
                EditButton.this.dataset.id = id;
                item.EditButton = EditButton;
                item.Action.addChild(EditButton.this);
            }

            // Action remove
            if(this.config.actions.item.remove === true){
                let RemoveButton = (new WidgetPart(document.createElement('i')))
                    .addClass('icon-skyflow-advanced-uploader-delete')
                    .addClass('skyflow-advanced-uploader-delete-button')
                    .addEvent('click', this.removeItemEventCallback);
                RemoveButton.this.dataset.id = id;
                item.RemoveButton = RemoveButton;
                item.Action.addChild(RemoveButton.this);
            }

            // Action send
            if(!item.Error && this.config.actions.item.send === true){
                let SendButton = (new WidgetPart(document.createElement('i')))
                    .addClass('icon-skyflow-advanced-uploader-upload')
                    .addClass('skyflow-advanced-uploader-upload-button')
                    .addEvent('click', this.sendFileEventCallback);
                SendButton.this.dataset.id = id;
                item.SendButton = SendButton;
                item.Action.addChild(SendButton.this);
            }

            this.Body.addChild(item.Item.this);
            this.items[id] = item;

        }

        if(validFiles[0] && this.config.actions.global.send === true){
            this.SendAllButton.this.style.display = 'inline-block';
        }

    }

    /**
     * Gets AdvancedUploader item using its id.
     *
     * @method getItemById
     * @param {String} id Id of item.
     * @since 1.0.0
     * @returns {WidgetPart|null} Returns WidgetPart of item.
     */
    getItemById(id) {
        try {
            return this.items[id].Item;
        }catch (e) {
            return null;
        }
    }

    /**
     * Gets AdvancedUploader item using its index.
     *
     * @method getItemByIndex
     * @param {Number} index Index of item.
     * @since 1.0.0
     * @returns {WidgetPart|null} Returns WidgetPart of item.
     */
    getItemByIndex(index) {
        let item = this.Body.this.querySelectorAll('.skyflow-advanced-uploader-item')[index];
        try {
            let id = item.id.replace('item-', '');
            return this.getItemById(id);
        }catch (e) {
            return null;
        }
    }

    /**
     * Gets AdvancedUploader item id.
     *
     * @method getItemId
     * @param {WidgetPart} item Use getItemByIndex method to get an item.
     * @since 1.0.0
     * @returns {String|null} Returns item id or null if id not found.
     */
    getItemId(item){
        try {
            return item.this.id.replace('item-', '');
        }catch (e) {
            return null;
        }
    }

    /**
     * Removes item from AdvancedUploader object.
     *
     * @method removeItem
     * @param {WidgetPart} item Use getItemByIndex method to get an item.
     * @since 1.0.0
     * @returns {AdvancedUploader} Returns the current AdvancedUploader object.
     */
    removeItem(item){
        let id = this.getItemId(item);
        if(!id){
            return this;
        }
        item.remove();
        delete this.items[id];
        return this;
    }

    /**
     * Edits AdvancedUploader item name.
     *
     * @method editItem
     * @param {WidgetPart} item Use getItemByIndex method to get an item.
     * @since 1.0.0
     * @returns {AdvancedUploader} Returns the current AdvancedUploader object.
     */
    editItem(item){
        let id = this.getItemId(item);
        if(!id){
            return this;
        }
        this.items[id].EditButton.hide();
        let NameLabel = this.items[id].NameLabel;
        let NameEdit = this.items[id].NameEdit;
        NameEdit.this.value = NameLabel.this.innerHTML;
        NameEdit.this.placeholder = NameLabel.this.innerHTML;
        NameEdit.show();
        NameEdit.this.focus();
        NameLabel.hide();
        return this;
    }

    /**
     * Sets if AdvancedUploader will have multiple files.
     *
     * @method multiple
     * @param {Boolean} multiple If true, AdvancedUploader will have multiple files.
     * @since 1.0.0
     * @returns {AdvancedUploader} Returns the current AdvancedUploader object.
     */
    multiple(multiple = true) {
        this.config.multiple = multiple;
        if(this.config.multiple === true){
            this.target.setAttribute('multiple', 'multiple');
        }
        if(this.config.multiple === false){
            this.target.removeAttribute('multiple');
        }
        return this;
    }

    /**
     * Sets AdvancedUploader item actions.
     *
     * @method itemActions
     * @param {Object} actions Define multiple actions. See config.actions.item array configuration.
     * @example
     *      let au = new AdvancedUploader('#file');
     *      au.itemActions({edit: false});
     * @since 1.0.0
     * @returns {AdvancedUploader} Returns the current AdvancedUploader object.
     */
    itemActions(actions){
        let itemActions = this.config.actions.item;
        this.config.actions.item = Object.assign({}, itemActions, actions);
        return this;
    }

    /**
     * Sets AdvancedUploader global actions.
     *
     * @method globalActions
     * @param {Object} actions Define multiple actions. See config.actions.global array configuration.
     * @example
     *      let au = new AdvancedUploader('#file');
     *      au.globalActions({send: false});
     * @since 1.0.0
     * @returns {AdvancedUploader} Returns the current AdvancedUploader object.
     */
    globalActions(actions){
        let globalActions = this.config.actions.global;
        this.config.actions.global = Object.assign({}, globalActions, actions);
        if(this.config.actions.global.select === true){
            this.SelectButton.this.style.display = 'inline-block';
        }
        if(this.config.actions.global.select === false){
            this.SelectButton.hide();
        }
        return this;
    }

    /**
     * Sets HTMLElement to use to trigger AdvancedUploader.
     *
     * @method trigger
     * @param {HTMLElement|String} element HTMLElement to use.
     * @since 1.0.0
     * @returns {AdvancedUploader} Returns the current AdvancedUploader object.
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
     * Sets AdvancedUploader item thumbnails by type.
     *
     * @method thumbnails
     * @param {Object} thumbnails Define multiple thumbnails by type.
     * @example
     *      let au = new AdvancedUploader('#file');
     *      au.thumbnails({
     *          gif: "<i class='icon-skyflow-advanced-uploader-gif'></i>",
     *          pdf: (context, item, type)=>{
     *              return "<i class='icon-skyflow-advanced-uploader-" + type + "'></i>";
     *          }
     *      });
     * @since 1.0.0
     * @returns {AdvancedUploader} Returns the current AdvancedUploader object.
     */
    thumbnails(thumbnails){
        this.config.thumbnails = Object.assign({}, this.config.thumbnails, thumbnails);
        return this;
    }

    /**
     * Sets AdvancedUploader allowed types and sets allowed size (in bytes).
     * By default, only images and pdf files are allowed.
     *
     * @method allowedTypes
     * @param {Object} types Define multiple allowed types.
     * @example
     *      let au = new AdvancedUploader('#file');
     *      au.thumbnails({
     *          gif: false,
     *          png: 5000,
     *          csv: true,
     *          doc: true,
     *      });
     * @since 1.0.0
     * @returns {AdvancedUploader} Returns the current AdvancedUploader object.
     */
    allowedTypes(types){
        this.config.allowedTypes = Object.assign({}, this.config.allowedTypes, types);
        return this;
    }

    /**
     * Updates AdvancedUploader state.
     *
     * @method update
     * @since 1.0.0
     * @returns {AdvancedUploader} Returns the current AdvancedUploader object.
     */
    update(){
        this.trigger(this.config.trigger);
        this.multiple(this.config.multiple);
        this.globalActions(this.config.actions.global);
        return this;
    }

}
