/*global define:true, describe:true , it:true , expect:true, 
beforeEach:true, sinon:true, spyOn:true , expect:true */
/* jshint strict: false */
define(['gview', 'jquery'], function(Gview, $) {

    describe('just checking', function() {

        it('Gview should be loaded', function() {
            expect(Gview).toBeTruthy();
            var gview = new Gview();
            expect(gview).toBeTruthy();
        });

        it('Gview should initialize', function() {
            var gview = new Gview();
            var output   = gview.init();
            var expected = 'This is just a stub!';
            expect(output).toEqual(expected);
        });
        
    });

});