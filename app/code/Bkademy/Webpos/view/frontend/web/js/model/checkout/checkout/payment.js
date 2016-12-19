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
        'Bkademy_Webpos/js/model/checkout/checkout'
    ],
    function ($, ko, Event, CheckoutModel) {
        "use strict";
        var PaymentModel = {
            items: ko.observableArray([]),
            selectedPayments: CheckoutModel.selectedPayments,
            initialize: function(){
                var self = this;
                self.hasSelectedPayment = ko.pureComputed(function(){
                    return (self.selectedPayments().length > 0)?true:false;
                });
                Event.observer('load_payment_after', function(event, data){
                    if(data && data.items){
                        self.items(data.items);
                    }
                });
            },
            setPaymentMethod: function(data){
                var self = this;
                if(data && data.code){
                    CheckoutModel.savePaymentMethod(data.code);
                }
            },

            renewPayments: function () {
                var self = this;
                self.selectedPayments([]);
            }
        };
        PaymentModel.initialize();
        return PaymentModel;
    }
);