<?php

namespace Bkademy\Webpos\Model\Repository\Checkout;

class CheckoutRepository implements \Bkademy\Webpos\Api\Checkout\CheckoutRepositoryInterface
{
    /**
     * @var \Bkademy\Webpos\Api\Data\Checkout\QuoteDataInterface
     */
    protected $_quoteDataModel;

    /**
     * @var Bkademy\Webpos\Model\AdminOrder\Create
     */
    protected $_orderCreateModel;

    /**
     * @var \Magento\Catalog\Helper\Image
     */
    protected $_catalogHelperImage;

    /**
     * @var \Magento\Payment\Model\MethodList
     */
    protected $_paymentMethodList;

    /**
     * @var \Magento\Framework\App\Config\ScopeConfigInterface
     */
    protected $_scopeConfig;

    /**
     * CheckoutRepository constructor.
     * @param \Bkademy\Webpos\Api\Data\Checkout\QuoteDataInterface $quoteDataInterface
     * @param \Bkademy\Webpos\Model\AdminOrder\Create $orderCreateModel
     * @param \Magento\Catalog\Helper\Image $catalogHelperImage
     * @param \Magento\Payment\Model\MethodList $paymentMethodList
     * @param \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig
     */
    public function __construct(
        \Bkademy\Webpos\Api\Data\Checkout\QuoteDataInterface $quoteDataInterface,
        \Bkademy\Webpos\Model\AdminOrder\Create $orderCreateModel,
        \Magento\Catalog\Helper\Image $catalogHelperImage,
        \Magento\Payment\Model\MethodList $paymentMethodList,
        \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig
    ) {
        $this->_quoteDataModel = $quoteDataInterface;
        $this->_orderCreateModel = $orderCreateModel;
        $this->_catalogHelperImage = $catalogHelperImage;
        $this->_paymentMethodList = $paymentMethodList;
        $this->_scopeConfig = $scopeConfig;
    }

    /**
     * @param int|null $quoteId
     * @param array|\Magento\Framework\DataObject $items
     * @param string $customerId
     * @param string[] $section
     * @return \Bkademy\Webpos\Api\Data\Checkout\QuoteDataInterface
     */
    public function saveCart($quoteId, $items, $customerId, $section){
        $this->_orderCreateModel->start($quoteId);
        $this->_orderCreateModel->finish();
        return $this->_getQuoteData();
    }

    /**
     * @param string $quoteId
     * @return \Bkademy\Webpos\Api\Data\Checkout\QuoteDataInterface
     */
    public function removeCart($quoteId){
        $this->_orderCreateModel->start($quoteId);
        $this->_orderCreateModel->finish();
        return $this->_getQuoteData();
    }

    /**
     * @param string $quoteId
     * @param string $itemId
     * @return $this
     */
    public function removeItem($quoteId, $itemId){
        $this->_orderCreateModel->start($quoteId);
        $this->_orderCreateModel->finish();
    }

    /**
     * @param string $quoteId
     * @param string $method
     * @return $this
     */
    public function saveShippingMethod($quoteId, $method){
        $this->_orderCreateModel->start($quoteId);
        $this->_orderCreateModel->finish();
    }

    /**
     * @param string $quoteId
     * @param string $method
     * @return $this
     */
    public function savePaymentMethod($quoteId, $method){
        $this->_orderCreateModel->start($quoteId);
        $this->_orderCreateModel->finish();
    }

    /**
     * @param string $quoteId
     * @param string $quoteData
     * @return $this
     */
    public function saveQuoteData($quoteId, $quoteData){
        $this->_orderCreateModel->start($quoteId);
        $this->_orderCreateModel->finish();
    }

    /**
     * @param string $quoteId
     * @param string $customerData
     * @return $this
     */
    public function selectCustomer($quoteId, $customerData){
        $this->_orderCreateModel->start($quoteId);
        $this->_orderCreateModel->finish();
    }

    /**
     * @param string $quoteId
     * @param string $payment
     * @param string $quoteData
     * @return $this
     */
    public function placeOrder($quoteId, $payment, $quoteData){
        $this->_orderCreateModel->start($quoteId);
        $this->_orderCreateModel->finish();
    }

