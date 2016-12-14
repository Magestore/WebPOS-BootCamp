<?php
/**
 * Copyright © 2016 Bkademy. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Bkademy\Webpos\Controller\Index;

class Index extends \Magento\Framework\App\Action\Action
{
    public function execute()
    {
        /**
         * @var \Magento\Sales\Api\OrderRepositoryInterface $orderRepository
         */
//        $orderRepository = $this->_objectManager->get('Magento\Sales\Api\OrderRepositoryInterface');
//
//        /**
//         * @var \Magento\Framework\Api\SearchCriteriaBuilder $searchCriteriaBuilder
//         */
//        $searchCriteriaBuilder = $this->_objectManager->get('Magento\Framework\Api\SearchCriteriaBuilder');
//        $searchCriteria = $searchCriteriaBuilder->create();
//        $searchCriteria->setPageSize(10);
//        $searchCriteria->setCurrentPage(1);
//        $orders = $orderRepository->getList($searchCriteria);

        $productRepository = $this->_objectManager->get('Bkademy\Webpos\Api\Catalog\ProductRepositoryInterface');

        /**
         * @var \Magento\Framework\Api\SearchCriteriaBuilder $searchCriteriaBuilder
         */
        $searchCriteriaBuilder = $this->_objectManager->get('Magento\Framework\Api\SearchCriteriaBuilder');
        $searchCriteria = $searchCriteriaBuilder->create();
        $searchCriteria->setPageSize(20);
        $searchCriteria->setCurrentPage(1);
        $product = $productRepository->getList($searchCriteria);


        $json = \Zend_Json::encode($product);

        echo $json;
    }
}