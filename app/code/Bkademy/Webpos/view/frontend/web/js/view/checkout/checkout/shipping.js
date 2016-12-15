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
        'Bkademy_Webpos/js/model/checkout/checkout/shipping'
    ],
    function ($, ko, Component, ShippingModel) {
        "use strict";
        return Component.extend({
            defaults: {
                template: 'Bkademy_Webpos/checkout/checkout/shipping',
            },
            items: ShippingModel.items,
            isSelected: ShippingModel.isSelected,
            setShippingMethod: function (data) {
                ShippingModel.saveShippingMethod(data);
            }
        });
    }
);