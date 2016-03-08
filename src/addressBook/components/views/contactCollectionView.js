App.module('Views', function(Views, App, Backbone, Mn, $, _){
    'use strict';

    /**
     * Contact collection view
     * */
    Views.ContactCollectionView = Mn.CompositeView.extend({
        template: window.JST['addressBook/templates/contacts-collection.html'],
        childView: Views.ContactItemView,
        emptyView: Views.ContactsEmptyView,
        childViewContainer: '.list-group',
        reorderOnSort: true,

        ui : {
            'inputSearch'       : '#ctc-search',
            'lblVisibleCount'   : '#ctc-visible-count',
            'lblTotalCount'     : '#ctc-total-count',
            'btnSort'           : '#ctc-sort'
        },

        events : {
            'click #ctc-sort'   : 'onSortClick',
            'keyup #ctc-search' : 'onSearchKeyUp'
        },

        initialize: function() {
            this.lazyViewFilter = _.debounce(this.viewFilter, 150);
        },

        onRender: function() {
            this.viewFilter(this.ui.inputSearch.val());
        },

        onAddChild: function() {
            this.viewFilter(this.ui.inputSearch.val());
        },

        onRemoveChild: function() {
            this.viewFilter(this.ui.inputSearch.val());
        },

        onSortClick: function() {
            this.collection.toggleSort();

            var sortOrder = this.collection.getSortOrder();
            var $span = this.ui.btnSort.find('span');

            $span.removeClass();
            if (sortOrder === 1) {
                $span.addClass('glyphicon glyphicon-sort-by-alphabet-alt');
            }
            else {
                $span.addClass('glyphicon glyphicon-sort-by-alphabet');
            }
        },

        onSearchKeyUp: function(e) {
            this.lazyViewFilter(e.target.value || '');
        },

        viewFilter: function(query) {
            query = query.toLowerCase();

            var visibleCount = 0;

            if (this.collection.length > 0) {
                this.children.each(function(view){
                    var fullName = view.model.getFullName().toLowerCase();

                    if (fullName.indexOf(query) > -1) {
                        view.$el.css('display', 'inherit');
                        visibleCount++;
                    } else {
                        view.$el.css('display', 'none');
                    }
                });
            }

            this.ui.lblVisibleCount.text(visibleCount);
            this.ui.lblTotalCount.text(this.collection.length);
        }
    });
});