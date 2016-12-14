<?php

namespace Bkademy\Webpos\Model;

class Staff extends \Magento\Framework\Model\AbstractModel
{
    /**
     *
     */
    protected function _construct()
    {
        $this->_init('Bkademy\Webpos\Model\ResourceModel\Staff');
    }

}