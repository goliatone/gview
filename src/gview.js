/*
 * gview
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
}(this, 'Gview', ['jquery'], function($) {

    /**
     * Extend method.
     * @param  {Object} target Source object
     * @return {Object}        Resulting object from
     *                         meging target to params.
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

    };
    
    /**
     * Gview constructor
     * 
     * @param  {object} config Configuration object.
     */
    var Gview = function(config){
        this.cid = Math.round(Math.random() * 100000);

        _extend(this, options, config || {});

        this.init(config);
    };

///////////////////////////////////////////////////
// PRIVATE METHODS
///////////////////////////////////////////////////

    Gview.prototype.init = function(config){
        console.log('Gview: Init!');

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
    Gview.prototype._createBaseNode = function(){
        /*
         * We initialized the View with a reference to an element.
         */
        if(this.el) return this.setElement(this.el, 'events' in this);

        /*
         * We are creating a View with no element, 
         * will create a new one with $ and tagName.
         */
        var $el = $('<'+this.tagName+'>');
        
        this.setElement($el, 'events' in this);
    };

    Gview.prototype.setElement = function(el, delegate){
        this.$el = (typeof el === 'string') ? $(el) : el;
        
        var attrs = _extend({}, this.attributes);

        if(this.id) attrs.id = this.id;
        if(this.className) attrs['class'] = this.className;
        
        this.$el.attr(attrs);
        
        this.el = this.$el[0];

        if(delegate) this.delegateEvents();

        this.forwardEvents();

        return this;
    };

    /**
     * Forward a view's component events as if they
     * were originated by the View. Proxy DOM events.
     * @param  {Array} forward Array of events we want to forward
     * @return {this}
     */
    Gview.prototype.forwardEvents = function(forward){
        forward || (forward = this.forward || []);

        forward.forEach(function(event){
            this.$el.on(event, function(){
                var args = Array.prototype.slice.call(arguments);
                args.unshift(event);
                this.emit.apply(args);
            });
        }, this);
    };

    Gview.prototype.delegateEvents = function(events){
        events  || (events = this.events);

        if(!events) return this;

        this.removeEvents();

        var type, selector, method, match,
            delegateEventSplitter = /^(\S+)\s*(.*)$/;

        for(var key in events){
            method = events[key];
            
            if(! (typeof method === 'function')) method = this[method];
            if(! method) continue;

            match = key.match(delegateEventSplitter);
            selector = match[2], type = (match[1] + '.events'+this.cid);

            if(!selector) this.$el.on(type, method);
            else this.$el.on(type, selector, method);
        }

        return this;
    };

    Gview.prototype.removeEvents = function(){
        this.$el.off('.events'+this.cid);
    };


    Gview.prototype.find = function(selector){
        if(selector in this._cache) return this._cache[selector];

        return this._cache[selector] = this.$el.find(selector);
    };


    Gview.prototype.update = function(){

        return this;
    };

    Gview.prototype.render = function(){

        return this;
    };

    Gview.prototype.remove = function(){
        this.removeEvents();
        this.$el.remove();
        return this;
    };

    Gview.prototype.log = function(){
        if('debug' in this && this.debug === false) return;
        var args = Array.prototype.slice.call(arguments);
        args.unshift(this.cid);
        console.log.apply(console, args);
    };


    return Gview;
}));