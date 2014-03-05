/*global define:true requirejs:true*/
/* jshint strict: false */
requirejs.config({
    paths: {
        'jquery': 'jquery/jquery',
        'gview': 'gview'
    }
});

define(['gview', 'jquery'], function (Gview, $) {
    console.log('Loading');
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
		render:function(){
			console.log(this);
			this.el.innerHTML = 'hola';
			return this;
		}

	}).render();

	var profile = new Gview({
		el:$('.profile'),
		events:{
			'click':function(){
				console.log('click')
			}
		},
		render:function(){
			this.el.innerHTML = '<p>This should be rendered as it is</p>';
		}
	}).render();
	
	$('aside').append(gview.el);
	window.view = gview;
});