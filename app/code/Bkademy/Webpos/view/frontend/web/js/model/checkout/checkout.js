/*
 *  Copyright © 2016 Magestore. All rights reserved.
 *  See COPYING.txt for license details.
 *
 */

define(
    [
        'jquery',
        'ko',
        'Bkademy_Webpos/js/model/checkout/cart',
        'Bkademy_Webpos/js/model/event-manager',
        'Bkademy_Webpos/js/model/checkout/cart/totals',
        'Bkademy_Webpos/js/model/resource/checkout/checkout',
        'Bkademy_Webpos/js/model/data-manager'
    ],
    function ($, ko, CartModel, Event, Totals, CheckoutResource, DataManager) {
        "use strict";
        var storeAddress = DataManager.getData('webpos_store_address');
        if(storeAddress && storeAddress.length > 0){
            $.each(storeAddress,function(index, value){
                if(index == 'region_id'){
                    var region = {
                        region:value,
                        region_id:value,
                        region_code:""
                    }
                    storeAddress.region = region;
                }
            });
        }
        var CheckoutModel = {
            selectedPayments: ko.observableArray(),
            selectedShippingTitle: ko.observable(),
            selectedShippingCode: ko.observable(),
            paymentCode: ko.observable(),
            orderComment: ko.observable(),
            createShipment: ko.observable(),
            createInvoice: ko.observable(),
            billingAddress: ko.observable(),
            shippingAddress: ko.observable(),
            storeAddress: ko.observable(storeAddress),
            createOrderResult: ko.observable({}),
            loading: ko.observable(),
            remainTotal: ko.observable(),
            ADDRESS_TYPE: {
                BILLING:"billing",
                SHIPPING:"shipping"
            },
            isCreatedOrder: function(){
                return (this.createOrderResult() && this.createOrderResult().increment_id)?true:false;
            },

            initDefaultData: function(){
                var self = this;
                self.selectedShippingTitle('');
                self.selectedShippingCode('');
                self.orderComment("");
                self.createOrderResult({});
                self.useDefaultAddress(self.ADDRESS_TYPE.BILLING);
                self.useDefaultAddress(self.ADDRESS_TYPE.SHIPPING);
                self.initObservable();
            },
            initObservable: function(){
                var self = this;
                Event.observer('cart_empty_after', function(){
                    self.resetCheckoutData();
                });
                Event.observer('load_shipping', function(){
                    self.loadShipping();
                });
                Event.observer('load_payment', function(){
                    self.loadPaymentOnline();
                });
                self.billingAddress.subscribe(function(address){
                    CartModel.billingAddress(address);
                });
                self.shippingAddress.subscribe(function(address){
                    CartModel.shippingAddress(address);
                });
            },
            resetCheckoutData: function(){
                var self = this;
                self.createOrderResult({});
                self.useWebposShipping();
                self.orderComment("");
                CartModel.removeCustomer();
                self.useDefaultAddress(self.ADDRESS_TYPE.BILLING);
                self.useDefaultAddress(self.ADDRESS_TYPE.SHIPPING);
            },
            useWebposShipping: function(){
                var self = this;
                self.selectedShippingCode("webpos_shipping_storepickup");
            },
            saveShipping: function(data){
                var self = this;
                if(data.code){
                    self.saveShippingMethodOnline(data.code);
                }
            },
            saveBillingAddress: function(data){
                if(data.id == 0){
                    if (data.firstname && data.lastname) {
                        this.useDefaultAddress(this.ADDRESS_TYPE.BILLING, data.firstname, data.lastname);
                    } else {
                        this.useDefaultAddress(this.ADDRESS_TYPE.BILLING);
                    }
                    var newAddress = this.billingAddress();
                    newAddress.firstname = data.firstname;
                    newAddress.lastname = data.lastname;
                    this.billingAddress(newAddress);
                }else{
                    this.billingAddress(data);
                }
                CartModel.billingAddress(this.billingAddress());
            },
            updateBillingAddress: function(data){
                var address = this.billingAddress();
                if(typeof address == "undefined"){
                    address = {};
                }
                if(data && data.length > 0){
                    $.each(data,function(key, value){
                        address[key] = value;
                    });
                }
                this.billingAddress(address);
                CartModel.billingAddress(address);
            },
            updateStoreAddress: function(key,value){
                var address = this.storeAddress();
                if(typeof address == "undefined"){
                    address = {};
                }
                address[key] = value;
                this.storeAddress(address);
            },
            updateShippingAddress: function(data){
                var address = this.shippingAddress();
                if(typeof address == "undefined"){
                    address = {};
                }
                if(data && data.length > 0){
                    $.each(data,function(key, value){
                        address[key] = value;
                    });
                }
                this.shippingAddress(address);
            },
            saveShippingAddress: function(data){
                if(data.id == 0){
                    if (data.firstname && data.lastname) {
                        this.useDefaultAddress(this.ADDRESS_TYPE.SHIPPING, data.firstname, data.lastname);
                    } else {
                        this.useDefaultAddress(this.ADDRESS_TYPE.SHIPPING);
                    }
                    var newAddress = this.shippingAddress();
                    newAddress.firstname = data.firstname;
                    newAddress.lastname = data.lastname;
                    this.shippingAddress(newAddress);

                }else{
                    this.shippingAddress(data);
                }
            },
            useDefaultAddress: function(type, firstname, lastname){
                var self = this;
                var address = self.storeAddress();
                if(address){
                    if(type == self.ADDRESS_TYPE.SHIPPING){
                        self.shippingAddress(address);
                        self.updateShippingAddress({
                            'firstname':firstname,
                            'lastname':lastname
                        });
                    }else{
                        self.billingAddress(address);
                        self.updateBillingAddress({
                            'firstname':firstname,
                            'lastname':lastname
                        });
                    }
                }
            },
            saveShippingMethod: function(code){
                var deferred = $.Deferred();
                if(code){
                    var self = this;
                    var params = CartModel.getQuoteInitParams();
                    params.shipping_method = code;
                    self.loading(true);
                    CheckoutResource().saveShippingMethod(params,deferred);
                    deferred.always(function(){
                        self.loading(false);
                    });

                }
                return deferred;
            },
            savePaymentMethod: function(code){
                var deferred = $.Deferred();
                if(code){
                    var self = this;
                    var params = CartModel.getQuoteInitParams();
                    params.payment_method = code;
                    self.loading(true);
                    CheckoutResource().savePaymentMethod(params,deferred);
                    deferred.done(function(){
                        self.paymentCode(code);
                    }).always(function(){
                        self.loading(false);
                    });
                }
                return deferred;
            },
            placeOrder: function(){
                var self = this;
                var deferred = $.Deferred();
                var params = CartModel.getQuoteInitParams();
                params.payment_method = self.paymentCode();
                params.actions = {
                    create_invoice: self.createInvoice(),
                    create_shipment: self.createShipment()
                };
                self.loading(true);
                CheckoutResource().placeOrder(params,deferred);
                deferred.done(function(response){
                    if(response.status && response.data){
                        if(response.data.increment_id){
                            var message = __('Order has been created successfully ') + "#"+response.data.increment_id;
                            alert(message);
                        }
                        self.createOrderResult(response.data);
                    }
                }).always(function(){
                    self.loading(false);
                });
                return deferred;
            },

            selectCustomerOnline: function(){
                var self = this;
                var deferred = $.Deferred();
                var params = CartModel.getQuoteInitParams();
                params.customer = CartModel.getQuoteCustomerParams();
                self.loading(true);
                CheckoutResource().selectCustomer(params,deferred);
                deferred.always(function(){
                    self.loading(false);
                });
                return deferred;
            }
        };
        CheckoutModel.initDefaultData();
        return CheckoutModel;
    }
);