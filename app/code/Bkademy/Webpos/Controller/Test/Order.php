<?php
/**
 * Copyright © 2016 Bkademy. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace Bkademy\Webpos\Controller\Test;

class Order extends \Magento\Framework\App\Action\Action
{
    public function execute()
    {
        /**
         * @var \Magento\Sales\Api\OrderRepositoryInterface $orderRepository
         */
        $orderRepository = $this->_objectManager->get('Magento\Sales\Api\OrderRepositoryInterface');

        /**
         * @var \Magento\Framework\Api\SearchCriteriaBuilder $searchCriteriaBuilder
         */
        $searchCriteriaBuilder = $this->_objectManager->get('Magento\Framework\Api\SearchCriteriaBuilder');
        $searchCriteria = $searchCriteriaBuilder->create();
        $searchCriteria->setPageSize(10);
        $searchCriteria->setCurrentPage(1);
        $orders = $orderRepository->getList($searchCriteria);

        $json = \Zend_Json::encode($orders);

        echo $json;
    }
}