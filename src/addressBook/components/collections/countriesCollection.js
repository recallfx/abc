App.module('Collections', function(Collections, App, Backbone){
    'use strict';

    Collections.CountriesCollection = Backbone.Collection.extend({
        model: App.Models.CountryModel,

        url: function() {
            if (App.options.debug) {
                return '/node_modules/country-list/data.json';
            }

            return '/data.json';
        },

        localStorage: new Backbone.LocalStorage('CountriesCollection'),

        initialize: function () {
            this.fetchLocal();
        },

        // fetch from local storage
        fetchLocal: function() {
            App.vent.trigger('countries:fetch:start');

            return this.fetch({
                success: $.proxy(this.onFetchSuccess, this),
                error: $.proxy(this.onFetchError, this)
            });
        },

        // fetch from remote resource
        fetchRemote: function() {
            App.vent.trigger('countries:fetch:start');

            return this.fetch({
                ajaxSync: true,
                success: $.proxy(this.onFetchSuccess, this),
                error: $.proxy(this.onFetchError, this)
            });
        },

        onFetchSuccess: function(collection, response, options) {
            // check if result is from local request
            if (!options.ajaxSync) {
                if (response.length === 0) {
                    this.fetchRemote();
                }
                else {
                    App.vent.trigger('countries:fetch:complete');
                }
            }
            else {
                // it was remote request, persist all to local storage for later
                collection.forEach(function(model){
                    model.save();
                });

                App.vent.trigger('countries:fetch:complete');
            }
        },

        onFetchError: function(collection, response, options) {
            App.vent.trigger('countries:fetch:error');
        }
    });
});