/*
 *  Copyright © 2016 Bkademy. All rights reserved.
 *  See COPYING.txt for license details.
 *
 */

define(
    [
        'jquery',
        'ko',
        'Bkademy_Webpos/js/model/collection/abstract',
        'Bkademy_Webpos/js/model/resource-model/magento-rest/sales/order/payment',
        'Bkademy_Webpos/js/model/resource-model/indexed-db/sales/order/payment'

    ],
    function ($,ko, collectionAbstract, paymentRest, paymentIndexedDb) {
        "use strict";

        return collectionAbstract.extend({
            /* Set Mode For Collection*/
            mode: 'offline',
            /* Query Params*/
            queryParams: {
                filterParams: [],
                orderParams: [],
                pageSize: '',
                currentPage: '',
                paramToFilter: []
            },
            
            initialize: function () {
                this._super();
                this.setResource(paymentRest(), paymentIndexedDb());
            }
        });
    }
);