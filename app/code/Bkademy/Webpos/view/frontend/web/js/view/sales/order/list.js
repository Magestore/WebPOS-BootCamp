/*
 *  Copyright © 2016 Bkademy. All rights reserved.
 *  See COPYING.txt for license details.
 *
 */

define(
    [
        'require',
        'jquery',
        'ko',
        'Bkademy_Webpos/js/model/sales/order-factory',
        // 'Bkademy_Webpos/js/view/layout',
        // 'mage/translate',
        'Bkademy_Webpos/js/view/base/list/collection-list',
        'Bkademy_Webpos/js/model/sales/order/status',
        'Bkademy_Webpos/js/model/event-manager',
        'Bkademy_Webpos/js/helper/price',
        'Bkademy_Webpos/js/helper/datetime',
        // 'Bkademy_Webpos/js/helper/staff',
        'Bkademy_Webpos/js/helper/alert',
        'Magento_Ui/js/modal/confirm'
    ],
    function (require, $, ko, OrderFactory, ViewManager,
              // $t,
              listAbstract,
              orderStatus, eventManager,
              priceHelper, datetimeHelper,
              // staffHelper,
              alertHelper, Confirm) {
        "use strict";

        return listAbstract.extend({
            items: ko.observableArray([]),
            model: '',
            collection: '',
            isShowHeader: false,
            isSearchable: true,
            pageSize: 10,
            curPage: 1,
            selectedOrder: ko.observable(null),
            searchKey: '',
            groupDays: [],
            isOnline: true,
            currentItemIsExist: false,
            statusObject: orderStatus.getStatusObject(),
            statusBtn: '.wrap-status-orders ul li',
            statusArray: [],
            statusArrayDefault: orderStatus.getStatusArray(),
            viewPermission: [],
            isFirstLoad: true,
            isSearching: ko.observable(false),
            defaults: {
                template: 'Bkademy_Webpos/sales/order/list',
            },

            initialize: function () {
                this._super();
                this.listenMenuShowContainerAfterEvent();
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

            _prepareItems: function () {
                var self = this;
                this.startLoading();
                this.groupDays = [];
                this.collection = OrderFactory.get().setMode('offline').getCollection().reset();
                if (this.viewPermission.length == 0) {
                    this.setItems([]);
                    return;
                }
                if (this.searchKey)
                    this.collection.addFieldToFilter(
                        [
                            ['increment_id', this.searchKey.toLowerCase(), 'like'],
                            ['customer_email', this.searchKey.toLowerCase(), 'like'],
                            ['customer_firstname', this.searchKey.toLowerCase(), 'like'],
                            ['customer_lastname', this.searchKey.toLowerCase(), 'like']
                        ]
                    );
                if (this.statusArray.length > 0)
                    this.collection.addFieldToFilter('status', this.statusArray, 'in');
                else
                    this.collection.addFieldToFilter('status', this.statusArrayDefault, 'in');
                if (this.viewPermission.indexOf(3) >= 0) {
                } else {
                    if (this.viewPermission.indexOf(1) >= 0)
                        this.collection.addFieldToFilter('webpos_staff_id', staffHelper.getStaffId(), 'eq');
                    if (this.viewPermission.indexOf(2) >= 0)
                        this.collection.addFieldToFilter('webpos_staff_id', window.webposConfig.locationId, 'eq');
                }

                this.collection.setOrder('created_at', 'DESC');
                this.collection.setPageSize(this.pageSize).setCurPage(this.curPage);
                var deferred = $.Deferred();
                this.collection.load(deferred);
                deferred.done(function (response) {
                    if (self.isOnline && self.searchKey && response.items.length < 1) {
                        self.items([]);
                        self.loadItem(null);
                        $('.notification-bell').hide();
                        $('#c-button--push-left').hide();
                        Confirm({
                            content: $t('Do you want to search online?'),
                            actions: {
                                confirm: function () {
                                    self.orderSearchOnline();
                                },
                                always: function (event) {
                                    $('.notification-bell').show();
                                    $('#c-button--push-left').show();
                                    event.stopImmediatePropagation();
                                }
                            }
                        });
                    } else {
                        self.isOnline = true;
                        var items = self._processResponse(response);
                        self.items(items);
                    }
                    self.finishLoading();
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

            orderSearch: function (data, event) {
                this.collection.reset();
                this.searchKey = event.target.value;
                this._prepareItems();
            },

            orderSearchOnline: function () {
                var self = this;
                this.isSearching(true);
                this.isOnline = false;
                this.resetFilterStatus();
                this.collection = OrderFactory.get().setMode('online').getCollection().reset();
                this.collection.addFieldToFilter('increment_id', "%" + this.searchKey + "%", 'like');
                var deferred = $.Deferred();
                this.collection.load(deferred);
                deferred.done(function (response) {
                    self.isSearching(false);
                    self.resetData();
                    var count = response.items.length;
                    if (count == 0) {
                        alertHelper({
                            priority: 'warning',
                            title: 'Error',
                            message: $t('Can not find any items with key %1').replace('%1', '\<b>' + self.searchKey + '\</b>')
                        });
                        self.isOnline = true;
                    } else {
                        $.each(response.items, function (index, value) {
                            var sDeferred = $.Deferred();
                            OrderFactory.get().setMode('offline').setData(value).save(sDeferred);
                            sDeferred.done(function (response) {
                                self._prepareItems();
                            })
                        });
                    }
                });
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
                var viewManager = require('Bkademy_Webpos/js/view/layout');
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
                return priceHelper.convertAndFormat(data.base_grand_total);
            },

            getCreatedAt: function (data) {
                return this.getTime(data.created_at);
            },

            /**
             * return a date time with format: 15:26 PM
             * @param dateString
             * @returns {string}
             */
            getTime: function (dateString) {
                return datetimeHelper.getTime(dateString);
            },

            render: function () {
                var self = this;
                self._render();
                eventManager.observer('order_pull_after', function (event, data) {
                    if (data && data.status == 'notsync')
                        self.loadItem(null);
                    self.isOnline = false;
                    self._prepareItems();
                });
                eventManager.observer('show_container_after', function (event, id) {
                    if (id == "orders_history") {
                        self._prepareItems();
                    }
                });
                if (staffHelper.isHavePermission('Bkademy_Webpos::manage_order_me'))
                    this.viewPermission.push(1);
                if (staffHelper.isHavePermission('Bkademy_Webpos::manage_order_location'))
                    this.viewPermission.push(2);
                if (staffHelper.isHavePermission('Bkademy_Webpos::manage_all_order'))
                    this.viewPermission.push(3);
                if (this.isFirstLoad) {
                    this._prepareItems();
                    this.isFirstLoad = false;
                }
            },

            listenMenuShowContainerAfterEvent: function () {
                var self = this;
                eventManager.observer('orders_history_show_container_after', function (event, eventData) {
                    self.render();
                });
            }

        });
    }
);