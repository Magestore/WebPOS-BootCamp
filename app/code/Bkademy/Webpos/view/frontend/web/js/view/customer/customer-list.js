/**
 * Copyright © 2016 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */
define([
    'jquery',
    'uiComponent',
    'mage/storage',
    'ko',
    'Bkademy_Webpos/js/model/url-builder'
], function ($, Component, storage, ko, urlBuilder) {
    'use strict';

    return Component.extend({
        defaults: {
            template: 'Bkademy_Webpos/customer/customer-list'
        },

        customers: ko.observableArray([]),
        searchKey: ko.observable(''),
        pageSize: 1000,
        numberOfPage: ko.observable(1),
        curPage: ko.observable(1),

        initialize: function () {
            var self = this;
            this._super();
            self.showList(1);
        },

        showList: function (pageNumber) {
            var self = this;
            var params = {};
            var serviceUrl = urlBuilder.createUrl('/webpos/customers?searchCriteria[pageSize]='+this.pageSize+'&searchCriteria[currentPage]='+pageNumber, params);
            var payload = {};
            storage.get(
                serviceUrl, JSON.stringify(payload)
            ).done(function (response) {
                self.customers(response.items);
                self.numberOfPage(response.total_count);
                self.curPage(pageNumber);
                //self.hideLoader();
            }).fail(function (response) {

            });
        },

        formatPrice: function (price) {

        },

        lazyload: function() {

        },

        filter: function () {

        },

        showCreateForm: function(){

        },

        isSearchable: function(){

        }
    });
});