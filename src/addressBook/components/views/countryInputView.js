App.module('Views', function(Views, App, Backbone, Mn, $, _){
    'use strict';

    Views.CountryInputView = Mn.View.extend({

        defaults: function () {
            return {
                country: null,
                cleared: true
            };
        },

        initialize: function (options) {
            this.options = _.defaults(options, this.defaults());

            this.countries = App.request('list:countries');
        },

        render: function () {
            // set typeahead sources:
            this.$el.typeahead({
                hint: true,
                highlight: true,
                minLength: 0
            },{
                name: 'countries',
                displayKey: 'name',
                source: $.proxy(function(query, done_callback){
                    var items = this.getFilteredCountries(query);
                    done_callback(items);
                }, this)
            });

            this.$el.on('typeahead:selected', $.proxy(this.onTypeaheadSelected, this));
            this.$el.on('typeahead:autocompleted', $.proxy(this.onTypeaheadSelected, this));
            this.$el.on('keyup.tt', $.proxy(this.onTypeaheadKeyUp, this));
        },

        /**
         * Get filtered countries
         * */
        getFilteredCountries: function(filter){
            var result = [];

            if (_.isString(filter)){
                filter = filter.toLowerCase();
            }

            for (var i = 0, n = this.countries.models.length; i < n; i++) {
                var country = this.countries.models[i];

                var name = country.get('name').toLowerCase();

                if(name.indexOf(filter) !== -1){
                    result.push(country.toJSON());

                    if (result.length >= 10){
                        break;
                    }
                }
            }

            return result;
        },

        onTypeaheadSelected: function (event, data) {
            this.processCountry(data);
        },

        onTypeaheadKeyUp: function (event) {
            var value = event.currentTarget.value;

            if (!event.isDefaultPrevented()) {
                if (_.isEmpty(value)) {
                    this.unsetCountry(undefined);
                }
            }
        },

        onClose: function () {
            this.clear();
            //this.$el.typeahead('destroy');

            // remove event listeners
            this.$el.off();
        },

        processCountry: function (data, silent) {
            var country;

            if (!_.isEmpty(data)) {

                if (data instanceof Backbone.Model){
                    country = data.toJSON();
                }
                else {
                    country = data;
                }
            }

            if (country) {
                this.setCountry(country, silent);
            } else {
                // data is empty or invalid
                this.unsetCountry(silent);
            }
        },

        /**
         * Set new or update existing country
         * @param country New country
         * @param silent Silently add location without triggering search:country event
         */
        setCountry: function (country, silent) {
            // if current country is not empty
            if (!_.isEmpty(this.options.country)) {
                // check if we are not adding the same country
                if (country.code == this.options.country.code) {
                    return;
                }
            }

            this.options.cleared = false;
            this.options.country = country;
            this.setInputValue(this.options.country.name);

            if (!silent) {
                this.trigger('search:country', this.options.country.code);
            }

            this.$el.parent().addClass('has-success');
        },

        getCountry: function () {
            if (!_.isEmpty(this.options.country)) {
                return this.options.country;
            }

            return null;
        },

        setCountryByCode: function (code){
            if (code && code !== ''){
                var country = this.countries.get(code);
                this.processCountry(country, true);
            }
            else {
                this.processCountry(false, true);
            }
        },

        /**
         * Unset existing country
         */
        unsetCountry: function (silent) {
            if (!silent) {
                this.trigger('search:country:removed');
            }

            this.$el.parent().removeClass('has-success');

            if (!_.isEmpty(this.options.country)) {
                this.setInputValue('');
                this.options.country = null;
            }
        },

        clear: function () {
            if (!this.options.cleared) {
                this.options.cleared = true;
                this.unsetCountry(undefined);
                this.options.country = null;
            }
        },

        /**
         * Set search input value. This method allows silently set value without creating server requests.
         * */
        setInputValue: function (text) {
            if (_.isFunction(this.$el.typeahead)) {
                this.$el.typeahead('val', text);
                this.$el.typeahead('close');
            }
        }
    });

});