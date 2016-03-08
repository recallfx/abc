App.module('Views', function(Views, App, Backbone, Marionette, $, _){
    'use strict';

    /**
     * Contact edit view
     * */
    Views.ContactEditView = Views.ContactNewView.extend({
        onRender: function() {
            this.ui.lblTitle.text('Edit contact');

            this.inputCountryView = new Views.CountryInputView({ el: this.ui.country });
            this.inputCountryView.render();

            this.inputCountryView.setCountryByCode(this.model.get('countryCode'));

            this.ui.firstName.val(this.model.get('firstName'));
            this.ui.lastName.val(this.model.get('lastName'));
            this.ui.email.val(this.model.get('email'));
        }
    });
});