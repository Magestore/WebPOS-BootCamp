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
    'Magento_Catalog/js/price-utils',
    'Bkademy_Webpos/js/model/sales/order/status',
    'Bkademy_Webpos/js/helper/datetime',
    // 'Bkademy_Webpos/js/helper/price'
], function ($, Component, storage, ko, urlBuilder, priceUtils, orderStatus,
            datetimeHelper
             // priceHelper
) {
    'use strict';

    return Component.extend({


        defaults: {
            template: 'Bkademy_Webpos/sales/order/list',
        },
        groupDays: [],
        items: ko.observableArray([]),
        statusObject: orderStatus.getStatusObject(),
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
            var itemsOrder = [];
            var params = {};
            var serviceUrl = urlBuilder.createUrl('/webpos/orders?searchCriteria[pageSize]=16&searchCriteria[currentPage]='+pageNumber, params);
            var payload = {};
            storage.get(
                serviceUrl, JSON.stringify(payload)
            ).done(function (response) {
                var orderList = response.items;
                var dayIndex = -1;
                $.each(orderList, function (index, value) {
                    var createdAt = value.created_at;
                    var day = createdAt.split(' ')[0];
                    if (self.groupDays.indexOf(day.toString()) == -1) {
                        dayIndex++;
                        self.groupDays.push(day);
                        itemsOrder[dayIndex] = {};
                        itemsOrder[dayIndex].day = day;
                        itemsOrder[dayIndex].orderItems = [];
                        itemsOrder[dayIndex].orderItems.push(value);
                    } else {
                        if (itemsOrder[self.groupDays.indexOf(day.toString())]) {
                            itemsOrder[self.groupDays.indexOf(day.toString())].orderItems.push(value);
                        } else {
                            itemsOrder[self.groupDays.indexOf(day.toString())] = {};
                            itemsOrder[self.groupDays.indexOf(day.toString())].day = day;
                            itemsOrder[self.groupDays.indexOf(day.toString())].orderItems = [];
                            itemsOrder[self.groupDays.indexOf(day.toString())].orderItems.push(value);
                        }
                    }
                });
                self.items(itemsOrder);
                console.log(itemsOrder);
                self.numberOfPage(response.total_count);
                self.curPage(pageNumber);
                //self.hideLoader();
            }).fail(function (response) {

            });
        },

        loadItem: function (data, event) {
            var viewManager = require('Magestore_Webpos/js/view/layout');
            eventManager.dispatch('sales_order_list_load_order', {'order': data});
            if (!this.orderViewObject) {
                this.orderViewObject = viewManager.getSingleton('view/sales/order/view');
            }
            this.orderViewObject.setData(data, this);
            viewManager.getSingleton('view/sales/order/action').setData(data, this);
            this.selectedOrder(data ? data.entity_id : null);
        },

        updateOrderListData: function (item) {
            var items = this.items();
            for (var index in items) {
                var createdAt = item.created_at;
                var day = createdAt.split(' ')[0];
                if (day == items[index].day) {
                    for (var i in items[index].orderItems) {
                        if (item.entity_id == items[index].orderItems[i].entity_id) {
                            items[index].orderItems[i] = item;
                            this.resetData();
                            this.setItems(items);
                            this.loadItem(null);
                            this.loadItem(item);
                        }
                    }
                }
            }
        },

        getCustomerName: function (data) {
            if (data.customer_firstname && data.customer_lastname)
                return data.customer_firstname + ' ' + data.customer_lastname;
            if (data.customer_email)
                return data.customer_email;
            if (data.billing_address) {
                if (data.billing_address.firstname && data.billing_address.lastname)
                    return data.billing_address.firstname + ' ' + data.billing_address.lastname;
                if (data.billing_address.email)
                    return data.billing_address.email;
            }

        },

        getGrandTotal: function (data) {
            return (data.base_grand_total);
        },

        getCreatedAt: function (data) {
            return (data.created_at);
        },

        formatDateGroup: function (dateString) {
            var date = "";
            if (!dateString) {
                date = new Date();
            } else {
                date = new Date(dateString);
            }
            var month = date.getMonth() + 1;
            if (month < 10) {
                month = "0" + month;
            }
            return date.getDate() + '/' + month + '/' + date.getFullYear();
        },

        //
        // formatPrice: function (price) {
        //     return priceUtils.formatPrice(price, window.webposConfig.priceFormat);
        // },
        //
        // filter: function () {
        //
        // },
        //
        // previous: function () {
        //
        // },
        //
        // next: function () {
        //
        // },
        //
        // addToCart: function (data) {
        //
        // }
    });
});