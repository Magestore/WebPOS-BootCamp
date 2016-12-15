/*
 *  Copyright © 2016 Magestore. All rights reserved.
 *  See COPYING.txt for license details.
 *
 */

define(
    [
        'jquery',
        'Bkademy_Webpos/js/model/event-manager',
        'Bkademy_Webpos/js/view/catalog/catalog-list',
    ],
    function ($, eventManager, catalogList) {
        "use strict";

        return {
            /*
             * Update stock data to product list view after mass updated stock-item
             *
             */
            execute: function () {
                eventManager.observer('load_product_by_category', function (event, eventData) {
                    var catagory = catalogList();
                    var data = eventData.catagory;
                    catagory.clickCat(data);
                    if (eventData.open_category) {
                        $('#all-categories').addClass('in');
                    }
                });
            }
        }
    }
);