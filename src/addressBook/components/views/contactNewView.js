App.module('Views', function(Views, App, Backbone, Mn, $, _){
    'use strict';

    /**
     * Contact new view
     * */
    Views.ContactNewView = Mn.ItemView.extend({
        template: window.JST['addressBook/templates/contact-edit.html'],

        ui: {
            'lblTitle'          : '#ctc-title',
            'firstName'         : '#ctc-first-name',
            'lastName'          : '#ctc-last-name',
            'email'             : '#ctc-email',
            'country'           : '#ctc-country',
            'btnSave'           : '#ctc-save'
        },

        events: {
            'click #ctc-save' : 'onSaveClick',
            'keyup #ctc-email' : 'onEmailKeyUp'
        },

        initialize: function() {
            this.lazyCheckUniqueEmail = _.debounce(this.checkUniqueEmail, 300);
        },

        onRender: function() {
            this.ui.lblTitle.text('New contact');

            this.inputCountryView = new Views.CountryInputView({ el: this.ui.country });
            this.inputCountryView.render();
        },

        onEmailKeyUp: function(e) {
            if (this.collection) {
                var email = e.target.value.toLowerCase();
                this.lazyCheckUniqueEmail(email);
            }
        },

        checkUniqueEmail: function(email) {
            // email must be unique
            var colRes = this.collection.get(email);
            if (colRes && this.model.cid !== colRes.cid) {
                //error, duplicate email
                this.ui.email.parent('.form-group').addClass('has-error');
                this.ui.email.siblings('.help-block').text('Already exists!');
            }
            else {
                this.ui.email.parent('.form-group.has-error').removeClass('has-error');
                this.ui.email.siblings('.help-block').text('');
            }
        },

        onSaveClick: function() {
            this.hideValidationMessages();

            // get attributes
            var attributes = {
                firstName: this.ui.firstName.val(),
                lastName: this.ui.lastName.val(),
                email: this.ui.email.val().toLowerCase()
            };

            // get country lookup
            var country = this.inputCountryView.getCountry();
            if (country) {
                attributes.country = country.name;
                attributes.countryCode = country.code;
            }
            else {
                attributes.country = '';
                attributes.countryCode = '';
            }

            // set model attributes
            this.model.set(attributes);

            // validate
            if (this.model.isValid()) {
                if (this.collection) {
                    this.collection.add(this.model);
                }

                this.model.save(null, {
                    success: function() {
                        Backbone.history.navigate('#', { trigger: true });
                    }
                });
            }
            else {
                this.showValidationMessages();
            }
        },

        hideValidationMessages: function () {
            this.$el.find('.form-group.has-error').removeClass('has-error');
            this.$el.find('.help-block').text('');
        },

        showValidationMessages: function () {
            var ui = this.ui;
            _.each(this.model.validationError, function(errorItem) {
                var uiField = ui[errorItem.field];

                if (uiField) {
                    var $formGroup = uiField.closest('.form-group');
                    $formGroup.addClass('has-error');
                    $formGroup.find('.help-block').text(errorItem.message);
                }
            });
        }
    });
});