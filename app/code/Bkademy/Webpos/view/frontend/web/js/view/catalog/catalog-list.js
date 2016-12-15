/*
 *  Copyright © 2016 Magestore. All rights reserved.
 *  See COPYING.txt for license details.
 *
 */

define(
    [
        'jquery',
        'ko'
    ],
    function ($, ko) {
        "use strict";

        ko.bindingHandlers.sliderCategories = {
            init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                // This will be called when the binding is first applied to an element
                // Set up any initial state, event handlers, etc. here
                $('.catalog-header').click(function () {
                    if ($('#all-categories').hasClass('in')) {
                        $('#checkout_container .main-content').css('height', 'auto');
                        $('#checkout_container .main-content .wrap-list-product').css('height', 'calc(100vh - 135px)');
                    }
                    else {
                        var height_sum = $('#checkout_container .o-header-nav').height() + 200;
                        $('#checkout_container .main-content').css('height', 'auto');
                        $('.ms-webpos .main-content .wrap-list-product').css('height', 'calc(100vh - ' + height_sum + 'px)');
                    }
                });
                $('#all-categories').click(function () {
                    var height_nav = $('#checkout_container .o-header-nav').height();
                    var height_cat = $('#checkout_container #all-categories').height();
                    var height_sum = height_nav + height_cat - 4;
                    if ($('#all-categories').hasClass('no-cat')) {
                        height_sum = height_sum + 24;
                        $('#checkout_container .main-content').css('height', 'auto');
                        $('.ms-webpos .main-content .wrap-list-product').css('height', 'calc(100vh - 178px)');
                    }
                    else {
                        $('#checkout_container .main-content').css('height', 'auto');
                        $('.ms-webpos .main-content .wrap-list-product').css('height', 'calc(100vh - ' + height_sum + 'px)');
                    }
                });

                $('.category-name .root-cat').click(function () {
                    var height_nav = $('#checkout_container .o-header-nav').height();
                    var height_cat = $('#checkout_container #all-categories').height();
                    var height_sum = height_nav + height_cat;
                    height_sum = height_sum + 24;
                    $('#checkout_container .main-content').css('height', 'auto');
                    $('.ms-webpos .main-content .wrap-list-product').css('height', 'calc(100vh - 178px)');
                });
            },
            update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                // This will be called once when the binding is first applied to an element,
                // and again whenever any observables/computeds that are accessed change
                // Update the DOM element based on the supplied values here.

                viewModel.loadingCat(1);
                ko.unwrap(valueAccessor());
                var html = '';
                ko.utils.arrayForEach(valueAccessor().call(), function (item, key) {
                    html = html + '<div class="item" id="' + key + '">'
                        + '<div class="category-item-view-product img-cat">'
                        + '<a href="#">'
                        + '<img src="' + item.image + '" alt="' + item.name + '"/>'
                        + '</a>'
                        + '</div>';
                    if (item.children.length) {
                        html = html + '<div class="category-item-view-children collapsed"><h4 class="cat-name">' + item.name + '</h4>'
                            + '<span class="icon-iconPOS-dropdown"></span></div>';
                    }else {
                        html = html + '<h4 class="cat-name none-child">' + item.name + '</h4>';
                    }
                    html = html + '</div>';
                });
                element.innerHTML = html;
                if (element.innerHTML) {
                    $("#list-cat-header").owlCarousel({
                        items: 7,
                        itemsDesktop: [1000, 7],
                        itemsDesktopSmall: [900, 7],
                        itemsTablet: [600, 5],
                        itemsMobile: false,
                        navigation: true,
                        navigationText: ["", ""]
                    });
                }
                var value = valueAccessor();
                $('.category-item-view-product').each(function (index) {
                    $(this).on("click", function () {
                        viewModel.clickCatViewProduct(value()[$(this)[0].parentNode.id]);
                    });
                });
                $('.category-item-view-children').each(function (index) {
                    $(this).on("click", function () {
                        viewModel.clickCatViewChildren(value()[$(this)[0].parentNode.id]);
                    });
                });
                viewModel.loadingCat(0);
            }
        };
        return cellGrid.extend({
            model: category(),
            productList: null,
            items: ko.observableArray([]),
            className: ko.observable(''),
            loadingCat: ko.observable(''),
            parentId: '',
            columns: ko.observableArray([]),
            isShowHeader: false,
            isSearchable: true,
            pageSize: 10,
            curPage: 1,
            defaults: {
                template: 'Magestore_Webpos/catalog/category/cell-grid',
            },
            initialize: function () {
                this._super();
            }
        });
    }
);