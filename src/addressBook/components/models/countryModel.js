App.module('Models', function(Models, App, Backbone){
    'use strict';

    Models.CountryModel = Backbone.Model.extend({
        idAttribute: 'code',

        defaults: function () {
            return {
                code: '',
                name: ''
            };
        },

        initialize: function () {
        },

        validate: function(attrs, options) {
            var result = [];

            // validate country code
            if (!(attrs.code && _.isString(attrs.code) && attrs.code.length === 2)) {
                result.push({
                    field: 'code',
                    message: 'Country code myst be of ISO 3166-1 alfa-2 format (two letter code)'
                });
            }

            // validate country name
            if (!(attrs.name && _.isString(attrs.name) && attrs.name.length > 0)) {
                result.push({
                    field: 'name',
                    message: 'Country name cannot be empty'
                });
            }

            // return only if we got any errors
            if (result.length > 0){
                return result;
            }
        }
    });
});