App.module('Views', function(Views, App, Backbone, Mn, $, _){
    'use strict';

    /**
     * Confirmation view
     * */
    Views.ConfirmationView = Mn.ItemView.extend({
        template: window.JST['addressBook/templates/confirmation.html'],

        className: 'inline-block',

        events: {
            'click .ctc-confirm' : 'onConfirmClick',
            'click .ctc-dismiss' : 'onDismissClick'
        },

        onConfirmClick: function() {
            this.model.destroy();
        },

        onDismissClick: function() {
            var that = this;
            this.$el.fadeOut('fast', function() {
                that.destroy();
            });
        }
    });
});