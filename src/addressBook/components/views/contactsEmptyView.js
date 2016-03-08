App.module('Views', function(Views, App, Backbone, Mn, $, _){
    'use strict';

    /**
     * Contacts empty view
     * */
    Views.ContactsEmptyView = Mn.ItemView.extend({
        template: window.JST['addressBook/templates/contacts-empty.html'],

        onRender: function() {
            this.$el.hide();
            this.$el.fadeIn('fast');
        },

        onBeforeDestroy: function() {
            this.$el.fadeOut('fast');
        }
    });
});