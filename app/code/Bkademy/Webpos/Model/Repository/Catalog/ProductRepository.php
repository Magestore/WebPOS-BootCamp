<?php

/**
 *  Copyright © 2016 Bkademy. All rights reserved.
 *  See COPYING.txt for license details.
 *
 */
namespace Bkademy\Webpos\Model\Repository\Catalog;

use Magento\Catalog\Model\ResourceModel\Product\Collection;
use Magento\Framework\Api\SortOrder;
use Magento\Catalog\Api\Data\ProductExtension;
use Bkademy\Webpos\Api\Data\Catalog\Product\ConfigOptionsInterface;
use Bkademy\Webpos\Model\Repository\Catalog\Product\ConfigOptionsBuilder;

/**
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 * @SuppressWarnings(PHPMD.TooManyFields)
 */
class ProductRepository extends \Magento\Catalog\Model\ProductRepository
    implements \Bkademy\Webpos\Api\Catalog\ProductRepositoryInterface
{
    /** @var */
    protected $_productCollection;

    /**
     * {@inheritdoc}
     */
    public function getList(\Magento\Framework\Api\SearchCriteriaInterface $searchCriteria)
    {
        if (empty($this->_productCollection)) {
            $collection = \Magento\Framework\App\ObjectManager::getInstance()->get(
                '\Bkademy\Webpos\Model\ResourceModel\Catalog\Product\Collection'
            );

            /** Integrate webpos **/
            $eventManage = \Magento\Framework\App\ObjectManager::getInstance()->get(
                '\Magento\Framework\Event\ManagerInterface'
            );

            $request = \Magento\Framework\App\ObjectManager::getInstance()->get(
                '\Magento\Framework\App\RequestInterface'
            );
//            $permissionHelper = \Magento\Framework\App\ObjectManager::getInstance()->get(
//                '\Bkademy\Webpos\Helper\Permission'
//            );
//            $eventManage->dispatch('webpos_catalog_product_getlist', ['collection' => $collection, 'location' => $permissionHelper->getCurrentLocation()]);
//            /** End integrate webpos **/

            $this->extensionAttributesJoinProcessor->process($collection);
            $collection->addAttributeToSelect('*');
            $collection->joinAttribute('status', 'catalog_product/status', 'entity_id', null, 'inner');
            //$collection->joinAttribute('visibility', 'catalog_product/visibility', 'entity_id', null, 'inner');
            //$visibleInSite = \Magento\Framework\App\ObjectManager::getInstance()->get(
            //    '\Magento\Catalog\Model\Product\Visibility'
            //)->getVisibleInSiteIds();
            $collection->addAttributeToFilter('status', \Magento\Catalog\Model\Product\Attribute\Source\Status::STATUS_ENABLED);
            //$collection->addAttributeToFilter('visibility', ['in' => $visibleInSite]);
            //Add filters from root filter group to the collection
            foreach ($searchCriteria->getFilterGroups() as $group) {
                if (!$request->getParam('filterOr')) {
                    $this->addFilterGroupToCollection($group, $collection);
                } else {
                    $this->addFilterOrGroupToCollection($group, $collection);
                }

            }
            $collection->addAttributeToFilter('type_id', ['in' => $this->getProductTypeIds()]);
            $collection->addVisibleFilter();
            $this->_productCollection = $collection;
        }
        $this->_productCollection->setCurPage($searchCriteria->getCurrentPage());
        $this->_productCollection->setPageSize($searchCriteria->getPageSize());
        $searchResult = $this->searchResultsFactory->create();
        $searchResult->setSearchCriteria($searchCriteria);
        $searchResult->setItems($this->_productCollection->getItems());
        $searchResult->setTotalCount($this->_productCollection->getSize());
        //$items = $searchResult->getItems();
        return $searchResult;

    }


    /**
     * Helper function that adds a FilterGroup to the collection.
     *
     * @param \Magento\Framework\Api\Search\FilterGroup $filterGroup
     * @param Collection $collection
     * @return void
     */
    protected function addFilterOrGroupToCollection(
        \Magento\Framework\Api\Search\FilterGroup $filterGroup,
        \Magento\Catalog\Model\ResourceModel\Product\Collection $collection
    ) {
        $fields = [];
        $categoryFilter = [];
        foreach ($filterGroup->getFilters() as $filter) {
            $conditionType = $filter->getConditionType() ? $filter->getConditionType() : 'eq';

            if ($filter->getField() == 'category_id') {
                $categoryFilter[$conditionType][] = $filter->getValue();
                continue;
            }
            $fields[] = ['attribute' => $filter->getField(), $conditionType => $filter->getValue()];
        }

        if ($categoryFilter) {
            $collection->addCategoriesFilter($categoryFilter);
        }

        if ($fields) {
            $collection->addFieldToFilter($fields);
        }
    }


    /**
     * get product attributes to select
     * @return array
     */
    public function getSelectProductAtrributes()
    {
        return [
            self::TYPE_ID,
            self::NAME,
            self::PRICE,
            self::SPECIAL_PRICE,
            self::SPECIAL_FROM_DATE,
            self::SPECIAL_TO_DATE,
            self::SKU,
            self::SHORT_DESCRIPTION,
            self::DESCRIPTION,
            self::IMAGE,
            self::FINAL_PRICE
        ];
    }

    /**
     * get product type ids to support
     * @return array
     */
    public function getProductTypeIds()
    {
        $types = [
            \Magento\Catalog\Model\Product\Type::TYPE_VIRTUAL,
            \Magento\Catalog\Model\Product\Type::TYPE_SIMPLE,
            \Magento\GroupedProduct\Model\Product\Type\Grouped::TYPE_CODE,
            \Magento\Catalog\Model\Product\Type::TYPE_BUNDLE,
            \Magento\ConfigurableProduct\Model\Product\Type\Configurable::TYPE_CODE
        ];
        $objectManager = \Magento\Framework\App\ObjectManager::getInstance();
        $moduleManager = $objectManager->create('\Magento\Framework\Module\Manager');
        if ($moduleManager->isEnabled('Bkademy_Customercredit')) {
            $types[] = 'customercredit';
        }
        return $types;
    }
}