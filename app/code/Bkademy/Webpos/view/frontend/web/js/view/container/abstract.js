define([
    'ko',
    'uiComponent',
    'Bkademy_Webpos/js/model/container'
], function (ko, Component, Container) {
    'use strict';

    return Component.extend({
        defaults: {
            template: 'Bkademy_Webpos/container/default',
            container_id:""
        },
        initialize: function () {
            this._super();
            var self = this;
            this.containerId = ko.pureComputed(function(){
                return self.getContainerId();
            });
        },
        /**
         * Get container id
         * @returns {string}
         */
        getContainerId: function(){
            var self = this;
            var id = self.container_id;
            return Container.getContainerId(id);
        },
        /**
         * Show pos menu
         */
        showMenu: function(){
            Container.showMenu();
        }
    });
});