/*
 *  Copyright © 2016 Magestore. All rights reserved.
 *  See COPYING.txt for license details.
 *
 */

define(
    [
        'jquery'
    ],
    function ($) {
        "use strict";

        return {
            dispatch: function (eventName, data) {
                $("body").trigger(eventName, data);
            },
            observer: function (eventName, callback) {
                $("body").on(eventName, callback);
            }
        };
    }
);