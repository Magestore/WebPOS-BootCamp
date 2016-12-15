/*
 *  Copyright © 2016 Magestore. All rights reserved.
 *  See COPYING.txt for license details.
 *
 */

define(
    [
        'jquery',
        'ko',
        'uiComponent',
        'Bkademy_Webpos/js/model/checkout/checkout',
        'Bkademy_Webpos/js/model/event-Manager'
    ],
    function ($, ko, Component, CheckoutModel, Event) {
        "use strict";
        return Component.extend({
            defaults: {
                template: 'Bkademy_Webpos/checkout/checkout/success'
            },
            successMessage: ko.observable(),
            successImageUrl: ko.observable(),
            initialize: function () {
                this._super();
                this.orderData = ko.pureComputed(function(){
                    var result = CheckoutModel.createOrderResult();
                    return (result && result.increment_id)?result:false;
                });
                this.createdOrder = ko.pureComputed(function(){
                    var result = CheckoutModel.createOrderResult();
                    return (result && result.increment_id)?true:false;
                })
            },
            getOrderData: function(key){
                var orderData = this.orderData();
                var data = "";
                if(orderData){
                    data = orderData;
                    if(key){
                        if(typeof data[key] != "undefined"){
                            data = data[key];
                        }else{
                            data = "";
                        }
                    }
                }
                return data;
            },
            getCustomerEmail: function(){
                return this.getOrderData('customer_email');
            },
            getGrandTotal: function(){
                return this.getOrderData('grand_total');
            },
            getOrderIdMessage: function(){
                return "#"+this.getOrderData('increment_id');
            },
            printReceipt: function(){
                Event.dispatch('print_receipt', '');
            },
            startNewOrder: function(){
                CheckoutModel.resetCheckoutData();
                Event.dispatch('start_new_order', '');
            }
        });
    }
);