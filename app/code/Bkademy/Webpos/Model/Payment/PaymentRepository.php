<?php

/**
 *  Copyright © 2016 Bkademy. All rights reserved.
 *  See COPYING.txt for license details.
 *
 */
namespace Bkademy\Webpos\Model\Payment;
/**
 * class \Bkademy\Webpos\Model\Payment\PaymnetRepository
 *
 * Methods:
 *
 * @category    Bkademy
 * @package     Bkademy_Webpos
 * @module      Webpos
 * @author      Bkademy Developer
 */
class PaymentRepository implements \Bkademy\Webpos\Api\Payment\PaymentRepositoryInterface
{
    /**
    * webpos payment source model
    *
    * @var \Bkademy\Webpos\Model\Source\Adminhtml\Payment
    */
    protected $_paymentModelSource;

    /**
    * webpos payment result interface
    *
    * @var \Bkademy\Webpos\Api\Data\Payment\PaymentResultInterfaceFactory
    */
    protected $_paymentResultInterface;

    /**
     * @param \Bkademy\Webpos\Model\Source\Adminhtml\Payment $paymentModelSource
     * @param \Bkademy\Webpos\Api\Data\Payment\PaymentResultInterfaceFactory $paymentResultInterface
     */
    public function __construct(
        \Bkademy\Webpos\Model\Source\Adminhtml\Payment $paymentModelSource,
        \Bkademy\Webpos\Api\Data\Payment\PaymentResultInterfaceFactory $paymentResultInterface
    ) {
        $this->_paymentModelSource = $paymentModelSource;
        $this->_paymentResultInterface = $paymentResultInterface;
    }

    /**
     * Get payments list
     *
     * @api
     * @return array|null
     */
    public function getList() {
        $paymentList = $this->_paymentModelSource->getPosPaymentMethods();
        $payments = $this->_paymentResultInterface->create();
        $payments->setItems($paymentList);
        $payments->setTotalCount(count($paymentList));
        return $payments;
    }
}