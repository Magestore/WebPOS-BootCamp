/*
 *  Copyright © 2016 Magestore. All rights reserved.
 *  See COPYING.txt for license details.
 *
 */

define(
    [
        'jquery',
        'ko',
        'Bkademy_Webpos/js/model/event-manager',
        'Bkademy_Webpos/js/model/checkout/checkout',
        'Bkademy_Webpos/js/model/checkout/cart'
    ],
    function ($, ko, Event, CheckoutModel, CartModel) {
        "use strict";
        var ShippingModel = {
            /**
             * Shipping methods
             */
            items: ko.observableArray([]),
            /**
             * Check selected shipping method
             */
            isSelected: ko.pureComputed(function(){
                return CheckoutModel.selectedShippingCode();
            }),
            /**
             * Initialize
             */
            initialize: function(){
                var self = this;
                Event.observer('load_shipping_after', function(event, data){
                    if(data && data.items){
                        self.items(data.items);
                        if(CheckoutModel.selectedShippingCode()){
                            self.reSaveShippingMethod();
                        }
                    }
                });
            },
            /**
             * Save shipping method
             * @param data
             */
            saveShippingMethod: function (data) {
                CheckoutModel.saveShipping(data);
            },
            /**
             * get selected shipping method
             * @returns {*}
             */
            getSelectedShippingMethod: function () {
                var shippingList = this.items();
                if(shippingList.length > 0){
                    var selectedShippingCode = CheckoutModel.selectedShippingCode();
                    var method = false;
                    for(var i = 0; i < shippingList.length; i++){
                        if(shippingList[i].code == selectedShippingCode) {
                            method = shippingList[i];
                            break;
                        }
                    }
                    if(method == false){
                        CheckoutModel.selectedShippingCode('');
                        CheckoutModel.selectedShippingTitle('');
                    }else{
                        return method;
                    }
                }
                return false;
            },
            reSaveShippingMethod: function(){
                var self = this;
                var selectedMethod = self.getSelectedShippingMethod();
                if(selectedMethod && !CartModel.isVirtual()){
                    self.saveShippingMethod(selectedMethod);
                }
            }
        };
        ShippingModel.initialize();
        return ShippingModel;
    }
);