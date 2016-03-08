/**
 * @namespace App.Components
 * */
var App = (function($, Backbone, Mn){
    // Create our Application
    var app = new Mn.Application();

    app.on('initialize:before', function (options) {
        // set default options
        app.options = options || {};
    });

    // initialization
    app.addInitializer(function(options) {
        app.options = options || {};
    });

    // router must be the last one to initialise
    app.on('initialize:after', function (options) {
        // router place if no modules
    });

    app.startSubApp = function(appName, args){
        var currentApp = app.module(appName);

        if (app.currentApp === currentApp){ return; }

        if (app.currentApp){
            app.currentApp.stop();
        }

        app.currentApp = currentApp;
        currentApp.start(args);
    };

    return app;
})($, Backbone, Mn);