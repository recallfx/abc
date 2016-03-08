App.module('Components', function(Components, App, Backbone, Mn){
    'use strict';

    /**
     * Generic router
     * */
    Components.Router = Mn.AppRouter.extend({
        appRoutes : {
            ''              : 'showIndex',
            'filter/:str'   : 'showFiltered',
            'new'           : 'showNewItem',
            'edit/:email'   : 'showEditItem',
            'import'        : 'showImportPage',
            'export'        : 'showExportPage',
            'about'         : 'showAboutPage'
        }
    });

    /**
     * Generic router controller
     *
     * Initializing it will also start router
     * */
    Components.RouterController = Marionette.Controller.extend({
        initialize : function () {

            App.router = new Components.Router({
                controller : this
            });

            if (Backbone.history){
                Backbone.history.start();
            }
        },

        showIndex : function () {
            App.vent.trigger('router:filter', '');
        },

        showFiltered : function (str) {
            App.vent.trigger('router:filter', str);
        },

        showNewItem : function () {
            App.vent.trigger('router:item:new');
        },

        showEditItem : function (email) {
            App.vent.trigger('router:item:edit', email);
        },

        showImportPage: function () {
            App.vent.trigger('router:page:import');
        },

        showExportPage: function () {
            App.vent.trigger('router:page:export');
        },

        showAboutPage: function () {
            App.vent.trigger('router:page:about');
        }
    });
});