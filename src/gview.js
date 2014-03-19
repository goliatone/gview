/*
 * GView
 * https://github.com/goliatone/gview
 * Created with gbase.
 * Copyright (c) 2014 goliatone
 * Licensed under the MIT license.
 */
/* jshint strict: false, plusplus: true */
/*global define: false, require: false, module: false, exports: false */
(function (root, name, deps, factory) {
    'use strict';
    // Node
    if(typeof deps === 'function') {
        factory = deps;
        deps = [];
    }

    if (typeof exports === 'object') {
        module.exports = factory.apply(root, deps.map(require));
    } else if (typeof define === 'function' && 'amd' in define) {
        //require js, here we assume the file is named as the lower
        //case module name.
        define(name.toLowerCase(), deps, factory);
    } else {
        // Browser
        var d, i = 0, global = root, old = global[name], mod;
        while((d = deps[i]) !== undefined) deps[i++] = root[d];
        global[name] = mod = factory.apply(global, deps);
        //Export no 'conflict module', aliases the module.
        mod.noConflict = function(){
            global[name] = old;
            return mod;
        };
    }
}(this, 'GView', ['jquery'], function($) {

    /**
     * Extend method.
     * @param  {Object} target Source object
     * @return {Object}        Resulting object from
     *                         merging target to params.
     */
    var _extend = function(target) {
        var i = 1, length = arguments.length, source;
        for ( ; i < length; i++ ) {
            // Only deal with defined values
            if ((source = arguments[i]) != undefined ){
                Object.getOwnPropertyNames(source).forEach(function(k){
                    var d = Object.getOwnPropertyDescriptor(source, k) || {value:source[k]};
                    if (d.get) {
                        target.__defineGetter__(k, d.get);
                        if (d.set) target.__defineSetter__(k, d.set);
                    } else if (target !== d.value) target[k] = d.value;
                });
            }
        }
        return target;
    };

///////////////////////////////////////////////////
// CONSTRUCTOR
///////////////////////////////////////////////////

    var options = {
        tagName:'div',
        DOM:$,
        DOMFactory:function(el){
            return (el instanceof jQuery) ? el : $(el);
        }

    };

    /**
     * GView constructor
     *
     * @param  {object} config Configuration object.
     */
    var GView = function(config){
        this.cid = Math.round(Math.random() * 100000);

        _extend(this, options, config || {});
        this.log(config);
        this.init(config);
    };

///////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////

    GView.prototype.init = function(config){
        console.log('GView: Init!', this);

        //View find cache.
        this._cache = {};

        this._createBaseNode();
        this.log('init');
    };

    /**
     * TODO: WE SHOULD CHECK IF WE ARE REUSING
     * THE VIEW, AND IF WE HAVE AN $el, IF SO
     * DETACH, REMOVE LISTENERS, ETC.
     *
     * @return  {[type]} [description]
     * @private
     */
    GView.prototype._createBaseNode = function(){
        /*
         * We initialized the View with a reference to an element.
         */
        if(this.el) return this.setElement(this.el, 'events' in this);

        /*
         * We are creating a View with no element,
         * will create a new one with $ and tagName.
         */
        var $el = this.DOMFactory('<'+this.tagName+'>');

        this.setElement($el, 'events' in this);
    };

    /**
     * Updates the `View`s element.
     * @param {String|Object} el   DOM element.
     * @param {Boolean} delegate   Should we delegate events.
     * @return {this}
     */
    GView.prototype.setElement = function(el, delegate){

        this.removeEvents();

        this.$el = this.DOMFactory(el);

        var attrs = _extend({}, this.attributes);

        if(this.id) attrs.id = this.id;
        if(this.className) attrs['class'] = this.className;

        this.$el.attr(attrs);

        this.el = this.$el[0];

        if(delegate) this.delegateEvents();

        //Pass through method calls, we make this available
        ['attr', 'appendTo', 'data'].forEach(function(method){
            this[method] = function(){
                return this.$el[method].apply(this.$el, arguments);
            };
        }, this);

        this.forwardEvents();

        return this;
    };

    /**
     * Forward a view's component events as if they
     * were originated by the View. Proxy DOM events.
     * @param  {Array} forward Array of events we want to forward
     * @return {this}
     */
    GView.prototype.forwardEvents = function(forward){
        forward || (forward = this.forward || []);
        var type;
        forward.forEach(function(event){

            type = this.forwardEventBuilder(event);

            this.$el.on(event, (function(){
                var args = Array.prototype.slice.call(arguments);
                args.unshift(type);
                this.emit.apply(this, args);
            }).bind(this));
        }, this);
    };

    GView.prototype.forwardEventBuilder = function(event){
        return 'component.' + event;
    };

    /**
     * `emit` method stub. To be implemented by extending
     * the `View` object or adding a mixin.
     * @return {this}
     */
    GView.prototype.emit = function(){
        //this is a stub method, it should be implemented.
        console.warn('GView:emit, method not implemented');
        return this;
    };

    /**
     * Attaches events to the `View`s underlaying
     * DOM object.
     * `events` is a hash that which keys are in
     * the form of _event_ + space + _selector_.
     * Omitting the _selector_ binds the event to
     * the view's `el` element.
     *
     * _callback_s are either the string name of
     * a function in the view or a function.
     * _callback_s `this` will be bound to the
     * view.
     *
     * *{"event selector": "callback"}*
     *     {
     *       'click .button' : function(e){...}
     *       'click .open' : 'doOpen'
     *     }
     *
     * @param  {Object} events Hash with keys in the
     *                         form event selector and
     *                         handlers as value.
     * @return {this}
     */
    GView.prototype.delegateEvents = function(events){
        events  || (events = this.events);

        if(!events) return this;

        this.removeEvents();

        var type, selector, method, match,
            delegateEventSplitter = /^(\S+)\s*(.*)$/;

        for(var key in events){
            method = events[key];

            if(! (typeof method === 'function')) method = this[method];
            if(! method) continue;

            method.bind(this);

            match = key.match(delegateEventSplitter);
            selector = match[2], type = (match[1] + '.events'+this.cid);

            if(!selector) this.$el.on(type, method);
            else this.$el.on(type, selector, method);
        }

        return this;
    };

    /**
     * Removes all delegated events using an
     * event namespace.
     *
     * @return {this}
     */
    GView.prototype.removeEvents = function(){
        if(! this.$el) return this;

        this.$el.off('.events'+this.cid);

        return this;
    };

    /**
     * Finds `selector` in the `view`s DOM element.
     *
     * @param  {String|Object} selector
     * @return {Object}
     */
    GView.prototype.find = function(selector){
        if( typeof selector === 'string' &&
            selector in this._cache) return this._cache[selector];

        return this._cache[selector] = this.$el.find(selector);
    };

///////////////////////////////////////////////
/// ViewTransition Management
///////////////////////////////////////////////
    GView.prototype.show = function(options){
        this.emit('show.start');
        this.attach();
        this.doShow(options);
        return this;
    };

    GView.prototype.doShow = function(options){
        this.$el.show();
        this.transitionDone('show.done');
    };

    GView.prototype.hide = function(options){
        this.emit('hide.start');
        this.doHide(options);
        return this;
    };

    GView.prototype.doHide = function(options){
        this.$el.hide();
        this.transitionDone('hide.done');
    };

    GView.prototype.transitionDone = function(event){
        this.emit(event);
    };
///////////////////////////////////////////////
    /**
     * Renders template with provided
     * context.
     * @return {String} Rendered template content.
     */
    GView.prototype.template = function(context){
        throw new Error('Template function not defined!');
    };

    /**
     * Returns the context object for
     * the `template` method.
     *
     * Default: `this.model.toJSON()`
     * or an empty object if view has no model.
     *
     * @method context
     * @return {Object} context
     **/
    GView.prototype.context = function() {
        if (this.model) return this.model.toJSON();
        return {};
    };

    GView.prototype.update = function(){

        return this;
    };

    GView.prototype.render = function(){

        return this;
    };

    /**
     * Detaches view from DOM but keeps
     * it in memory and maintains state.
     * It creates a ghost element to
     * be reinserted in the same place.
     * @return {this}
     */
    GView.prototype.detach = function(){
        if(this.detached) return this;

        if(!this.ghost) this.ghost = this.DOMFactory('<span/>');

        this.$el.after(this.ghost);
        this.$el.detach();
        this.detached = true;

        return this;
    };

    /**
     * Attaches a previously detached
     * view to the DOM.
     * @return {this}
     */
    GView.prototype.attach = function(){
        if(!this.detached || !this.ghost) return this;
        this.ghost.replaceWith(this.$el);
        this.detached = false;
        return this;
    };

    /**
     * Discards the view, removing all
     * events and removing the `$el` from
     * DOM.
     * Use `detach` if you want to keep the
     * view around to be used later.
     *
     * @return {this}
     */
    GView.prototype.remove = function(){
        this.removeEvents();
        if(this.ghost) this.ghost.remove();
        this.$el.remove();
        return this;
    };

    // var logger = console;
    // GView.prototype.logger = console;
    GView.prototype.log = function(){
        if('debug' in this && this.debug === false) return;
        var args = Array.prototype.slice.call(arguments);
        args.unshift(this.cid);
        console.log.apply(console, args);
    };


    return GView;
}));