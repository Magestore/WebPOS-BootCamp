<?php
/**
 *  Copyright © 2016 Bkademy. All rights reserved.
 *  See COPYING.txt for license details.
 *
 */

namespace Bkademy\Webpos\Model\Payment;

/**
 * Class Bkademy\Webpos\Model\Payment\Payment
 *
 */
class Payment extends \Magento\Framework\Model\AbstractModel implements
    \Bkademy\Webpos\Api\Data\Payment\PaymentInterface
{
    /**
     * Set code
     *
     * @api
     * @param string $code
     * @return $this
     */
    public function setCode($code)
    {
        return $this->setData(self::CODE, $code);
    }

    /**
     * Get code
     *
     * @api
     * @return string
     */
    public function getCode()
    {
        return $this->_get(self::CODE);
    }

    /**
     * Set title
     *
     * @api
     * @param string $title
     * @return $this
     */
    public function setTitle($title)
    {
        return $this->setData(self::TITLE, $title);
    }

    /**
     * Get title
     *
     * @api
     * @return string|null
     */
    public function getTitle()
    {
        return $this->_get(self::TITLE);
    }


    /**
     * Set type
     *
     * @api
     * @param string $type
     * @return $this
     */
    public function setType($type)
    {
        return $this->setData(self::TYPE, $type);
    }

    /**
     * Get type
     *
     * @api
     * @return string
     */
    public function getType()
    {
        return $this->_get(self::TYPE);
    }

    /**
     * Set information
     *
     * @api
     * @param string $information
     * @return $this
     */
    public function setInformation($information)
    {
        return $this->setData(self::INFORMATION, $information);
    }

    /**
     * Get information
     *
     * @api
     * @return string|null
     */
    public function getInformation()
    {
        return $this->_get(self::INFORMATION);
    }

}
