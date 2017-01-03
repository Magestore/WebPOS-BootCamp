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
        'uiComponent',
        'mage/translate',
        'Bkademy_Webpos/js/model/sales/order/total',
        'Bkademy_Webpos/js/model/sales/order/status',
        'Bkademy_Webpos/js/model/url-builder',
        'mage/storage',
        'Bkademy_Webpos/js/helper/alert',
        'Bkademy_Webpos/js/view/sales/order/list',
        'Magento_Catalog/js/price-utils'

    ],
    function (require, $, ko, Component, $t, orderTotal, orderStatus,urlBuilder,
        storage, alertHelper, List, priceHelper
    ) {
        "use strict";

        return Component.extend({
            orderData: ko.observable(null),
            orderListView: ko.observable(''),
            isShowActionPopup: ko.observable(false),
            totalValues: ko.observableArray([]),
            statusObject: orderStatus.getStatusObjectView(),
            isCanceled: ko.observable(true),
            canInvoice: ko.observable(true),
            canCancel: ko.observable(true),
            canShip: ko.observable(true),
            canCreditmemo: ko.observable(true),
            canSync: ko.observable(true),
            canTakePayment: ko.observable(false),
            canUnhold: ko.observable(false),
            isFirstLoad: true,
            defaults: {
                template: 'Bkademy_Webpos/sales/order/view',
                templateTop: 'Bkademy_Webpos/sales/order/view/top',
                templateBilling: 'Bkademy_Webpos/sales/order/view/billing',
                templateShipping: 'Bkademy_Webpos/sales/order/view/shipping',
                templateShippingMethod: 'Bkademy_Webpos/sales/order/view/shipping-method',
                templatePaymentMethod: 'Bkademy_Webpos/sales/order/view/payment-method',
                templateTotal: 'Bkademy_Webpos/sales/order/view/total',
                templateItems: 'Bkademy_Webpos/sales/order/view/items',
                templateComments: 'Bkademy_Webpos/sales/order/view/comments',
            },

            initialize: function () {
                this._super();
                var self = this;
                ko.pureComputed(function () {
                    return self.orderData();
                }).subscribe(function () {
                });
                self.cannotSync = ko.pureComputed(function () {
                    return (self.orderData() && self.orderData().state) ? self.orderData().state != 'notsync' : false;
                });

                self.showInvoiceButton = ko.pureComputed(function () {
                    var orderData = self.orderData();
                    if(orderData.state === 'complete' || orderData.state === 'closed')
                        return false;
                    var allInvoiced = true;
                    $.each(orderData.items, function(index, value){
                        if(parseFloat(value.qty_ordered) - parseFloat(value.qty_invoiced) - parseFloat(value.qty_canceled) > 0)
                            allInvoiced = false;
                    });
                    if (!allInvoiced)
                        return true;
                    return false;
                });

                self.showShipmentButton = ko.pureComputed(function () {
                    var orderData = self.orderData();
                    var allShip = true;
                    $.each(orderData.items, function(index, value){
                        if(parseFloat(value.qty_ordered) - parseFloat(value.qty_shipped) - parseFloat(value.qty_refunded) - parseFloat(value.qty_canceled)>0)
                            allShip = false;
                    });
                    if (!allShip)
                        return true;
                    return false;
                });

                // eventmanager.observer('sales_order_afterSave', function (event, data) {
                //     if (data.response && data.response.entity_id > 0) {
                //         var deferedSave = $.Deferred();
                //         OrderFactory.get().setData(data.response).setMode('offline').save(deferedSave);
                //         self.orderListView().updateOrderListData(data.response);
                //     }
                // });
                if (this.isFirstLoad) {
                    $("body").click(function () {
                        self.isShowActionPopup(false);
                    });
                    this.isFirstLoad = false;
                }
            },

            invoice: function (data) {
                var orderData = this.orderData();
                var orderId = orderData.entity_id;
                var itemsOrder = orderData.items;
                var items = {};
                var i = 0;
                $.each(itemsOrder, function (index, value) {
                    var itemsData = {};
                    itemsData.qty = value.qty_ordered;
                    itemsData.order_item_id = value.item_id;
                    items[i] = itemsData;
                    i++;
                });
                var self = this;
                var itemsOrder = [];
                var params = {};
                var serviceUrl = urlBuilder.createUrl('/webpos/invoices/create', params);
                var payload = {entity: {orderId: orderId, items: items}};
                storage.post(
                    serviceUrl, JSON.stringify(payload)
                ).done(function (response) {
                    self.setData(response);
                    List().test();
                    alertHelper({
                        priority: 'success',
                        title: 'sucess',
                        message: $t('Create invoice successfully!')
                    });
                }).fail(function (response) {
                    alertHelper({
                        priority: 'warning',
                        title: 'Error',
                        message: $t('Cannot create invoice!')
                    });
                });
            },

            shipment: function (data) {
                var orderData = this.orderData();
                var orderId = orderData.entity_id;
                var itemsOrder = orderData.items;
                var items = {};
                var i = 0;
                $.each(itemsOrder, function (index, value) {
                    var itemsData = {};
                    itemsData.qty = value.qty_ordered;
                    itemsData.order_item_id = value.item_id;
                    items[i] = itemsData;
                    i++;
                });
                var self = this;
                var itemsOrder = [];
                var params = {};
                var serviceUrl = urlBuilder.createUrl('/webpos/shipment/create', params);
                var payload = {entity: {orderId: orderId, items: items}};
                storage.post(
                    serviceUrl, JSON.stringify(payload)
                ).done(function (response) {
                    self.setData(response);
                    List().test();
                    alertHelper({
                        priority: 'success',
                        title: 'sucess',
                        message: $t('Create shipment successfully!')
                    });
                }).fail(function (response) {
                    alertHelper({
                        priority: 'warning',
                        title: 'Error',
                        message: $t('Cannot create shipment!')
                    });
                });
            },

            refund: function (type) {
                var self = this;
                var itemsOrder = [];
                var orderId = this.orderData().entity_id;
                var params = {};
                var serviceUrl = urlBuilder.createUrl('/order/'+ orderId + '/refund', params);
                var payload = {};
                storage.post(
                    serviceUrl, JSON.stringify(payload)
                ).done(function (response) {
                    console.log(response);
                }).fail(function (response) {

                });
            },

            afterRender: function () {
                var calheight, heightfooter, heightheader, heighttop, heightsumtotal;
                heightfooter = $('.footer-order').height();
                heightheader = $('#webpos_order_view_container .o-header-nav').height();
                heighttop = $('#webpos_order_view_container .sum-info-top').height();
                heightsumtotal = $('#webpos_order_view_container .total-due').height();
                calheight = heightfooter + heightheader + heightsumtotal + heighttop + 60;
                $('#webpos_order_view_container main').height('calc(100vh - '+ calheight +'px)');
            },
            setData: function (data, object) {
                this.orderData(data);
                this.orderListView(object);
                this.isShowActionPopup(false);
                var self = this;
                this.totalValues([]);
                var totalArray = orderTotal.getTotalOrderView();
                if (self.orderData())
                    $.each(totalArray, function (index, value) {
                        var order_currency_code = self.orderData().order_currency_code;
                        var current_currency_code = window.webposConfig.currentCurrencyCode;
                        if (
                            order_currency_code == current_currency_code
                        ) {
                            if ((self.orderData()[value.totalName] && self.orderData()[value.totalName] != 0) || value.required) {
                                var totalCode = value.totalName.replace("base_", "");
                                self.totalValues.push(
                                    {
                                        totalValue: (value.isPrice)?priceUtils.formatPrice(self.orderData()[totalCode]):self.orderData()[totalCode]+' '+value.valueLabel,
                                        totalLabel: value.totalName == 'base_discount_amount' &&
                                        (self.orderData().discount_description || self.orderData().coupon_code) ?
                                        $t(value.totalLabel) + ' (' + (self.orderData().discount_description ?
                                            self.orderData().discount_description : self.orderData().coupon_code) +
                                        ')' : $t(value.totalLabel)
                                    }
                                );
                            }
                        } else {
                            if ((self.orderData()[value.totalName] && self.orderData()[value.totalName] != 0) || value.required) {
                                self.totalValues.push(
                                    {
                                        totalValue: (value.isPrice)?self.convertAndFormatPrice(self.orderData()[value.totalName]):self.orderData()[value.totalName]+' '+value.valueLabel,
                                        totalLabel: value.totalName=='base_discount_amount'&&
                                        (self.orderData().discount_description || self.orderData().coupon_code)?
                                        $t(value.totalLabel)+' ('+(self.orderData().discount_description?
                                            self.orderData().discount_description:self.orderData().coupon_code)+
                                        ')':$t(value.totalLabel)
                                    }
                                );
                            }
                        }
                    });
            },

            getData: function(){
                return this.orderData();
            },

            showActionPopup: function (data, event) {
                event.stopPropagation();
                // if (this.orderViewObject.isShowActionPopup.call())
                //     this.orderViewObject.isShowActionPopup(false);
                // else
                this.orderViewObject.isShowActionPopup(true);
            },

            showPopup: function (type) {
                var viewManager = require('Bkademy_Webpos/js/view/layout');
                this.isShowActionPopup(false);
                // if (!this.popupArray) {
                //     this.popupArray = {
                //         sendemail: viewManager.getSingleton('view/sales/order/sendemail'),
                //         comment: viewManager.getSingleton('view/sales/order/comment'),
                //         invoice: viewManager.getSingleton('view/sales/order/invoice'),
                //         shipment: viewManager.getSingleton('view/sales/order/shipment'),
                //         refund: viewManager.getSingleton('view/sales/order/creditmemo'),
                //         cancel: viewManager.getSingleton('view/sales/order/cancel'),
                //         payment: viewManager.getSingleton('view/sales/order/view/payment')
                //     }
                // }
                this.popupArray[type].display(true);
            },

            getAddressType: function (type) {
                switch (type) {
                    case 'billing':
                        return this.orderData.call().billing_address;
                        break;
                    case 'shipping':
                        return this.orderData.call().extension_attributes.shipping_assignments[0].shipping.address;
                        break;
                }
            },

            getCustomerName: function (type) {
                var address = this.getAddressType(type);
                return address.firstname + ' ' + address.lastname;
            },

            getAddress: function (type) {
                var address = this.getAddressType(type);
                var city = address.city ? address.city + ', ' : '';
                var region = address.region && typeof address.region == 'string' ? address.region + ', ' : '';
                var postcode = address.postcode ? address.postcode + ', ' : '';
                return city + region + postcode + address.country_id;
            },

            getStatus: function () {
                var self = this;
                return _.find(self.statusObject, function (obj) {
                    return obj.statusClass == self.orderData().status
                }).statusLabel;
            },

            getJsObject: function () {
                return {
                    orderView: this,
                    orderListView: this.orderListView.call(),
                }
            },

            getPrice: function (label) {
                if (this.orderData().order_currency_code == window.webposConfig.currentCurrencyCode) {
                    return priceHelper.formatPrice(this.orderData()[label]);
                }
                return this.convertAndFormatPrice(
                    this.orderData()['base_' + label],
                    this.orderData().base_currency_code
                );
            },

            getGrandTotal: function () {
                if (this.orderData().order_currency_code == window.webposConfig.currentCurrencyCode) {
                    return priceHelper.formatPrice(this.orderData().grand_total);
                }
                return this.formatPrice(this.orderData().base_grand_total)
            },

            convertAndFormatPrice: function (price) {
                return priceHelper.formatPrice(price);
            },

            canShowComment: function () {
                var canShowComment = false;
                if (this.orderData().status_histories) {
                    $.each(this.orderData().status_histories, function (index, value) {
                        if (value.comment && value.comment != '') canShowComment = true;
                    });
                }
                return canShowComment;
            },

            printOrder: function () {
                var html = $('#container-print-order')[0].innerHTML;
                var print_window = window.open('', 'print_offline', 'status=1,width=700,height=700');
                print_window.document.write(html);
                print_window.print();
            },

            syncOrder: function(){
                CheckoutModel.syncOrder(this.orderData(),"orderlist");
            },

            reOrder: function () {
                this.isShowActionPopup(false);
                ReOrder(this.orderData());
            },

            unhold: function () {

            },

            showWebposPayment: function () {
                var hasPayment = this.hasWebposPayment();
                var showIntegration = this.showIntegration();
                return (hasPayment || showIntegration);
            },

            hasWebposPayment: function () {
                var hasPayment = this.orderData().webpos_order_payments && this.orderData().webpos_order_payments.length > 0;
                return hasPayment;
            },

            showIntegration: function(){
                var hasGiftcard = this.orderData().base_gift_voucher_discount && this.orderData().base_gift_voucher_discount < 0;
                var hasRewardpoints = this.orderData().rewardpoints_base_discount && this.orderData().rewardpoints_base_discount < 0;
                var isPosPayment = this.orderData().payment && this.orderData().payment.method == 'multipaymentforpos';
                return ((hasGiftcard || hasRewardpoints) && isPosPayment);
            },

            getWebposPaymentAmount: function (data) {
                var order_currency_code = this.orderData().order_currency_code;
                var current_currency_code = window.webposConfig.currentCurrencyCode;
                // var amount = priceHelper.currencyConvert(
                //     data.base_payment_amount,
                //     this.orderData().base_currency_code
                // );
                var amount = data.base_payment_amount;
                if (order_currency_code == current_currency_code) {
                    amount = data.payment_amount;
                }
                return (data.base_payment_amount == 0) ? this.convertAndFormatPrice(0) : (amount);
            },

            getPaidPayment: function () {
                var payments = [];
                if (this.showWebposPayment()) {
                    if(this.hasWebposPayment()){
                        var allPayments = this.orderData().webpos_order_payments;
                        $.each(allPayments, function (index, payment) {
                            if (priceHelper.toNumber(payment.base_payment_amount) > 0) {
                                payments.push(payment);
                            }
                        });
                    }
                    if(this.showIntegration()){
                        var hasGiftcard = this.orderData().base_gift_voucher_discount && this.orderData().base_gift_voucher_discount < 0;
                        if(hasGiftcard){
                            var baseAmount = this.orderData().base_gift_voucher_discount;
                            var amount = this.orderData().gift_voucher_discount;
                            payments.push({
                                base_payment_amount:-baseAmount,
                                payment_amount:-amount,
                                method_title: $t('Gift Voucher')
                            });
                        }
                        var hasRewardpoints = this.orderData().rewardpoints_base_discount && this.orderData().rewardpoints_base_discount < 0;
                        if(hasRewardpoints){
                            var baseAmount = this.orderData().rewardpoints_base_discount;
                            var amount = this.orderData().rewardpoints_discount;
                            payments.push({
                                base_payment_amount:-baseAmount,
                                payment_amount:-amount,
                                method_title: $t("Customer's Reward Points")
                            });
                        }
                    }
                }
                return payments;
            },

            getDeliveryDate: function (date) {
                return datetimeHelper.getFullDatetime(this.orderData().webpos_delivery_date);
                if (date)
                    return datetimeHelper.getFullDatetime(date);
                return datetimeHelper.getFullDatetime(this.orderData().webpos_delivery_date);
            },

            getPayLaterPayment: function () {
                var payments = [];
                if (this.showWebposPayment() && this.orderData().base_total_due > 0) {
                    var allPayments = this.orderData().webpos_order_payments;
                    $.each(allPayments, function (index, payment) {
                        if ((payment.base_payment_amount) == 0) {
                            payments.push(payment);
                        }
                    });
                }
                return payments;
            },
            showPayLater: function () {
                var payments = this.getPayLaterPayment();
                return (payments.length > 0) ? true : false;
            }
        });
    }
);