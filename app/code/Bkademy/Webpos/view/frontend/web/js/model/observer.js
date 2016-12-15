/*
 *  Copyright © 2016 Magestore. All rights reserved.
 *  See COPYING.txt for license details.
 *
 */

define(
    [
        'jquery',
        'Bkademy_Webpos/js/observer/catalog/category/load-product-by-category'
    ],
    function ($, 
            loadProductByCategory
    ) {
        "use strict";

        return {
            processEvent: function() {
                loadProductByCategory.execute();
            }
        };
    }
);