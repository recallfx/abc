App.module('Views', function(Views, App, Backbone, Mn, $, _){
    'use strict';

    /**
     * Contact item view
     * */
    Views.ContactItemView = Mn.ItemView.extend({
        tagName: 'li',
        className: 'list-group-item',
        template: window.JST['addressBook/templates/contact-item.html'],

        ui : {
            hoverBtn : '.hover-btn'
        },

        events: {
            'click .item-remove' : 'onRemoveClick'
        },

        onRemoveClick: function() {
            if (this.confirmationView) {
                if (this.confirmationView.isDestroyed) {
                    this.confirmationView = null;
                }
            }

            if (!this.confirmationView) {
                this.confirmationView = new Views.ConfirmationView({model: this.model});
                this.confirmationView.render();
                this.confirmationView.$el.hide();
                this.ui.hoverBtn.append(this.confirmationView.$el);
                this.confirmationView.$el.fadeIn();
            }
        },

        onBeforeDestroy: function() {
            this.$el.fadeOut('slow');
        }
    });
});