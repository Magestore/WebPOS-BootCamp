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
     * @param \Bkademy\Webpos\Api\Data\Checkout\ItemBuyRequestInterface[] $items
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
     * @return \Bkademy\Webpos\Api\Data\Checkout\QuoteDataInterface
     */
    public function removeItem($quoteId, $itemId);

    /**
     * @param string $quoteId
     * @param string $method
     * @return \Bkademy\Webpos\Api\Data\Checkout\QuoteDataInterface
     */
    public function saveShippingMethod($quoteId, $method);

    /**
     * @param string $quoteId
     * @param string $method
     * @return \Bkademy\Webpos\Api\Data\Checkout\QuoteDataInterface
     */
    public function savePaymentMethod($quoteId, $method);

    /**
     * @param string $quoteId
     * @param string $quoteData
     * @return \Bkademy\Webpos\Api\Data\Checkout\QuoteDataInterface
     */
    public function saveQuoteData($quoteId, $quoteData);

    /**
     * @param string $quoteId
     * @param string $customerId
     * @return \Bkademy\Webpos\Api\Data\Checkout\QuoteDataInterface
     */
    public function selectCustomer($quoteId, $customerId);

    /**
     * @param string $quoteId
     * @param string $payment
     * @param string $quoteData
     * @return $this
     */
    public function placeOrder($quoteId, $payment, $quoteData);

}
