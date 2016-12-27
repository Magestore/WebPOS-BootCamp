define([
    'jquery',
    'ko',
    'Bkademy_Webpos/js/model/checkout/cart/items',
    'Bkademy_Webpos/js/model/checkout/cart/totals/total',
    'Bkademy_Webpos/js/model/event-manager'
],function($, ko, Items, Total, Event){
    var Totals = {
        totals: ko.observableArray(),
        initialize: function () {
            var self = this;
            self.initObserver();
            return this;
        },
        initObserver: function(){
            var self = this;
            Event.observer('cart_empty_after', function(event, data){
                self.totals([]);
            });
            Event.observer('load_totals_after', function(event, data){
                if(data && data.items){
                    self.updateTotalsFromQuote(data.items);
                }
            });
        },
        getGrandTotal: function(){
            return 0;
        },
        getTotals: function () {
            return this.totals();
        },
        setTotalData: function (totalCode, key, value) {
            var total = this.getTotal(totalCode);
            if (total != false) {
                total.setData(key, value);
            }
        },
        getTotalValue: function (totalCode) {
            var value = "";
            var total = this.getTotal(totalCode);
            if (total !== false) {
                value = total.value();
            }
            return value;
        },
        getTotal: function (totalCode) {
            var totalFound = ko.utils.arrayFirst(this.totals(), function (total) {
                return total.code() == totalCode;
            });
            return (totalFound) ? totalFound : false;
        },
        /**
         * Use totals from quote
         * @param totals
         */
        updateTotalsFromQuote: function(totals){
            if(totals && totals.length > 0){
                var self = this;
                var quoteTotals = [];
                $.each(totals, function(index, data){
                    var total = self.processQuoteTotals(data);
                    quoteTotals.push(total);
                });
                self.totals(quoteTotals);
            }
        },

        /**
         * Init total data
         * @param data
         * @returns {*}
         */
        processQuoteTotals: function(data){
            var self = this;
            var total = new Total();
            total.init({
                code: data.code,
                title: data.title,
                value: data.value
            });
            return total;
        }
    }
    return Totals.initialize();
});