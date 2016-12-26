<?php

namespace Bkademy\Webpos\Model\AdminOrder;

use Bkademy\Webpos\Api\Data\Checkout\ItemBuyRequestInterface;

class Create extends \Magento\Sales\Model\AdminOrder\Create
{
    /**
     * @param string $quoteId
     * @return $this
     */
    public function start($quoteId){
        $session = $this->getSession();
        if($quoteId){
            $quote = $this->quoteRepository->get($quoteId, [$session->getStoreId()]);
        }else {
            $quote = $this->quoteFactory->create();
            $quote->setIsActive(false);
            $quote->setStoreId($session->getStoreId());
            $this->quoteRepository->save($quote);
            $quote->setIgnoreOldQty(true);
            $quote->setIsSuperMode(true);
        }
        $this->setQuote($quote);
        return $this;
    }

    /**
     * @param bool $saveQuote
     * @return $this
     */
    public function finish($saveQuote = true){
        if($saveQuote){
            $this->saveQuote();
        }
        return $this;
    }

    /**
     * @return $this
     */
    public function saveQuote()
    {
        $this->getQuote()->collectTotals();
        $this->quoteRepository->save($this->getQuote());
        return $this;
    }

    /**
     * Add multiple products to current quote
     *
     * @param $products
     * @return $this
     */
    public function addProducts(array $products)
    {
        foreach ($products as $productId => $infoBuy) {
            $config['qty'] = isset($infoBuy[ItemBuyRequestInterface::KEY_QTY]) ? (double)$infoBuy[ItemBuyRequestInterface::KEY_QTY] : 1;
            try {
                $this->addProduct($productId, $infoBuy);
            } catch (\Magento\Framework\Exception\LocalizedException $e) {
                throw new \Magento\Framework\Exception\LocalizedException(__($e->getMessage()));
            } catch (\Exception $e) {
                throw new \Magento\Framework\Exception\LocalizedException(__($e->getMessage()));
            }
        }
        return $this;
    }

    /**
     * @param \Bkademy\Webpos\Api\Data\Checkout\ItemBuyRequestInterface[] $items
     * @return $this
     */
    public function processItems($items){
        if(!empty($items)){
            $newItems = [];
            $quoteItems = [];
            $quote = $this->getQuote();
            foreach ($items as $item) {
                $quoteItem = $quote->getItemById($item->getItemId());
                if($quoteItem){
                    $quoteItems[$item->getItemId()] = $item->getData();
                }else{
                    $newItems[$item->getId()] = $item->getData();
                }
            }
            if(!empty($newItems)){
                $this->addProducts($newItems);
            }
            if(!empty($quoteItems)){
                $this->updateQuoteItems($quoteItems);
            }
        }
        return $this;
    }

    /**
     * Remove current quote
     */
    public function removeQuote(){
        $this->quoteRepository->delete($this->getQuote());
        return $this;
    }

    /**
     * @param $quoteData
     * @return $this
     */
    public function setQuoteData($quoteData){
        if(!empty($quoteData)){
            foreach ($quoteData as $data){
                $this->getQuote()->setData($data['key'], $data['value']);
            }
        }
        return $this;
    }

    /**
     * @param \Magento\Customer\Api\Data\CustomerInterface $customer
     * @return $this
     */
    public function assignCustomer($customer){
        if($customer){
            $this->getQuote()->setCustomerIsGuest(false);
            $this->getQuote()->assignCustomer($customer);
        }else{
            $this->getQuote()->setCustomerIsGuest(true);
        }
        return $this;
    }
}
