## TODO

### Renaming

- Rename `$el`: fragment?
- Rename `el`: [DOM] node?

### Options
We need to have an array with accepted properties from config object, this properties will be set on the View object itself, the rest should go namespaced inside a options/config property.

### Rendering cycle
`show` should take care of rendering as well.
Keep redered state.
Rendering cycle:
- prerender: Detach subviews.
- renderTemplate: template logic.
- afterTemplate: init $ plugins, eg `this.$el.find('.tip').tooltip();`
- potsrender: refresh subviews.

- Async template loading, we can do it on constructor/init method.
- The whole process should be async, sice we might have to load resources. Once those are loaded, next `show` calls should be faster. 
- Implement `loader` display.

Support server side rendered content, we should be able to know if the `el` we are wrapping needs rendering or not.


```javascript
var View = function(){};

View.prototype.listensTo = function(){
    return this.eventList;
};

View.prototype.onSystemEvent = function(event){
    var handler = 'on' + event.type.capitalize();
    if('handler' in this) this[handler].call(this, event);
};

//Abstract method
View.prototype.render = function(){

};

//Provides context for the render method.
View.prototype.context = function(){

};
```

A view is coupled to a template following naming
conventions.
Also, a view has:
- tagName:
- className:
- attributeMap: maps context attributes to 
template properties? do we need this?
- classMap: we can map classes to either properties
or functions, which we call before rendering.

A View wraps a component (template).
A View's component can have actions. An action is the
mapping of a primitive event- click mouseover- to a
command sendForm.
///
in general, you should think of component actions as 
translating a primitive event (like a mouse click or an <audio> element's 
pause event) into actions that have semantic meaning in your application.

This allows your routes and controllers to implement action handlers 
with names like deleteTodo or songDidPause instead of vague names like
click or pause that may be ambiguous to other developers when read 
out of context.

Another way to think of component actions is as the public API of 
your component. Thinking about which events in your component can 
trigger actions in their application is the primary way other 
developers will use your component.

View should have a two phase rendering cycle.
Invalidate - reads
Draw - render
Use lib like:
https://github.com/wilsonpage/fastdom/

WIDGETS
///https://github.com/tkambler/gizmo


MODELS:
- Object get/set pubsub
- Collection: Set of objects.
- Sync: Service layer to connect with server, REST, WebSockets, LocalStore
- Persist: Layer that handles state of model.
- Query: How do we find items?
