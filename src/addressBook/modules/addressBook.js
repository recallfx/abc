App.module('AddressBook', function(AddressBook, App, Backbone, Mn, $, _){
    'use strict';
    this.startWithParent = false;

    /**
    * AddressBook Controller
    * */
    //
    AddressBook.AddressBookController = Mn.Controller.extend({
        countries : null,
        contacts : null,

        // show this component in the app
        show: function(){
            Mn.triggerMethod.call(this, 'show');
        },

        initialize: function(){
            this.countries = new App.Collections.CountriesCollection();
            this.contacts = new App.Collections.ContactsCollection();
        },

        getCountries: function() {
            return this.countries;
        },

        getContacts: function() {
            return this.contacts;
        },

        showNewContact: function () {
            this.setNavActive('');

            var newItemView = new App.Views.ContactNewView({
                model: new App.Models.ContactModel(),
                collection: this.contacts
            });

            App.contactFormRegion.show(newItemView);
            App.contactFormRegion.$el.fadeIn();
        },

        showEditContact: function(email) {
            this.setNavActive('');

            var model = this.contacts.get(email);

            var editItemView = new App.Views.ContactEditView({
                model: model
            });

            App.contactFormRegion.show(editItemView);
            App.contactFormRegion.$el.fadeIn();
        },

        showContacts: function(filter) {
            this.setNavActive('');

            var collectionView = new App.Views.ContactCollectionView({
                filter: filter,
                origCollection: this.contacts,
                collection: this.contacts
            });

            App.contactsRegion.show(collectionView);
            App.contactsRegion.$el.fadeIn();
        },

        updateContacts: function() {
            this.contacts.fetchLocal();
        },

        showImportPage: function() {
            this.setNavActive('cog');
            App.importPageRegion.$el.fadeIn();
        },

        showExportPage: function() {
            this.setNavActive('cog');
            App.exportPageRegion.$el.fadeIn();
        },

        showAboutPage: function() {
            this.setNavActive('about');
            App.aboutPageRegion.$el.fadeIn();
        },

        setNavActive: function(route) {
            var current = App.navRegion.$el.find('li.active a[href$="#'+ route +'"]');

            if (current.length === 0) {
                App.navRegion.$el.find('li.active').removeClass('active');
                App.navRegion.$el.find('li a[href$="#'+ route +'"]').parents('li').addClass('active');
            }
        },

        hideAll: function(done) {
            $.when(
                // hide regions
                App.contactsRegion.$el.fadeOut().promise(),
                App.contactFormRegion.$el.fadeOut().promise(),
                App.importPageRegion.$el.fadeOut().promise(),
                App.exportPageRegion.$el.fadeOut().promise(),
                App.aboutPageRegion.$el.fadeOut().promise()
            ).done(function() {
                // empty dynamic regions
                App.contactsRegion.empty();
                App.contactFormRegion.empty();

                // notify: all done
                if (done) {
                    done();
                }
            });
        }
    });

    /**
    * Initializers and Finalizers
    * */
    AddressBook.addInitializer(function(args){
        App.addRegions({
            mainRegion          : 'body',
            navRegion           : 'nav ul.nav',
            addressBookRegion   : '#addressBook',

            contactsRegion      : '#contactsRegion',
            contactFormRegion   : '#contactFormRegion',
            importPageRegion    : '#importPageRegion',
            exportPageRegion    : '#exportPageRegion',
            aboutPageRegion     : '#aboutPageRegion'
        });

        // internal controller
        AddressBook.addressBookController = new AddressBook.AddressBookController();
        AddressBook.addressBookController.show();

        App.reqres.setHandler('list:contacts', function(){
            return AddressBook.addressBookController.getContacts();
        });

        App.reqres.setHandler('list:countries', function(){
            return AddressBook.addressBookController.getCountries();
        });

        App.vent.on('router:item:new', function(){
            AddressBook.addressBookController.hideAll(function() {
                AddressBook.addressBookController.showNewContact();
            });
        });

        App.vent.on('router:item:edit', function(email){
            AddressBook.addressBookController.hideAll(function() {
                AddressBook.addressBookController.showEditContact(email);
            });
        });

        App.vent.on('router:filter', function(filter){
            AddressBook.addressBookController.hideAll(function() {
                AddressBook.addressBookController.showContacts(filter);
            });
        });

        App.vent.on('router:page:import', function(){
            AddressBook.addressBookController.hideAll(function() {
                AddressBook.addressBookController.showImportPage();

                // todo: implement proper JSON validation and error reporting
                $('#ctc-file').change(function(event) {
                    var file = $('#ctc-file')[0].files[0];
                    var reader = new FileReader();
                    reader.onload = receivedText;
                    reader.readAsText(file, 'UTF-8');

                    function receivedText() {
                        var contacts = AddressBook.addressBookController.getContacts();
                        contacts.reset(JSON.parse(reader.result));
                        contacts.invoke('save');

                        Backbone.history.navigate('#', { trigger: true });
                    }
                });
            });
        });

        App.vent.on('router:page:export', function(){
            AddressBook.addressBookController.hideAll(function() {
                AddressBook.addressBookController.showExportPage();

                var contacts = AddressBook.addressBookController.getContacts();
                var dataString = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(contacts.toJSON()));
                $('#ctc-export').attr('href', dataString);
            });
        });

        App.vent.on('router:page:about', function(){
            AddressBook.addressBookController.hideAll(function() {
                AddressBook.addressBookController.showAboutPage();
            });
        });

        // update contacts list when local storage was updated in other tab/window
        $(window).on('storage', function () {
            AddressBook.addressBookController.updateContacts();
        });

        // start router and show view accordingly
        App.routerController = new App.Components.RouterController();
    });

    AddressBook.addFinalizer(function(){
        if (AddressBook.addressBookController){
            AddressBook.addressBookController.hideAll(function () {
                AddressBook.addressBookController.close();
                delete AddressBook.addressBookController;
            });
        }
    });
});