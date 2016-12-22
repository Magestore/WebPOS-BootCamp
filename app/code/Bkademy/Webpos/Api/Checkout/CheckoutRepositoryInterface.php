<?php

namespace Bkademy\Webpos\Api\Checkout;

/**
 * Interface CheckoutRepositoryInterface
 * @package Bkademy\Webpos\Api\Checkout
 */
interface CheckoutRepositoryInterface
{
    /**
     * @param string|null $quoteId
     * @param \Magento\Framework\DataObject $items
     * @param string $customerId
     * @param string[] $section
     * @return \Bkademy\Webpos\Api\Data\Checkout\QuoteDataInterface
     */
    public function saveCart($quoteId, $items, $customerId, $section);

    /**
     * @param string $quoteId
     * @return \Bkademy\Webpos\Api\Data\Checkout\QuoteDataInterface
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
