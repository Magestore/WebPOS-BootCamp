/*
 *  Copyright © 2016 Magestore. All rights reserved.
 *  See COPYING.txt for license details.
 *
 */

define(
    [
        'jquery',
        'ko',
        'Bkademy_Webpos/js/model/checkout/cart/items',
        'Bkademy_Webpos/js/model/checkout/cart/totals',
        'Bkademy_Webpos/js/model/event-manager',
        'Bkademy_Webpos/js/model/data-manager'
    ],
    function ($, ko, Items, Totals, Event, DataManager) {
        "use strict";
        var CartModel = {
            loading: ko.observable(),
            currentPage: ko.observable(),
            customerId: ko.observable(''),
            customerGroup: ko.observable(''),
            customerData: ko.observable({}),
            CheckoutModel: ko.observable(),
            billingAddress: ko.observable(),
            shippingAddress: ko.observable(),
            GUEST_CUSTOMER_NAME: "Guest",
            BACK_CART_BUTTON_CODE: "back_to_cart",
            CHECKOUT_BUTTON_CODE: "checkout",
            HOLD_BUTTON_CODE: "hold",
            PAGE:{
                CART:"cart",
                CHECKOUT:"checkout"
            },
            KEY: {
                QUOTE_INIT:'quote_init',
                ITEMS:'items',
                SHIPPING:'shipping',
                PAYMENT:'payment',
                TOTALS:'totals',
                QUOTE_ID:"quote_id",
                TILL_ID:"till_id",
                CURRENCY_ID:"currency_id",
                CUSTOMER_ID:"customer_id",
                CUSTOMER_DATA:"customer_data",
                BILLING_ADDRESS:"billing_address",
                SHIPPING_ADDRESS:"shipping_address",
                STORE_ID:"store_id",
                STORE:"store",
            },
            DATA:{
                STATUS: {
                    SUCCESS: '1',
                    ERROR: '0'
                }
            },
            initialize: function(){
                var self = this;
                self.initObserver();
                return self;
            },
            initObserver: function(){
                var self = this;
                self.isOnCheckoutPage = ko.pureComputed(function(){
                    return (self.currentPage() == self.PAGE.CHECKOUT)?true:false;
                });
                Event.observer('init_quote_after', function(event, response){
                    if(response && response.data){
                        self.saveQuoteData(response.data);
                    }
                });
            },
            emptyCart: function(){
                var self = this;
                Items.items.removeAll();
                self.removeCustomer();
                Totals.totals.removeAll();
                Event.dispatch('cart_empty_after','');
                self.resetQuoteInitData();
            },
            addCustomer: function(data){
                this.customerData(data);
                this.customerId(data.id);
                this.customerGroup(data.group_id);
            },
            removeCustomer: function(){
                var self = this;
                self.customerId("");
                self.customerGroup("");
                self.customerData({});
                Event.dispatch('cart_remove_customer_after',{guest_customer_name:self.GUEST_CUSTOMER_NAME});
            },
            removeItem: function(itemId){
                Items.removeItem(itemId);
                if(Items.items().length == 0){
                    Totals.totals.removeAll();
                }
                Event.dispatch('collect_totals', '');
                Event.dispatch('cart_item_remove_after',Items.items());
            },
            addProduct: function(data){
                var self = this;
                if(self.loading()){
                    return false;
                }
                Items.addItem(data);
            },
            updateItem: function(itemId, key, value){
                var validate = true;
                var item = Items.getItem(itemId);
                if(item){
                    Items.setItemData(itemId, key, value);
                }
            },
            getItemData: function(itemId, key){
                return Items.getItemData(itemId, key);
            },
            getItemsInfo: function(){
                var itemsInfo = [];
                if(Items.items().length > 0){
                    ko.utils.arrayForEach(Items.items(), function(item) {
                        itemsInfo.push(item.getInfoBuyRequest());
                    });
                }
                return itemsInfo;
            },
            getItemsInitData: function(){
                var itemsData = [];
                if(Items.items().length > 0){
                    ko.utils.arrayForEach(Items.items(), function(item) {
                        itemsData.push(item.getData());
                    });
                }
                return itemsData;
            },
            isVirtual: function(){
                var isVirtual = true;
                if(Items.items().length > 0){
                    var notVirtualItem = ko.utils.arrayFilter(Items.items(), function(item) {
                        return item.is_virtual() == false;
                    });
                    isVirtual = (notVirtualItem.length > 0)?false:true;
                }
                return isVirtual;
            },
            totalItems: function(){
                return Items.totalItems();
            },
            totalShipableItems: function(){
                return Items.totalShipableItems();
            },
            getQuoteCustomerParams: function(){
                var self = this;
                return {
                    customer_id: self.customerId(),
                    billing_address: self.billingAddress(),
                    shipping_address: self.shippingAddress()
                };
            },
            resetQuoteInitData: function(){
                var self = this;
                return {
                    quote_id: '',
                    store_id: DataManager.getData(self.KEY.STORE_ID),
                    customer_id: self.customerId(),
                    currency_id: DataManager.getData(self.KEY.CURRENCY_ID),
                    till_id: DataManager.getData(self.KEY.TILL_ID),
                };
            },
            getCustomerInitParams: function(){
                var self = this;
                return {
                    customer_id: DataManager.getData(self.KEY.CUSTOMER_ID),
                    billing_address: DataManager.getData(self.KEY.BILLING_ADDRESS),
                    shipping_address: DataManager.getData(self.KEY.SHIPPING_ADDRESS),
                    data: DataManager.getData(self.KEY.CUSTOMER_DATA)
                };
            },
            getQuoteInitParams: function(){
                var self = this;
                return {
                    quote_id: DataManager.getData(self.KEY.QUOTE_ID),
                    store_id: DataManager.getData(self.KEY.STORE_ID),
                    customer_id: DataManager.getData(self.KEY.CUSTOMER_ID),
                    currency_id: DataManager.getData(self.KEY.CURRENCY_ID),
                    till_id: DataManager.getData(self.KEY.TILL_ID)
                };
            },
            /**
             * Save cart only - not distch events
             * @returns {*}
             */
            saveCartOnline: function(){
                // var self = this;
                // var params = self.getQuoteInitParams();
                // params.items = self.getItemsInfo();
                // params.customer = self.getQuoteCustomerParams();
                // params.section = self.KEY.QUOTE_INIT;
                // self.loading(true);
                // var apiRequest = $.Deferred();
                // CartResource().setPush(true).setLog(false).saveCart(params, apiRequest);
                //
                // apiRequest.always(function(){
                //     self.loading(false);
                // });
                // return apiRequest;
            },
            /**
             * Save cart and dispatch events
             * @param saveBeforeRemove
             * @returns {*}
             */
            saveCartBeforeCheckoutOnline: function(saveBeforeRemove){
                // var self = this;
                // var params = self.getQuoteInitParams();
                // params.items = self.getItemsInfo();
                // params.customer = self.getQuoteCustomerParams();
                // if(saveBeforeRemove == true){
                //     params.section = self.KEY.QUOTE_INIT;
                // }
                // self.loading(true);
                // var apiRequest = $.Deferred();
                // CartResource().setPush(true).setLog(false).saveCartBeforeCheckout(params, apiRequest);
                //
                // apiRequest.always(function(){
                //     self.loading(false);
                // });
                // return apiRequest;
            },
            /**
             * Call API to empty cart - remove quote
             * @returns {*}
             */
            removeCartOnline: function(){
                // var self = this;
                // var params = self.getQuoteInitParams();
                // self.loading(true);
                // var apiRequest = $.Deferred();
                // CartResource().setPush(true).setLog(false).removeCart(params, apiRequest);
                //
                // apiRequest.done(
                //     function (response) {
                //         if(response.status == self.DATA.STATUS.SUCCESS){
                //             self.emptyCart();
                //         }
                //     }
                // ).always(function(){
                //     self.loading(false);
                // });
                // return apiRequest;
            },
            /**
             * Call API to remove cart item online
             * @param itemId
             * @returns {*}
             */
            removeItemOnline: function(itemId){
                // var self = this;
                // if(Items.items().length == 1){
                //     return self.removeCartOnline();
                // }
                //
                // var params = self.getQuoteInitParams();
                // params.item_id = itemId;
                //
                // self.loading(true);
                // var apiRequest = $.Deferred();
                // CartResource().setPush(true).setLog(false).removeItem(params, apiRequest);
                //
                // apiRequest.done(
                //     function (response) {
                //         if(response.status == self.DATA.STATUS.SUCCESS){
                //             self.removeItem(itemId);
                //         }
                //     }
                // ).always(function(){
                //     self.loading(false);
                // });
                // return apiRequest;
            },
            /**
             * Check if cart has been saved online or not
             * @returns {boolean}
             */
            hasOnlineQuote: function(){
                var self = this;
                return (DataManager.getData(self.KEY.QUOTE_ID))?true:false;
            },
            /**
             * Save quote init data to data manager
             * @param quoteData
             */
            saveQuoteData: function(quoteData){
                if(quoteData){
                    $.each(quoteData, function(key, value){
                        DataManager.setData(key, value);
                    })
                }
            }
        };
        return CartModel.initialize();
    }
);