<?php

namespace Bkademy\Webpos\Model\AdminOrder;

class Create extends \Magento\Sales\Model\AdminOrder\Create
{
    /**
     * @param string $quoteId
     * @return $this
     */
    public function start($quoteId){
        $quote = $this->quoteFactory->create();
        $this->quoteRepository->load($quote, $quoteId);
        return $this;
    }

    /**
     * @return $this
     */
    public function finish(){
        $this->saveQuote();
        return $this;
    }

    /**
     * @return $this
     */
    public function saveQuote()
    {
        if ($this->_needCollect) {
            $this->getQuote()->collectTotals();
        }
        $this->quoteRepository->save($this->getQuote());
        return $this;
    }

}
