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
        'Bkademy_Webpos/js/model/checkout/checkout/payment',
        'Bkademy_Webpos/js/model/checkout/cart',
        'Bkademy_Webpos/js/model/checkout/cart/totals',
        'Bkademy_Webpos/js/model/appConfig',
        'Magento_Catalog/js/price-utils',
        'mage/translate'
    ],
    function ($, ko, Component, CheckoutModel, PaymentModel, CartModel, Totals, AppConfig, PriceUtils, __) {
        "use strict";
        return Component.extend({
            defaults: {
                template: 'Bkademy_Webpos/checkout/checkout'
            },
            initialize: function(){
                this._super();
                var self = this;
                self.cannotAddPayment = ko.pureComputed(function(){
                    return (CheckoutModel.remainTotal() <= 0 || !PaymentModel.hasSelectedPayment())?true:false;
                });
            },
            loading: CheckoutModel.loading,
            cartTotal: ko.pureComputed(function(){
                return PriceUtils.formatPrice((Totals.getGrandTotal()) ? Totals.getGrandTotal():0, window.webposConfig.priceFormat);
            }),
            remainTotal: ko.pureComputed(function(){
                return PriceUtils.formatPrice((CheckoutModel.remainTotal()) ? Math.abs(CheckoutModel.remainTotal()) : 0, window.webposConfig.priceFormat);
            }),
            selectedShippingTitle: ko.pureComputed(function(){
                return (CheckoutModel.selectedShippingTitle())?CheckoutModel.selectedShippingTitle():"";
            }),
            selectedShippingCode: ko.pureComputed(function(){
                return (CheckoutModel.selectedShippingCode())?CheckoutModel.selectedShippingCode():"";
            }),
            shippingHeader: ko.pureComputed(function() {
                return "Shipping: "+CheckoutModel.selectedShippingTitle();
            }),
            shipAble: ko.pureComputed(function(){
                return (CartModel.isVirtual())?false:true;
            }),
            checkoutButtonLabel: ko.pureComputed(function(){
                var label = __("Place Order");
                return label;
            }),
            placeOrder: function(){
                if((!CheckoutModel.selectedPayments() || CheckoutModel.selectedPayments().length <= 0)
                    && Totals.grandTotal() > 0){
                    alert("Please select the payment method");
                    return false;
                }


                if(!CheckoutModel.selectedShippingCode()){
                    CheckoutModel.useWebposShipping();
                }

                if(!CartModel.hasQuote()){
                    alert("The quote does not exist for online checkout");
                    return false;
                }
                CheckoutModel.placeOrder();
                return true;
            },
            initCheckboxStyle: function(){
                $(".ios").iosCheckbox();
            },
            afterRenderCheckout: function(){
                CheckoutModel.initDefaultData();
            },
            createInvoice: function(data,event){
                var createInvoice = (event.target.checked) ? true : false;
                CheckoutModel.createInvoice(createInvoice);
            },
            createShipment: function(data,event){
                var createShipment = (event.target.checked)?true:false;
                CheckoutModel.createShipment(createShipment);
            }
        });
    }
);