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
        'Bkademy_Webpos/js/model/resource/checkout/checkout'
    ],
    function ($, ko, CartModel, Event, CheckoutResource) {
        "use strict";
        var CheckoutModel = {
            selectedPayments: ko.observableArray(),
            selectedShippingTitle: ko.observable(),
            selectedShippingCode: ko.observable(),
            paymentCode: ko.observable(),
            createOrderResult: ko.observable({}),
            loading: ko.observable(),
            isCreatedOrder: function(){
                return (this.createOrderResult() && this.createOrderResult().increment_id)?true:false;
            },

            initDefaultData: function(){
                var self = this;
                self.selectedShippingTitle('');
                self.selectedShippingCode('');
                self.createOrderResult({});
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
            },
            resetCheckoutData: function(){
                var self = this;
                self.createOrderResult({});
                self.useWebposShipping();
                CartModel.removeCustomer();
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