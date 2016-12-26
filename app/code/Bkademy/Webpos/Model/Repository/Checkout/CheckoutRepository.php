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
     * @var \Magento\Framework\App\Config\ScopeConfigInterface
     */
    protected $_scopeConfig;

    /**
     * @var \Magento\Customer\Api\CustomerRepositoryInterface
     */
    protected $_customerRepository;

    /**
     * @var \Magento\Quote\Api\ShippingMethodManagementInterface
     */
    protected $_shippingMethodManagement;

    /**
     * @var \Magento\Quote\Api\PaymentMethodManagementInterface
     */
    protected $_paymentMethodManagement;

    /**
     * CheckoutRepository constructor.
     * @param \Bkademy\Webpos\Api\Data\Checkout\QuoteDataInterface $quoteDataInterface
     * @param \Bkademy\Webpos\Model\AdminOrder\Create $orderCreateModel
     * @param \Magento\Catalog\Helper\Image $catalogHelperImage
     * @param \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig
     * @param \Magento\Customer\Api\CustomerRepositoryInterface $customerRepository
     * @param \Magento\Quote\Api\ShippingMethodManagementInterface $shippingMethodManagement
     * @param \Magento\Quote\Api\PaymentMethodManagementInterface $paymentMethodManagement
     */
    public function __construct(
        \Bkademy\Webpos\Api\Data\Checkout\QuoteDataInterface $quoteDataInterface,
        \Bkademy\Webpos\Model\AdminOrder\Create $orderCreateModel,
        \Magento\Catalog\Helper\Image $catalogHelperImage,
        \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig,
        \Magento\Customer\Api\CustomerRepositoryInterface $customerRepository,
        \Magento\Quote\Api\ShippingMethodManagementInterface $shippingMethodManagement,
        \Magento\Quote\Api\PaymentMethodManagementInterface $paymentMethodManagement
    ) {
        $this->_quoteDataModel = $quoteDataInterface;
        $this->_orderCreateModel = $orderCreateModel;
        $this->_catalogHelperImage = $catalogHelperImage;
        $this->_scopeConfig = $scopeConfig;
        $this->_customerRepository = $customerRepository;
        $this->_shippingMethodManagement = $shippingMethodManagement;
        $this->_paymentMethodManagement = $paymentMethodManagement;
    }

    /**
     * @param int|null $quoteId
     * @param \Bkademy\Webpos\Api\Data\Checkout\ItemBuyRequestInterface[] $items
     * @param string $customerId
     * @param string[] $section
     * @return \Bkademy\Webpos\Api\Data\Checkout\QuoteDataInterface
     */
    public function saveCart($quoteId, $items, $customerId, $section){
        $customer = $this->_customerRepository->getById($customerId);
        $this->_orderCreateModel->start($quoteId);
        $this->_orderCreateModel->processItems($items);
        $this->_orderCreateModel->assignCustomer($customer);
        $this->_orderCreateModel->finish();
        return $this->_getQuoteData($section);
    }

    /**
     * @param string $quoteId
     * @return \Bkademy\Webpos\Api\Data\Checkout\QuoteDataInterface
     */
    public function removeCart($quoteId){
        $this->_orderCreateModel->start($quoteId);
        $this->_orderCreateModel->removeQuote();
        $this->_orderCreateModel->finish(false);
        return $this->_getQuoteData();
    }

    /**
     * @param string $quoteId
     * @param string $itemId
     * @return $this
     */
    public function removeItem($quoteId, $itemId){
        $this->_orderCreateModel->start($quoteId);
        $this->_orderCreateModel->removeQuoteItem($itemId);
        $this->_orderCreateModel->finish();
        return $this->_getQuoteData();
    }

    /**
     * @param string $quoteId
     * @param string $method
     * @return $this
     */
    public function saveShippingMethod($quoteId, $method){
        $this->_orderCreateModel->start($quoteId);
        $this->_orderCreateModel->setShippingMethod($method);
        $this->_orderCreateModel->finish();
        return $this->_getQuoteData();
    }

    /**
     * @param string $quoteId
     * @param string $method
     * @return $this
     */
    public function savePaymentMethod($quoteId, $method){
        $this->_orderCreateModel->start($quoteId);
        $this->_orderCreateModel->setPaymentMethod($method);
        $this->_orderCreateModel->finish();
        return $this->_getQuoteData();
    }

    /**
     * @param string $quoteId
     * @param string $quoteData
     * @return $this
     */
    public function saveQuoteData($quoteId, $quoteData){
        $this->_orderCreateModel->start($quoteId);
        $this->_orderCreateModel->finish();
        return $this->_getQuoteData();
    }

    /**
     * @param string $quoteId
     * @param string $customerId
     * @return $this
     */
    public function selectCustomer($quoteId, $customerId){
        $this->_orderCreateModel->start($quoteId);
        $this->_orderCreateModel->setCustomer($customerId);
        $this->_orderCreateModel->finish();
        return $this->_getQuoteData();
    }

    /**
     * @param string $quoteId
     * @param string $payment
     * @param string $quoteData
     * @return $this
     */
    public function placeOrder($quoteId, $payment, $quoteData){
        $this->_orderCreateModel
            ->start($quoteId)
            ->setPaymentData($payment)
            ->setQuoteData($quoteData);
        $order = $this->_orderCreateModel->createOrder();
        if(!$order){
            throw new \Magento\Framework\Exception\LocalizedException(__('Có gì đó sai sai'));
        }
        return $order->getData();
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
                $result[$item->getId()]['offline_item_id'] =  $item->getBuyRequest()->getData('item_id');
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
        $quote = $this->_orderCreateModel->getQuote();
        $cartId = $quote->getId();
//        $rates = $this->_shippingMethodManagement->getList($cartId);
//        if(count($rates) > 0){
//            foreach ($rates as $rate) {
//                $methodCode = $rate->getCode();
//                $methodTitle = $rate->getCarrierTitle().' - '.$rate->getMethodTitle();
//                $methodPrice = ($rate->getPrice() != null) ? $rate->getPrice() : '0';
//                $shippingList[] = [
//                    'code' => $methodCode,
//                    'title' => $methodTitle,
//                    'price' => $methodPrice
//                ];
//            }
//        }
        $shippingAddress = $quote->getShippingAddress();
        if (!$shippingAddress->getCountryId()) {
            throw new StateException(__('Shipping address not set.'));
        }
        $shippingAddress->collectShippingRates()->save();
        $shippingRates = $shippingAddress->getGroupedAllShippingRates();        foreach ($shippingRates as $carrierRates) {
            foreach ($carrierRates as $rate) {
                $methodCode = $rate->getCode();
                $methodTitle = $rate->getCarrierTitle().' - '.$rate->getMethodTitle();
                $methodPrice = ($rate->getPrice() != null) ? $rate->getPrice() : '0';
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
        $paymentList = array();
        $quote = $this->_orderCreateModel->getQuote();
        $methods =  $this->_paymentMethodManagement->getList($quote->getId());
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
