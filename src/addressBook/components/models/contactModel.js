App.module('Models', function(Models, App, Backbone){
    'use strict';

    Models.ContactModel = Backbone.Model.extend({
        idAttribute: 'email',

        defaults: function () {
            return {
                firstName: '',
                lastName: '',
                email: '',
                country: '',
                countryCode: ''
            };
        },

        initialize: function () {
        },

        getFullName: function() {
            return this.get('firstName') + ' ' + this.get('lastName');
        },

        validate: function (attrs, options) {
            var result = [];

            // validate first name
            result.push(this._validateName(attrs.firstName, 70, 'firstName'));

            // validate last name
            result.push(this._validateName(attrs.lastName, 70, 'lastName'));

            // validate email
            result.push(this._validateEmailAddress(attrs.email));

            // validate country
            result.push(this._validateName(attrs.country, 70, 'country'));

            // validate countryCode
            result.push(this._validateName(attrs.countryCode, 2, 'countryCode'));


            // flatten array
            result = _.flatten(result);
            // reject empty values
            result = _.reject(result, function(item){ return item.length < 1; });

            // return only if we got any errors
            if (result.length > 0){
                return result;
            }
        },

        _validateEmailAddress: function (email) {
            var result = [];

            if (email && _.isString(email)) {
                var splitEmail = email.split('@');

                if (splitEmail.length === 2) {
                    result.push(this._validateEmailAddressName(splitEmail[0]));
                    result.push(this._validateEmailAddressDomain(splitEmail[1]));
                }
                else {
                    // missing @
                    result.push({
                        field: 'email',
                        message: 'Missing \'@\' sign.'
                    });
                }
            }
            else {
                // missing name
                result.push({
                    field: 'email',
                    message: 'Required field'
                });
            }

            // email must be unique
            var contacts = App.request('list:contacts');
            if (contacts) {
                var colRes = contacts.get(this.id);
                if (colRes && this.cid !== colRes.cid) {
                    //error, duplicate email
                    result.push({
                        field: 'email',
                        message: 'Already exists!'
                    });
                }
            }

            return result;
        },

        _validateEmailAddressName: function (emailAddressName) {
            var result = [];

            if (emailAddressName && emailAddressName.length > 0) {
                if (emailAddressName.length > 64) {
                    // user name too long
                    result.push({
                        field: 'email',
                        message: 'User name part is too long (> 64)'
                    });
                }
                else {
                    // check for valid characters?
                    var re = /[^a-zA-Z0-9!#\$%&'\*\+\-\/=\?\^_`\{\|\}~\.]/;
                    if (re.test(emailAddressName)) {
                        result.push({
                            field: 'email',
                            message: 'User name part has unsupported characters'
                        });
                    }
                }
            }
            else {
                // missing user name
                result.push({
                    field: 'email',
                    message: 'Missing user name part'
                });
            }

            return result;
        },

        _validateEmailAddressDomain: function (emailAddressDomain) {
            var result = [];

            if (emailAddressDomain && emailAddressDomain.length > 0) {
                if (emailAddressDomain.length > 255) {
                    // domain name too long
                    result.push({
                        field: 'email',
                        message: 'Domain name part is too long (> 255)'
                    });
                }
                else {
                    // check for valid characters?
                    var re = /[^a-zA-Z0-9\-\.]/;
                    if (re.test(emailAddressDomain)) {
                        result.push({
                            field: 'email',
                            message: 'Domain name part has unsupported characters'
                        });
                    }
                }
            }
            else {
                // missing domain name
                result.push({
                    field: 'email',
                    message: 'Missing domain name part'
                });
            }

            return result;
        },

        _validateName: function (name, nameLength, field) {
            var result = [];

            if (name && name.length > 0) {
                if (name.length > nameLength) {
                    // name too long
                    result.push({
                        field: field,
                        message: 'Too long (> ' + nameLength + ')'
                    });
                }
                //else {
                //    // check for valid characters?
                //    var re = /[^a-zA-Z\s]/;
                //    if (re.test(name)) {
                //        result.push({
                //            field: field,
                //            message: 'Has unsupported characters'
                //        });
                //    }
                //}
            }
            else {
                // missing name
                result.push({
                    field: field,
                    message: 'Required field'
                });
            }

            return result;
        }
    });
});