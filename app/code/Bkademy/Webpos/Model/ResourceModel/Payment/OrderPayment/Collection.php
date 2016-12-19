<?php

/**
 *  Copyright © 2016 Bkademy. All rights reserved.
 *  See COPYING.txt for license details.
 *
 */

namespace Bkademy\Webpos\Model\ResourceModel\Payment\OrderPayment;

/**
 * class \Bkademy\Webpos\Model\ResourceModel\Payment\OrderPayment
 *
 * Web POS Products Collection resource model
 * Methods:
 *
 * @category    Bkademy
 * @package     Bkademy_Webpos
 * @module      Webpos
 * @author      Bkademy Developer
 */
class Collection extends \Magento\Framework\Model\ResourceModel\Db\Collection\AbstractCollection
{
    /**
     * Initialize collection resource model
     *
     * @return void
     */
    protected function _construct()
    {
        $this->_init('Bkademy\Webpos\Model\Payment\OrderPayment', 'Bkademy\Webpos\Model\ResourceModel\Payment\OrderPayment');
    }
}