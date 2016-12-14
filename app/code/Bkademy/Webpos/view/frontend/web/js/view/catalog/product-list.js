/**
 * Copyright © 2016 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */
define([
    'uiComponent',
    'mage/storage',
    'Bkademy_Webpos/js/model/url-builder'
], function (Component, storage, urlBuilder) {
    'use strict';

    return Component.extend({


        defaults: {
            template: 'Bkademy_Webpos/catalog/product-list'
        },

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

            }).fail(function (response) {

            });
        }
    });
});