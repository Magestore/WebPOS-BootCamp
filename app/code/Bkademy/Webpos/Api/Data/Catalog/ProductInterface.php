<?php
namespace Bkademy\Webpos\Api\Data\Catalog;

/**
 * @api
 */
interface ProductInterface
{
    /**#@+
     * Constants defined for keys of  data array
     */

    const SPECIAL_PRICE = 'special_price';
    const SPECIAL_FROM_DATE = 'special_from_date';
    const SPECIAL_TO_DATE = 'special_to_date';
    const SHORT_DESCRIPTION = 'short_description';
    const DESCRIPTION = 'description';
    const MEDIA_GALLERY = 'media_gallery';
    const TAX_CLASS_ID = 'tax_class_id';

    /**#@-*/

    /**
     * Product id
     *
     * @return int|null
     */
    public function getId();

    /**
     * Product type id
     *
     * @return string|null
     */
    public function getTypeId();

    /**
     * Product sku
     *
     * @return string
     */
    public function getSku();

    /**
     * Product name
     *
     * @return string|null
     */
    public function getName();

    /**
     * Product price
     *
     * @return float|null
     */
    public function getPrice();

    /**
     * Product final price
     *
     * @return float|null
     */
    public function getFinalPrice();

    /**
     * Product special price
     *
     * @return float|null
     */
    public function getSpecialPrice();

    /**
     * Product special price from date
     *
     * @return string|null
     */
    public function getSpecialFromDate();

    /**
     * Product special price to date
     *
     * @return string|null
     */
    public function getSpecialToDate();


    /**
     * Product short description
     *
     * @return string|null
     */
    public function getShortDescription();

    /**
     * Product description
     *
     * @return string|null
     */
    public function getDescription();

    /**
     * Product status
     *
     * @return int|null
     */
    public function getStatus();

    /**
     * Product updated date
     *
     * @return string|null
     */
    public function getUpdatedAt();

    /**
     * Product weight
     *
     * @return float|null
     */
    public function getWeight();

    /**
     * Retrieve existing extension attributes object or create a new one.
     *
     * @return \Magento\Catalog\Api\Data\ProductExtensionInterface|null
     */
    public function getExtensionAttributes();

    /**
     * Set an extension attributes object.
     *
     * @param \Magento\Catalog\Api\Data\ProductExtensionInterface $extensionAttributes
     * @return $this
     */
    public function setExtensionAttributes(\Magento\Catalog\Api\Data\ProductExtensionInterface $extensionAttributes);


    /**
     * Get category ids by product
     *
     * @return array/null
     */
    public function getCategoryIds();

    /**
     * Sets product image from it's child if possible
     *
     * @return string
     */
    public function getImage();

    /**
     * Retrieve images
     *
     * @return array/null
     */
    public function getImages();
}
