/*
 *  Copyright © 2016 Magestore. All rights reserved.
 *  See COPYING.txt for license details.
 *
 */

define(
    [
        'jquery',
        'ko',
        'uiClass'
    ],
    function ($,ko, UiClass) {
        "use strict";
        return UiClass.extend({
            initialize: function () {
                this._super();
                this.initFields = [
                    'title',
                    'value',
                    'code'
                ];
            },
            init: function(data){
                var self = this;
                $.each(self.initFields, function(index, fieldKey){
                    self[fieldKey] = ko.observable((typeof data[fieldKey] != "undefined")?data[fieldKey]:'');
                })

                self.valueFormated = ko.pureComputed(function(){
                    var value = self.value();
                    return value;
                });
            },
            setData: function(key,value){
                if(typeof this[key] != "undefined"){
                    if(this.autoValue() == true){
                        if(key == 'value'){
                            this[key] = value;
                        }
                    }else{
                        this[key](value);
                    }
                }
            },
            getData: function(key){
                var self = this;
                var data = {};
                if(typeof key != "undefined"){
                    data = self[this]();
                }else{
                    var data = {};
                    $.each(this.initFields, function(){
                        data[this] = self[this]();
                    });
                }
                return data;
            },
        });
    }
);