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
