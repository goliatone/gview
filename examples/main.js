/*global define:true requirejs:true*/
/* jshint strict: false */
requirejs.config({
    paths: {
        'jquery': 'jquery/jquery',
        'gpub': 'gpub/src/gpub',
        'gview': 'gview'
    }
});

define(['gview', 'jquery', 'gpub'], function (GView, $, Gpub) {
    console.log('Loading');

    Gpub.observable(GView);

	var gview = new GView({
		id:'gview',
		tagName:'button',
		className:'button',
		peperone:function(){
			console.log('hola');
		},
		events:{
			'click':'peperone'
		},
		doShow:function(){
			this.$el.show('slow', (function(){
				this.transitionDone('show.done');
			}).bind(this));
		},
		render:function(){
			console.log(this);
			this.el.innerHTML = 'hola';
			return this;
		},
		forward:['click']

	}).render().show();

	var subview = new GView({
		el:$('.subview'),
		events:{
			'click':function(){
				console.log('click');
			}
		},
		doShow:function(){
			this.$el.show('slow', (function(){
				this.transitionDone('show.done');
			}).bind(this));
		},
		render:function(){
			this.el.innerHTML = '<p>This should be rendered as it is</p>';
			return this;
		}
	}).render().show();

	$('aside').append(gview.el);

	var forwardClick = gview.forwardEventBuilder('click');
	gview.on(forwardClick, function(){
		console.log('This is a component event forwarded by the view');
	});
	window.view = gview;
	window.subview = subview;


	window.cache = function(selector){
		if(!this.cache) this.cache = {};
		if(this.cache[selector]) return this.cache[selector];
		this.cache[selector] = $(selector);
		return this.cache[selector];
	};

	window.find = function(selector){
		if(!this.cache) this.cache = {};
		if(!this.$el) this.$el = $('.container');
        if(selector in this.cache) return this.cache[selector];

        return this.cache[selector] = this.$el.find(selector);
    };

    window.find._cache = {};
    window.find.$el = $('.container');
    window.GView = GView;
});