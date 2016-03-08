App.module('Collections', function(Collections, App, Backbone, Mn, $, _){
    'use strict';

    Collections.ContactsCollection = Backbone.Collection.extend({
        model: App.Models.ContactModel,

        localStorage : new Backbone.LocalStorage('ContactsCollection'),

        initialize: function () {
            this.sortOrder = 1;
            this.fetchLocal();
        },

        // fetch from local storage
        fetchLocal: function() {
            App.vent.trigger('contacts:fetch:start');

            return this.fetch({
                success: $.proxy(this.onFetchSuccess, this),
                error: $.proxy(this.onFetchError, this)
            });
        },

        onFetchSuccess: function(collection, response, options) {
            App.vent.trigger('contacts:fetch:complete');

            if (App.options.debug && collection.size() < 1) {
                collection.reset([
                    {
                        firstName: 'Jonas',
                        lastName: 'Jonaitis',
                        email: 'jonas@asd.lt',
                        country: 'Lithuania',
                        countryCode: 'LT'
                    },
                    {
                        firstName: 'Captain',
                        lastName: 'America',
                        email: 'captain@us.gov',
                        country: 'United States',
                        countryCode: 'US'
                    },
                    {
                        firstName: 'King',
                        lastName: 'James',
                        email: 'king@asd.co.uk',
                        country: 'Great Britain',
                        countryCode: 'GB'
                    }
                ]);

                collection.invoke('save');
            }
        },

        onFetchError: function(collection, response, options) {
            App.vent.trigger('contacts:fetch:error');
        },

        comparator: function(a, b) {
            return this.sortOrder * a.getFullName().localeCompare(b.getFullName());
        },

        toggleSort:function(){
            this.sortOrder = (-1) * this.sortOrder;
            this.sort();
        },

        getSortOrder: function() {
            return this.sortOrder;
        }
    });
});