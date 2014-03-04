/*global define:true requirejs:true*/
/* jshint strict: false */
requirejs.config({
    paths: {
        'jquery': '../lib/jquery/jquery',
        'gview': '../src/gview'
    }
});

define(['gview', 'jquery'], function (Gview, $) {
    console.log('Loading');
	var gview = new Gview();
	gview.init();
});