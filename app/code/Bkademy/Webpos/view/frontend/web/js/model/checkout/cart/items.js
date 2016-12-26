/*
 *  Copyright © 2016 Magestore. All rights reserved.
 *  See COPYING.txt for license details.
 *
 */

define(
    [
        'jquery',
        'ko',
        'Bkademy_Webpos/js/model/checkout/cart/items/item',
        'Bkademy_Webpos/js/model/event-manager'
    ],
    function ($, ko, Item, Event) {
        "use strict";
        var Items = {
            items: ko.observableArray(),
            initialize: function () {
                var self = this;
                self.isEmpty = ko.pureComputed(function(){
                    return (self.items().length > 0)?false:true;
                });
                Event.observer('load_items_after', function(event, data){
                    if(data && data.items){
                        self.updateItemsFromQuote(data.items);
                    }
                });
                return self;
            },
            getItems: function(){
                return this.items();
            },
            getAddedItem: function(data){
                var isNew = false;
                if(typeof data.item_id != "undefined"){
                    var foundItem = ko.utils.arrayFirst(this.items(), function(item) {
                        return (item.item_id() == data.item_id);
                    });
                    if(foundItem){
                        return foundItem;
                    }
                }else{
                    var foundItem = ko.utils.arrayFirst(this.items(), function(item) {
                        return (item.product_id() == data.product_id);
                    });
                    if(foundItem){
                        return foundItem;
                    }
                }
                return isNew;
            },
            addItem: function(data){
                var item = this.getAddedItem(data);
                if(item === false){
                    data.item_id = (data.item_id)?data.item_id:$.now();
                    data.qty = (data.qty)?data.qty:1;
                    var item = new Item();
                    item.init(data);
                    this.items.push(item);
                }else{
                    var qty = item.qty();
                    qty += data.qty;
                    this.setItemData(item.item_id(), "qty", qty);
                }
            },
            getItem: function(itemId){
                var item = false;
                var foundItem = ko.utils.arrayFirst(this.items(), function(item) {
                    return (item.item_id() == itemId);
                });
                if(foundItem){
                    item = foundItem;
                }
                return item;
            },
            getItemData: function(itemId, key){
                var item = this.getItem(itemId);
                if(item != false && typeof item[key] != "undefined"){
                    return item[key]();
                }
                return "";
            },
            setItemData: function(itemId, key, value){
                var item = this.getItem(itemId);
                if(item != false){
                    item.setData(key,value);
                }
            },
            removeItem: function(itemId){
                this.items.remove(function (item) {
                    return item.item_id() == itemId;
                });
            },
            totalItems: function(){
                var total = 0;
                if(this.items().length > 0){
                    ko.utils.arrayForEach(this.items(), function(item) {
                        total += parseFloat(item.qty());
                    });
                }
                return total;
            },
            totalShipableItems: function(){
                var total = 0;
                if(this.items().length > 0){
                    var shipItems = ko.utils.arrayFilter(this.items(), function(item) {
                        return (item.is_virtual() == false);
                    });
                    if(shipItems.length > 0){
                        ko.utils.arrayForEach(shipItems, function(item) {
                            total += item.qty();
                        });
                    }
                }
                return total;
            },
            updateItemsFromQuote: function(quoteItems){
                if(quoteItems){
                    var self = this;
                    $.each(quoteItems, function(index, itemData){
                        if(itemData.offline_item_id){
                            var itemId = itemData.item_id;
                            var unitPrice = (itemData.base_original_price)?itemData.base_original_price:itemData.base_price;
                            var elementItemId = (itemData.offline_item_id == itemId)?itemId:itemData.offline_item_id;
                            var data = {};
                            data.item_id = elementItemId;
                            data.unit_price = parseFloat(unitPrice);
                            data.name = itemData.name;
                            data.qty = parseFloat(itemData.qty);
                            data.image_url = itemData.image_url;
                            data.saved_item = true;
                            var added = self.getAddedItem({item_id: itemData.offline_item_id}) || self.getAddedItem({item_id: itemId});
                            if(added === false){
                                data.item_id = itemId;
                                self.addItem(data);
                            }else{
                                data.item_id = itemId;
                                self.setItemData(elementItemId, data);
                                self.setItemData(itemId, data);
                            }
                        }
                    });
                }
            }
        }
        return Items.initialize();
    }
);