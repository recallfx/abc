App.module('Views', function(Views, App, Backbone, Mn, $, _){
    'use strict';

    /**
     * Contact not found view
     * */
    Views.ContactNotFoundView = Mn.ItemView.extend({
        template: window.JST['addressBook/templates/contact-notfound.html']
    });
});