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
            template: 'Bkademy_Webpos/catalog/product-list'
        },

        product: ko.observableArray([]),
        curPage: ko.observable(1),
        numberOfPage: ko.observable(0),
        searchKey: ko.observable(''),
        quote: ko.observableArray([]),

        initialize: function () {
            var self = this;
            this._super();
            self.showProduct(1);
        },

        showProduct: function (pageNumber) {
            var self = this;
            var params = {};
            var serviceUrl = urlBuilder.createUrl('/products?searchCriteria[pageSize]=20&searchCriteria[currentPage]='+pageNumber, params);
            var payload = {};
            storage.get(
                serviceUrl, JSON.stringify(payload)
            ).done(function (response) {
                self.product(response.items);
                self.numberOfPage(response.total_count);
                //self.hideLoader();
            }).fail(function (response) {

            });
        },
        
        filter: function () {
            
        },
        
        previous: function () {
            
        },
        
        next: function () {
            
        },

        addToCart: function (data) {
            
        }
    });
});