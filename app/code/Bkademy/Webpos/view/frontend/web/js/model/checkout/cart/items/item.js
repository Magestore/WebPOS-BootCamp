/*
 *  Copyright © 2016 Magestore. All rights reserved.
 *  See COPYING.txt for license details.
 *
 */

define(
    [
        'jquery',
        'ko',
        'uiClass',
        'Magento_Catalog/js/price-utils'
    ],
    function ($, ko, UiClass, PriceUtils) {
        "use strict";
        return UiClass.extend({
            initialize: function () {
                this._super();
                this.initFields = [
                    'product_id',
                    'name',
                    'item_id',
                    'qty',
                    'unit_price',
                    'custom_price',
                    'image_url',
                    'saved_item'
                ];
            },
            init: function(data){
                var self = this;
                $.each(self.initFields, function(index, fieldKey){
                    self[fieldKey] = ko.observable((typeof data[fieldKey] != "undefined")?data[fieldKey]:'');
                })

                self.row_total = ko.pureComputed(function () {
                    var rowTotal = self.qty() * self.unit_price();
                    return rowTotal;
                });

                self.row_total_formated = ko.pureComputed(function () {
                    var rowTotal = self.row_total();
                    return PriceUtils.formatPrice(rowTotal, window.webposConfig.priceFormat);
                });
            },
            setData: function(key, value){
                var self = this;
                if($.type(key) == 'string') {
                    self[key](value);
                }else{
                    $.each(key, function(index, val){
                        self[index](val);
                    });
                }
            },
            getData: function(key){
                var self = this;
                var data = {};
                if(typeof key != "undefined"){
                    data = self[key]();
                }else{
                    var data = {};
                    $.each(self.initFields, function(){
                        data[this] = self[this]();
                    });
                }
                return data;
            },
            getInfoBuyRequest: function(){
                var self = this;
                var infobuy = {};
                infobuy.item_id = self.item_id();
                infobuy.id = self.product_id();
                infobuy.qty = self.qty();
                infobuy.custom_price = self.custom_price();
                return infobuy;
            }
        });
    }
);