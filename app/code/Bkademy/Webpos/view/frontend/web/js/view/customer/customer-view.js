/**
 * Copyright © 2016 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */
define([
    'jquery',
    'ko',
    'uiComponent',
    'mage/storage',
    'Bkademy_Webpos/js/model/url-builder',
    'mage/translate',
], function ($, ko, Component, storage, urlBuilder, $t) {
    'use strict';

    return Component.extend({
        defaults: {
            template: 'Bkademy_Webpos/customer/customer-view'
        },

        customerData: ko.observableArray([]),
        customerGroupArray: [],

        currentFirstName: ko.observable(''),
        currentLastName: ko.observable(''),
        currentEmail: ko.observable(''),
        currentGroupId: ko.observable(''),

        getData: function(){
            return this.customerData();
        },

        setData: function(data){
            this.customerData(data);
            this.currentFirstName(data.firstname);
            this.currentLastName(data.lastname);
            this.currentEmail(data.email);
            this.currentGroupId(data.group_id);
        },

        showEdit: function(){

        },

        isEditInformation: function() {
            return false;
        },

        /* Save Customer Information When Edit*/
        saveInformation: function () {
            var self = this;
            if (this.validateForm('#customer-edit-form')) {
                var customerData = this.customerData.call();
                customerData.firstname = this.currentFirstName();
                customerData.lastname = this.currentLastName();
                customerData.full_name = this.currentFirstName() + ' ' + this.currentLastName();
                customerData.email = this.currentEmail();
                customerData.group_id = this.currentGroupId();

                var params = {};
                var serviceUrl = urlBuilder.createUrl('/webpos/customers/'+ customerData.id, params);
                var payload = {
                    customer: {
                        firstname: customerData.firstname,
                        lastname: customerData.lastname,
                        email: customerData.email,
                        group_id: customerData.group_id
                    }
                };
                storage.put(
                    serviceUrl, JSON.stringify(payload)
                ).done(function (response) {
                    console.log(response);
                }).fail(function (response) {

                }).always(function (response){

                });
            }
        },

        /* Validation Form*/
        validateForm: function (form) {
            return true;
            return $(form).validation() && $(form).validation('isValid');
        },

        /* Resize address after render*/
        resizeAddress: function () {
            var allAddressDiv = $('#customer-edit-form').find('.info-address-edit');
            var maxHeight = 0;
            $.each(allAddressDiv, function (index, value) {
                if ($(value).height() >= maxHeight) {
                    maxHeight = $(value).height();
                }
            });
            allAddressDiv.height(maxHeight);
        },

    });
});