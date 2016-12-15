<?php
/**
 * Copyright © 2016 Bkademy. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Bkademy\Webpos\Controller\Test;

class OrderView extends \Magento\Framework\App\Action\Action
{
    public function execute()
    {
        /**
         * @var \Magento\Sales\Api\OrderRepositoryInterface $orderRepository
         */
        $orderRepository = $this->_objectManager->get('Magento\Sales\Api\OrderRepositoryInterface');

        $order = $orderRepository->get(100);

        $json = \Zend_Json::encode($order);

        echo $json;
    }
}