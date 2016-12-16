<?php

/**
 *  Copyright © 2016 Bkademy. All rights reserved.
 *  See COPYING.txt for license details.
 *
 */

namespace Bkademy\Webpos\Model\Payment\Method;

/**
 * class \Bkademy\Webpos\Model\Payment\Method\Cash
 * 
 * Web POS Cash payment method model
 * Methods:
 *  isAvailable
 * 
 * @category    Bkademy
 * @package     Bkademy_Webpos
 * @module      Webpos
 * @author      Bkademy Developer
 */
class Cash extends \Magento\Payment\Model\Method\AbstractMethod
{

    /**
     * Payment method code
     * @var string
     */
    protected $_code = 'cashforpos';

    /**
     * Class of info block 
     * @var string
     */
    protected $_infoBlockType = 'Bkademy\Webpos\Block\Payment\Method\Cash\Info\Cash';

    /**
     * Request object
     *
     * @var \Magento\Framework\App\Request\Http
     */
    protected $_request = '';
    
    /**
     * Helper payment object
     *
     * @var \Bkademy\Webpos\Helper\Payment
     */
    protected $_helperPayment = '';

    /**
     * @param \Magento\Framework\Model\Context $context
     * @param \Magento\Framework\Registry $registry
     * @param \Magento\Framework\Api\ExtensionAttributesFactory $extensionFactory
     * @param \Magento\Framework\Api\AttributeValueFactory $customAttributeFactory
     * @param \Magento\Payment\Helper\Data $paymentData
     * @param \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig
     * @param \Magento\Payment\Model\Method\Logger $logger
     * @param \Magento\Framework\App\Request\Http $request
     * @param \Bkademy\Webpos\Helper\Payment $helperPayment
     * @param \Magento\Framework\Model\ResourceModel\AbstractResource $resource
     * @param \Magento\Framework\Data\Collection\AbstractDb $resourceCollection
     * @param array $data
     * @SuppressWarnings(PHPMD.ExcessiveParameterList)
     */
    public function __construct(
        \Magento\Framework\Model\Context $context, 
        \Magento\Framework\Registry $registry, 
        \Magento\Framework\Api\ExtensionAttributesFactory $extensionFactory, 
        \Magento\Framework\Api\AttributeValueFactory $customAttributeFactory, 
        \Magento\Payment\Helper\Data $paymentData, 
        \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig, 
        \Magento\Payment\Model\Method\Logger $logger, 
        \Magento\Framework\App\Request\Http $request,
        \Bkademy\Webpos\Helper\Payment $helperPayment,
        \Magento\Framework\Model\ResourceModel\AbstractResource $resource = null, 
        \Magento\Framework\Data\Collection\AbstractDb $resourceCollection = null, 
        array $data = []
    ) {
        $this->_request = $request;
        $this->_helperPayment = $helperPayment;
        parent::__construct(
            $context, 
            $registry, 
            $extensionFactory, 
            $customAttributeFactory, 
            $paymentData, 
            $scopeConfig, 
            $logger, 
            $resource, 
            $resourceCollection, 
            $data
        );
    }
    
    /**
     * Enable for Web POS only
     * @return boolean
     */
    public function isAvailable(\Magento\Quote\Api\Data\CartInterface $quote = null)
    {
        $routeName = $this->_request->getRouteName();
        $settingEnabled = $this->_helperPayment->isCashPaymentEnabled();
        if ($routeName == "webpos" && $settingEnabled == true){
            return true;
        }else{
            return false;
        }
    }

}
