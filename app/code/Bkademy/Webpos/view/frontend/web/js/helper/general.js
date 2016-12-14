/*
 *  Copyright © 2016 Bkademy. All rights reserved.
 *  See COPYING.txt for license details.
 *
 */
    
define([
    'jquery',
    'Bkademy_Webpos/js/helper/staff',
    'Bkademy_Webpos/js/helper/datetime',
    'mage/translate',
    'Bkademy_Webpos/js/helper/price',
    'Bkademy_Webpos/js/helper/alert',
    'Bkademy_Webpos/js/helper/datetime',
    'Bkademy_Webpos/js/action/notification/add-notification',
    'Bkademy_Webpos/js/model/event-manager',
    'Bkademy_Webpos/js/model/config/local-config'
], function ($, Staff, HelperDateTime, Translate, HelperPrice, Alert, HelperDatetime, AddNotification, EventManager, LocalConfig) {
    'use strict';
    return {
        alert: function(priority, title, message){
            if(typeof priority == 'string'){
                Alert({
                    priority: priority,
                    title: title,
                    message: message
                });
            }else{
                Alert(priority);
            }
        },
        convertAndFormatPrice: function(amount,from,to){
            return HelperPrice.convertAndFormat(amount,from,to);
        },
        convertAndFormatWithoutSymbol: function(amount,from,to){
            return HelperPrice.convertAndFormatWithoutSymbol(amount,from,to);
        },
        convertPrice: function(amount,from,to){
            return HelperPrice.currencyConvert(amount,from,to);
        },
        formatPrice: function(value){
            return HelperPrice.formatPrice(value);
        },
        formatPriceWithoutSymbol: function(value){
            return HelperPrice.formatPriceWithoutSymbol(value);
        },
        toBasePrice: function(value){
            return HelperPrice.toBasePrice(value);
        },
        toNumber: function(value){
            return HelperPrice.toNumber(value);
        },
        correctPrice: function(value){
            return HelperPrice.correctPrice(value);
        },
        getPriceHelper: function(){
            return HelperPrice;
        },
        __: function(string){
            return Translate(string);
        },
        getDatetimeHelper: function(){
            return HelperDatetime;
        },
        addNotification: function(message, showAlert, alertPriority, alertTitle){
            AddNotification(message, showAlert, alertPriority, alertTitle);
        },
        dispatchEvent: function(eventName, data, timeout){
            EventManager.dispatch(eventName, data, timeout);
        },
        observerEvent: function(eventName, function_callback){
            EventManager.observer(eventName, function_callback);
        },
        getObject: function(objectPath){

        },
        getBrowserConfig: function(path){
            return (window.webposConfig[path])?window.webposConfig[path]:"";
        },
        saveBrowserConfig: function(path, value){
            window.webposConfig[path] = value;
        },
        isHavePermission: function(resource){
            return Staff.isHavePermission(resource);
        },
        saveLocalConfig: function(configPath, value){
            LocalConfig.save(configPath, value);
        },
        getLocalConfig: function(configPath){
            return LocalConfig.get(configPath);
        },
        isStoreCreditEnable: function(){
            var plugin = this.getBrowserConfig('plugins');
            var plugins_config = this.getBrowserConfig('plugins_config');
            if(plugin && plugin.length > 0 && $.inArray('os_store_credit', plugin) !== -1){
                if(plugins_config && plugins_config['os_store_credit']){
                    return (plugins_config['os_store_credit']['customercredit/general/enable'])?true:false;
                }
            }
            return false;
        },
        isRewardPointsEnable: function(){
            var plugin = this.getBrowserConfig('plugins');
            var plugins_config = this.getBrowserConfig('plugins_config');
            if(plugin && plugin.length > 0 && $.inArray('os_reward_points', plugin) !== -1){
                if(plugins_config && plugins_config['os_reward_points']){
                    return (plugins_config['os_reward_points']['rewardpoints/general/enable'])?true:false;
                }
            }
            return false;
        },
        isGiftCardEnable: function(){
            var plugin = this.getBrowserConfig('plugins');
            var plugins_config = this.getBrowserConfig('plugins_config');
            if(plugin && plugin.length > 0 && $.inArray('os_gift_card', plugin) !== -1){
                if(plugins_config && plugins_config['os_gift_card']){
                    return (plugins_config['os_gift_card']['giftvoucher/general/active'])?true:false;
                }
            }
            return false;
        },
        getPluginConfig: function(pluginCode, path){
            var plugin = this.getBrowserConfig('plugins');
            var plugins_config = this.getBrowserConfig('plugins_config');
            if(plugin && plugin.length > 0 && $.inArray(pluginCode, plugin) !== -1){
                if(plugins_config && plugins_config[pluginCode]){
                    return plugins_config[pluginCode][path];
                }
            }
            return false;
        },
        isProductPriceIncludesTax: function(){
            return (window.webposConfig['tax/calculation/price_includes_tax'] == '1')?true:false;
        },
        isCartDisplayIncludeTax: function(type){
            if(type){
                var EXCLUDE = '1';
                var INCLUDE = '2';
                var BOTH = '3';
                switch (type){
                    case 'price':
                        return (window.webposConfig['tax/cart_display/price'] == EXCLUDE)?false:true;
                        break;
                    case 'subtotal':
                        return (window.webposConfig['tax/cart_display/subtotal'] == EXCLUDE)?false:true;
                        break;
                }
            }
            return true;
        }
    };
});