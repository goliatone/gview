/*global define:true requirejs:true*/
/* jshint strict: false */
requirejs.config({
    paths: {
        'jquery': 'jquery/jquery',
        'gpub': 'gpub/src/gpub',
        'gview': 'gview'
    }
});

define(['gview', 'jquery', 'gpub'], function (Gview, $, Gpub) {
    console.log('Loading');

    Gpub.observable(Gview);

	var gview = new Gview({
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

	var subview = new Gview({
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
});