    /**
     * @param $sections
     * @param $model
     * @return array
     */
    protected function _getQuoteData($sections = array()){
        $data = array();
        if(empty($sections) || $sections == 'quote_id' || (is_array($sections) && in_array('quote_id', $sections))){
            $data['quote_id'] = $this->_orderCreateModel->getQuote()->getId();
        }
        if(empty($sections) || $sections == 'items' || (is_array($sections) && in_array('items', $sections))){
            $data['items'] = $this->_getQuoteItems();
        }
        if(empty($sections) || $sections == 'totals' || (is_array($sections) && in_array('totals', $sections))){
            $data['totals'] = $this->_getTotals();
        }
        if(empty($sections) || $sections == 'shipping' || (is_array($sections) && in_array('shipping', $sections))){
            $data['shipping'] = $this->_getShipping();
        }
        if(empty($sections) || $sections == 'payment' || (is_array($sections) && in_array('payment', $sections))){
            $data['payment'] = $this->_getPayment();
        }
        return $this->_quoteDataModel->setData($data);
    }

    /**
     * @return array
     */
    protected function _getQuoteItems(){
        $result = array();
        $items = $this->_orderCreateModel->getQuote()->getAllVisibleItems();
        if(count($items)){
            foreach ($items as $item){
                $result[$item->getId()] = $item->getData();
                $result[$item->getId()]['image_url'] =  $this->_catalogHelperImage->init($item->getProduct(), 'thumbnail')->resize('500')->getUrl();
            }
        }
        return $result;
    }

    /**
     * @return array
     */
    protected function _getTotals(){
        $totals = $this->_orderCreateModel->getQuote()->getTotals();
        $totalsResult = array();
        foreach ($totals as $total) {
            $totalsResult[] = $total->getData();
        }
        return $totalsResult;
    }

    /**
     * @return array
     */
    protected function _getShipping(){
        $shippingList = array();
        $quoteShippingAddress = $this->_orderCreateModel->getQuote()->getShippingAddress();
        if (is_null($quoteShippingAddress->getId())) {
            throw new \Magento\Framework\Exception\LocalizedException(__('Shipping address is not set'));
        }
        try {
            $quoteShippingAddress->collectShippingRates()->save();
            $groupedRates = $quoteShippingAddress->getGroupedAllShippingRates();
            $ratesResult = array();
            foreach ($groupedRates as $carrierCode => $rates ) {
                $carrierName = $carrierCode;
                $carrierTitle = $this->_getStoreConfig('carriers/'.$carrierCode.'/title');
                if (!is_null($carrierTitle)) {
                    $carrierName = $carrierTitle;
                }

                foreach ($rates as $rate) {
                    $rateItem = $rate->getData();
                    $rateItem['carrierName'] = $carrierName;
                    $ratesResult[] = $rateItem;
                    unset($rateItem);
                }
            }
        } catch (\Magento\Framework\Exception\LocalizedException $e) {
            throw new \Magento\Framework\Exception\LocalizedException(__('Shipping methods list could not be retrived') . ': ' . $e->getMessage());
        }
        if(count($ratesResult) > 0){
            foreach ($ratesResult as $data) {
                $methodCode = $data['code'];
                $methodTitle = $data['carrier_title'].' - '.$data['method_title'];
                $methodPrice = ($data['price'] != null) ? $data['price'] : '0';
                $shippingList[] = [
                    'code' => $methodCode,
                    'title' => $methodTitle,
                    'price' => $methodPrice
                ];
            }
        }
        return $shippingList;
    }

    /**
     * @return mixed
     */
    protected function _getPayment(){
        $quote = $this->_orderCreateModel->getQuote();
        $paymentList = array();
        $methods =  $this->_paymentMethodList->getAvailableMethods($quote);
        foreach ($methods as $method) {
            $paymentList[] = array(
                'code' => $method->getCode(),
                'title' => $method->getTitle(),
            );
        };
        return $paymentList;
    }

    /**
     * @param $path
     * @return mixed
     */
    protected function _getStoreConfig($path){
        return $this->_scopeConfig->getValue(
            $path,
            \Magento\Store\Model\ScopeInterface::SCOPE_STORE
        );
    }
}
