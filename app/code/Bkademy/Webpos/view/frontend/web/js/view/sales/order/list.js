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
    'Bkademy_Webpos/js/model/sales/order/status'
], function ($, Component, storage, ko, urlBuilder, orderStatus) {
    'use strict';

    return Component.extend({
        defaults: {
            template: 'Bkademy_Webpos/sales/order/list'
        },
        items: ko.observableArray([]),
        groupDays: [],
        statusObject: orderStatus.getStatusObject(),
        statusArrayDefault: orderStatus.getStatusArray(),
        searchKey: ko.observable(''),
        pageSize: 1000,
        selectedOrder: ko.observable(null),
        numberOfPage: ko.observable(1),
        curPage: ko.observable(1),

        initialize: function () {
            var self = this;
            this._super();
            self.showList(1);
        },

        showList: function (pageNumber) {
            var self = this;
            var itemsOrder = [];
            var params = {};
            var serviceUrl = urlBuilder.createUrl('/webpos/orders?searchCriteria[pageSize]=16&searchCriteria[currentPage]='+pageNumber, params);
            var payload = {};
            storage.get(
                serviceUrl, JSON.stringify(payload)
            ).done(function (response) {
                console.log(response);
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

        lazyload: function (element, event) {
            var scrollHeight = event.target.scrollHeight;
            var clientHeight = event.target.clientHeight;
            var scrollTop = event.target.scrollTop;
            if (scrollHeight - (clientHeight + scrollTop) <= 0 && this.canLoad() === true) {
                this.startLoading();
                this.pageSize += 10;
                this.refresh = false;
                this._prepareItems();
            }
        },

        _processResponse: function (response) {
            var self = this;
            var items = [];
            var orderList = response.items;
            var dayIndex = -1;
            this.currentItemIsExist = false;
            $.each(orderList, function (index, value) {
                var createdAt = value.created_at;
                var day = createdAt.split(' ')[0];
                if (self.groupDays.indexOf(day.toString()) == -1) {
                    dayIndex++;
                    self.groupDays.push(day);
                    items[dayIndex] = {};
                    items[dayIndex].day = day;
                    items[dayIndex].orderItems = [];
                    items[dayIndex].orderItems.push(value);
                } else {
                    if (items[self.groupDays.indexOf(day.toString())]) {
                        items[self.groupDays.indexOf(day.toString())].orderItems.push(value);
                    } else {
                        items[self.groupDays.indexOf(day.toString())] = {};
                        items[self.groupDays.indexOf(day.toString())].day = day;
                        items[self.groupDays.indexOf(day.toString())].orderItems = [];
                        items[self.groupDays.indexOf(day.toString())].orderItems.push(value);
                    }
                }
                if (self.selectedOrder() == value.entity_id) {
                    self.currentItemIsExist = true;
                }
            });
            if (!this.currentItemIsExist)
                this.loadItem(orderList[0]);
            return items;
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

        filterStatus: function (data, event) {
            this.isOnline = false;
            var el = $(event.currentTarget);
            if (el.hasClass('selected')) {
                el.removeClass('selected');
                this.statusArray.splice(this.statusArray.indexOf(el.attr('status')), 1);
            }
            else {
                el.addClass('selected');
                this.statusArray.push(el.attr('status'));
            }
            this._prepareItems();
        },

        resetFilterStatus: function () {
            var self = this;
            this.statusArray = [];
            $.each($(this.statusBtn), function (index, value) {
                $(value).removeClass('selected');
            })
        },

        loadItem: function (data, event) {
            // var viewManager = require('Magestore_Webpos/js/view/layout');
            // eventManager.dispatch('sales_order_list_load_order', {'order': data});
            // if (!this.orderViewObject) {
            //     this.orderViewObject = viewManager.getSingleton('view/sales/order/view');
            // }
            // this.orderViewObject.setData(data, this);
            // viewManager.getSingleton('view/sales/order/action').setData(data, this);
            // this.selectedOrder(data ? data.entity_id : null);
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

        /**
         * return a date time with format: 15:26 PM
         * @param dateString
         * @returns {string}
         */
        getTime: function (dateString) {
            return datetimeHelper.getTime(dateString);
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