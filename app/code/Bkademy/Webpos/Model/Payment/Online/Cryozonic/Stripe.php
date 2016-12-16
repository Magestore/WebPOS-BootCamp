<?php
/**
 *  Copyright © 2016 Bkademy. All rights reserved.
 *  See COPYING.txt for license details.
 *
 */

namespace Bkademy\Webpos\Model\Payment\Online\Cryozonic;

/**
 * class \Bkademy\Webpos\Model\Payment\Online\Cryozonic\Stripe
 *
 *
 * @category    Bkademy
 * @package     Bkademy_Webpos
 * @module      Webpos
 * @author      Bkademy Developer
 */
if(file_exists(BP . "/app/code/Cryozonic/StripePayments/lib/stripe-php/vendor/autoload.php"))
    require_once BP . "/app/code/Cryozonic/StripePayments/lib/stripe-php/vendor/autoload.php";

use \Stripe\Stripe as CryozonicStripe;

class Stripe extends \Magento\Framework\Model\AbstractModel
{

    /**
     *
     * @var \Magento\Framework\ObjectManagerInterface
     */
    protected $_objectManager;

    /**
     * @param \Cryozonic\StripePayments\Helper\Api $api
     */
    public function __construct(
        \Magento\Framework\ObjectManagerInterface $objectManager
    ) {
        $this->_objectManager = $objectManager;
        $config = $this->_objectManager->get('\Cryozonic\StripePayments\Model\Config');
        CryozonicStripe::setApiKey($config->getSecretKey());
        CryozonicStripe::setApiVersion('2016-03-07');
    }

    /**
     * get authorize request information
     *
     * @param  $order
     * @return array
     */
    public function getPaymentToken($data)
    {
        $params = [
            "card" => [
                "name" => $data['cc_owner'],
                "number" => $data['cc_number'],
                "cvc" => $data['cc_cid'],
                "exp_month" => $data['cc_exp_month'],
                "exp_year" => $data['cc_exp_year']
            ]
        ];
        $token = $this->_objectManager->get('Cryozonic\StripePayments\Helper\Api')->createToken($params);
        return $token;
    }

}