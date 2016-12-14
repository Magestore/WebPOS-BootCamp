/**
 * Copyright © 2016 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */
define([
    'jquery',
    'uiComponent',
    'mage/storage',
    'ko',
    'Bkademy_Webpos/js/model/url-builder',
    'Magento_Catalog/js/price-utils'
], function ($, Component, storage, ko, urlBuilder, priceUtils) {
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

        showProduct: function (curPage) {
            var self = this;
            var params = {};
            var serviceUrl = urlBuilder.createUrl('/webpos/products?searchCriteria[pageSize]=16' +
                '&searchCriteria[currentPage]='+curPage +
                '&searchCriteria[filterGroups][0][filters][0][field]=type_id' +
                '&searchCriteria[filterGroups][0][filters][0][value]=simple' +
                '&searchCriteria[filterGroups][0][filters][0][conditionType]=eq'
                , params);
            var payload = {};
            storage.get(
                serviceUrl, JSON.stringify(payload)
            ).done(function (response) {
                self.product(response.items);
                self.numberOfPage(response.total_count);
                self.curPage(curPage);
                //self.hideLoader();
            }).fail(function (response) {

            });
        },

        searchProduct: function (key, curPage) {
            var self = this;
            var params = {};
            var serviceUrl = urlBuilder.createUrl('/webpos/products?searchCriteria[pageSize]=16' +
                '&searchCriteria[currentPage]='+curPage +
                '&searchCriteria[filterGroups][0][filters][0][field]=type_id' +
                '&searchCriteria[filterGroups][0][filters][0][value]=simple' +
                '&searchCriteria[filterGroups][0][filters][0][conditionType]=eq'
                , params);
            var payload = {};
            storage.get(
                serviceUrl, JSON.stringify(payload)
            ).done(function (response) {
                self.product(response.items);
                self.numberOfPage(response.total_count);
                self.curPage(curPage);
                //self.hideLoader();
            }).fail(function (response) {

            });
        },

        formatPrice: function (price) {
            return priceUtils.formatPrice(price, window.webposConfig.priceFormat);
        },
        
        filter: function () {
            
        },

        next: function () {
            var curPage = this.curPage();
            this.searchProduct(this.searchKey(), curPage + 1);
        },

        previous: function () {
            var curPage = this.curPage();
            this.searchProduct(this.searchKey(), curPage - 1);
        },
        addToCart :function (data) {
            
        }
    });
});