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
    'Bkademy_Webpos/js/view/customer/customer-view'
], function ($, Component, storage, ko, urlBuilder, CustomerView) {
    'use strict';

    return Component.extend({
        defaults: {
            template: 'Bkademy_Webpos/customer/customer-list'
        },

        customers: ko.observableArray([]),
        searchKey: ko.observable(''),
        pageSize: 13,
        numberOfPage: ko.observable(1),
        curPage: ko.observable(1),
        isLoading: false,
        stopLazyLoad: false,

        initialize: function () {
            var self = this;
            this._super();
            this.customerView = CustomerView();
            self.showList(1);
        },

        addItemsToList: function(items){
            var customers = this.customers();
            for(var i in items){
                customers.push(items[i]);
            }
            this.customers(customers);
        },

        showList: function (pageNumber) {
            var self = this;
            var params = {};
            var serviceUrl = urlBuilder.createUrl('/webpos/customers?searchCriteria[pageSize]='+this.pageSize+'&searchCriteria[currentPage]='+pageNumber, params);
            var payload = {};
            this.isLoading = true;
            storage.get(
                serviceUrl, JSON.stringify(payload)
            ).done(function (response) {
                self.addItemsToList(response.items);
                self.numberOfPage(response.total_count);
                self.curPage(pageNumber);
                if(pageNumber * self.pageSize >= response.total_count) {
                    self.stopLazyLoad = true;
                }
                if(!self.customerView.getData() || !self.customerView.getData().id) {
                    self.customerView.setData(response.items[0]);
                }
                //self.hideLoader();
            }).fail(function (response) {

            }).always(function (response){
                self.isLoading = false;
            });
        },

        formatPrice: function (price) {

        },

        lazyload: function() {
            if(this.isLoading) {
                return;
            }
            if(this.stopLazyLoad) {
                return;
            }
            var curPage = this.curPage() + 1;
            this.showList(curPage);
        },

        filter: function (element, event) {
            if(this.isLoading) {
                return;
            }
            this.stopLazyLoad = false;
            var searchKey = event.target.value;
            var self = this;
            var params = {};
            var serviceUrl = urlBuilder.createUrl('/webpos/customers?searchCriteria[pageSize]='+this.pageSize+
                '&searchCriteria[filterGroups][0][filters][0][field]=email' +
                '&searchCriteria[filterGroups][0][filters][0][value]=%'+searchKey+'%'+
                '&searchCriteria[filterGroups][0][filters][0][conditionType]=like'
                , params);
            var payload = {};
            storage.get(
                serviceUrl, JSON.stringify(payload)
            ).done(function (response) {
                self.customers(response.items);
                self.numberOfPage(response.total_count);
                self.curPage(1);
                //self.hideLoader();
            }).fail(function (response) {

            }).always(function (response){
                self.isLoading = false;
            });
        },

        loadCustomer: function(data) {
            CustomerView().setData(data);
        },

        showCreateForm: function(){

        },

        isSearchable: function(){

        }
    });
});