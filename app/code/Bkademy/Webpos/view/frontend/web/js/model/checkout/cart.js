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
        'Bkademy_Webpos/js/model/data-manager',
        'Bkademy_Webpos/js/model/resource/checkout/cart'
    ],
    function ($, ko, Items, Totals, Event, DataManager, CartResource) {
        "use strict";
        var CartModel = {
            loading: ko.observable(),
            currentPage: ko.observable(),
            customerId: ko.observable(''),
            BACK_CART_BUTTON_CODE: "back_to_cart",
            CHECKOUT_BUTTON_CODE: "checkout",
            PAGE:{
                CART:"cart",
                CHECKOUT:"checkout"
            },
            KEY: {
                ITEMS:'items',
                SHIPPING:'shipping',
                PAYMENT:'payment',
                TOTALS:'totals',
                QUOTE_ID:"quote_id",
                CUSTOMER_ID:"customer_id"
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
                self.initDefaultData();
                return self;
            },
            initObserver: function(){
                var self = this;
                self.isOnCheckoutPage = ko.pureComputed(function(){
                    return (self.currentPage() == self.PAGE.CHECKOUT)?true:false;
                });
                Event.observer('init_quote_after', function(event, response){
                    self.saveQuoteData(response);
                });
            },
            initDefaultData: function(){
                var self = this;
                self.customerId(1);
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
                this.customerId(data.id);
            },
            removeCustomer: function(){
                var self = this;
                self.customerId("");
                Event.dispatch('cart_remove_customer_after','');
            },
            removeItem: function(itemId){
                Items.removeItem(itemId);
                if(Items.items().length == 0){
                    Totals.totals.removeAll();
                }
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
            totalItems: function(){
                return Items.totalItems();
            },
            resetQuoteInitData: function(){
                var self = this;
                var data = {
                    quote_id: 0
                };
                self.saveQuoteData(data);
            },
            getQuoteInitParams: function(){
                var self = this;
                var quoteId = DataManager.getData(self.KEY.QUOTE_ID);
                return {
                    quote_id: (quoteId)?quoteId:0
                };
            },
            /**
             * Save cart and dispatch events
             * @returns {*}
             */
            saveQuoteBeforeCheckout: function(){
                var self = this;
                var params = self.getQuoteInitParams();
                params.items = self.getItemsInfo();
                params.customer_id = (self.customerId())?self.customerId():0;
                params.section = [];
                self.loading(true);
                var apiRequest = $.Deferred();
                CartResource().saveQuoteBeforeCheckout(params, apiRequest);

                apiRequest.always(function(){
                    self.loading(false);
                });
                return apiRequest;
            },
            /**
             * Call API to empty cart - remove quote
             * @returns {*}
             */
            removeQuote: function(){
                var self = this;
                var params = self.getQuoteInitParams();
                self.loading(true);
                var apiRequest = $.Deferred();
                CartResource().removeQuote(params, apiRequest);

                apiRequest.done(
                    function (response) {
                        if(response.status == self.DATA.STATUS.SUCCESS){
                            self.emptyCart();
                        }
                    }
                ).always(function(){
                    self.loading(false);
                });
                return apiRequest;
            },
            /**
             * Call API to remove cart item online
             * @param itemId
             * @returns {*}
             */
            removeQuoteItem: function(itemId){
                var self = this;
                if(Items.items().length == 1){
                    return self.removeCartOnline();
                }

                var params = self.getQuoteInitParams();
                params.item_id = itemId;

                self.loading(true);
                var apiRequest = $.Deferred();
                CartResource().removeQuoteItem(params, apiRequest);

                apiRequest.done(
                    function (response) {
                        if(response.status == self.DATA.STATUS.SUCCESS){
                            self.removeItem(itemId);
                        }
                    }
                ).always(function(){
                    self.loading(false);
                });
                return apiRequest;
            },
            /**
             * Check if cart has been saved online or not
             * @returns {boolean}
             */
            hasQuote: function(){
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