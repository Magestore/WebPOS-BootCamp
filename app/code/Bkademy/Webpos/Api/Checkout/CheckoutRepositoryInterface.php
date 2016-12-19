<?php

namespace Magestore\Webpos\Api\Checkout;

/**
 * Interface CartInterface
 * @package Magestore\Webpos\Api\Checkout
 */
interface CheckoutRepositoryInterface
{
    /**
     * @param int|null $quoteId
     * @param array|\Magento\Framework\DataObject $buyRequests
     * @param array|\Magento\Framework\DataObject $customerData
     * @param array|\Magento\Framework\DataObject $updateSections
     * @return $this
     */
    public function saveCart($quoteId, $buyRequests, $customerData, $updateSections);

    /**
     * @param string $quoteId
     * @return $this
     */
    public function removeCart($quoteId);

    /**
     * @param string $quoteId
     * @param string $itemId
     * @return $this
     */
    public function removeItem($quoteId, $itemId);

    /**
     * @param string $quoteId
     * @param string $method
     * @return $this
     */
    public function saveShippingMethod($quoteId, $method);

    /**
     * @param string $quoteId
     * @param string $method
     * @return $this
     */
    public function savePaymentMethod($quoteId, $method);

    /**
     * @param string $quoteId
     * @param string $quoteData
     * @return $this
     */
    public function saveQuoteData($quoteId, $quoteData);

    /**
     * @param string $quoteId
     * @param string $customerData
     * @return $this
     */
    public function selectCustomer($quoteId, $customerData);

    /**
     * @param string $quoteId
     * @param string $payment
     * @param string $quoteData
     * @return $this
     */
    public function placeOrder($quoteId, $payment, $quoteData);

}
