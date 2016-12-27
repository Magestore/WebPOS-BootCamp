<?php

/**
 *  Copyright © 2016 Bkademy. All rights reserved.
 *  See COPYING.txt for license details.
 *
 */
namespace Bkademy\Webpos\Model\Repository\Catalog;
/**
 * Catalog product model
 *
 * @method Product setHasError(bool $value)
 * @method \Magento\Catalog\Model\ResourceModel\Product getResource()
 * @method null|bool getHasError()
 * @method Product setAssociatedProductIds(array $productIds)
 * @method array getAssociatedProductIds()
 * @method Product setNewVariationsAttributeSetId(int $value)
 * @method int getNewVariationsAttributeSetId()
 * @method int getPriceType()
 * @method \Magento\Catalog\Model\ResourceModel\Product\Collection getCollection()
 * @method string getUrlKey()
 * @method Product setUrlKey(string $urlKey)
 * @method Product setRequestPath(string $requestPath)
 * @method Product setWebsiteIds(array $ids)
 *
 * @SuppressWarnings(PHPMD.LongVariable)
 * @SuppressWarnings(PHPMD.ExcessivePublicCount)
 * @SuppressWarnings(PHPMD.TooManyFields)
 * @SuppressWarnings(PHPMD.ExcessiveClassComplexity)
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 */
class Product extends \Magento\Catalog\Model\Product
    implements \Bkademy\Webpos\Api\Data\Catalog\ProductInterface
{

    /*
     * Product short description
     *
     * @return string|null
     */
    public function getShortDescription()
    {
        return $this->getData(self::SHORT_DESCRIPTION);
    }

    /**
     * Product description
     *
     * @return string|null
     */
    public function getDescription()
    {
        return $this->getData(self::DESCRIPTION);
    }


    public function getStock()
    {
        /** @var \Magento\CatalogInventory\Model\Stock\StockItemRepository $stockItemRepository */
        $stockItemRepository = \Magento\Framework\App\ObjectManager::getInstance()->create(
            '\Magento\CatalogInventory\Model\Stock\StockItemRepository'
        );
        try {
            $stockQty = $stockItemRepository->get($this->getId())->getQty();
            if ($stockQty) {
                return $stockQty;
            } else {
                return 0;
            }

        } catch (\Exception $w) {
            return 0;
        }
    }

    /**
     * Retrieve images
     *
     * @return array/null
     */
    public function getImages()
    {
        $product = $this;//->getProduct();
        $images = [];
        if (!empty($product->getMediaGallery('images'))) {
            foreach ($product->getMediaGallery('images') as $image) {
                if ((isset($image['disabled']) && $image['disabled']) || empty($image['value_id'])) {
                    continue;
                }
                $images[] = $this->getMediaConfig()->getMediaUrl($image['file']);
            }
        }
        return $images;
    }

    /**
     * Sets product image from it's child if possible
     *
     * @return string
     */
    public function getImage()
    {
        $imageString = parent::getImage();
        if ($imageString && $imageString != 'no_selection') {
            return $this->getMediaConfig()->getMediaUrl($imageString);
        } else {
            $storeManager = \Magento\Framework\App\ObjectManager::getInstance()->get(
                '\Magento\Store\Model\StoreManagerInterface'
            );
            $url = $storeManager->getStore()->getBaseUrl(\Magento\Framework\UrlInterface::URL_TYPE_MEDIA);
            return $url . 'webpos/catalog/category/image.jpg';
        }
    }

    /**
     *
     * @param string $price
     * @return string
     */
    public function formatPrice($price)
    {
        $pricingHelper = \Magento\Framework\App\ObjectManager::getInstance()->get(
            '\Magento\Framework\Pricing\Helper\Data'
        );
        return $pricingHelper->currency($price, true, false);
    }

    /**
     * Retrieve assigned category Ids
     *
     * @return array
     */
    public function getCategoryIds()
    {
        if (!$this->hasData('category_ids')) {
            $wasLocked = false;
            if ($this->isLockedAttribute('category_ids')) {
                $wasLocked = true;
                $this->unlockAttribute('category_ids');
            }
            //$ids = $this->_getResource()->getCategoryIds($this);
            $ids = $this->getShowedCategoryIds();
            $this->setData('category_ids', $ids);
            if ($wasLocked) {
                $this->lockAttribute('category_ids');
            }
        }

        if (is_array($this->_getData('category_ids')) && count($this->_getData('category_ids'))) {
            $catStrings = '';
            foreach ($this->_getData('category_ids') as $catId) {
                $catStrings .= '\'' . $catId . '\'';
            }
            return $catStrings;
        }

        if (!is_array($this->_getData('category_ids')) && count($this->_getData('category_ids'))) {
            return $this->_getData('category_ids');
        }
    }

}
