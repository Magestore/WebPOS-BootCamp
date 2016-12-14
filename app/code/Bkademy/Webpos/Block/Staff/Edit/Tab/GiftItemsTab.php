<?php

/**
 * Magestore
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Magestore.com license that is
 * available through the world-wide-web at this URL:
 * http://www.magestore.com/license-agreement.html
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade this extension to newer
 * version in the future.
 *
 * @category    Magestore
 * @package     Magestore_Promotionalgift
 * @copyright   Copyright (c) 2012 Magestore (http://www.magestore.com/)
 * @license     http://www.magestore.com/license-agreement.html
 */

namespace Magestore\Promotionalgift\Block\Adminhtml\Shoppingcartrule\Edit\Tab;

use Magento\Store\Model\System\Store;
use Magento\Customer\Api\GroupRepositoryInterface;
use Magento\Framework\Api\SearchCriteriaBuilder;
use Magento\Framework\Convert\DataObject as ObjectConverter;

/**
 * General Tab.
 *
 * @category Magestore
 * @package  Magestore_Promotionalgift
 * @module   Storelocator
 * @author   Magestore Developer
 */
class GiftItemsTab extends \Magento\Backend\Block\Widget\Form\Generic implements \Magento\Backend\Block\Widget\Tab\TabInterface
{
    /**
     * @var \Magento\Store\Model\System\Store
     */
    protected $_systemStore;
    /**
     * @var GroupRepositoryInterface
     */
    protected $groupRepository;
    /**
     * @var SearchCriteriaBuilder
     */
    protected $_searchCriteriaBuilder;
    /**
     * @var \Magento\Framework\Convert\Object
     */
    protected $_objectConverter;

    /**
     * @param \Magento\Backend\Block\Template\Context $context
     * @param \Magento\Framework\Registry             $registry
     * @param \Magento\Framework\Data\FormFactory     $formFactory
     * @param array                                   $data
     */
    public function __construct(
        \Magento\Backend\Block\Template\Context $context,
        \Magento\Framework\Registry $registry,
        \Magento\Framework\Data\FormFactory $formFactory,
        ObjectConverter $objectConverter,
        Store $systemStore,
        GroupRepositoryInterface $groupRepository,
        SearchCriteriaBuilder $searchCriteriaBuilder,
        array $data = []
    ) {
        $this->_objectConverter = $objectConverter;
        $this->_systemStore = $systemStore;
        $this->groupRepository = $groupRepository;
        $this->_searchCriteriaBuilder = $searchCriteriaBuilder;
        parent::__construct($context, $registry, $formFactory, $data);
    }

    /**
     * Prepare form.
     *
     * @return $this
     */
    protected function _prepareForm()
    {
        $model = $this->_coreRegistry->registry('current_pg_shoppingcart_rule');

        /** @var \Magento\Framework\Data\Form $form */
        $form = $this->_formFactory->create();

        /*
         * General Field Set
         */
        $fieldset = $form->addFieldset(
            'promo_gift_fieldset',
            [
                'legend' => __('Gift items'),
                'collapsable' => true,
            ]
        );

        if ($model->getId()) {
            $fieldset->addField('rule_id', 'hidden', ['name' => 'rule_id']);
        }

        $field_apply_by = $fieldset->addField(
            'apply_by',
            'select',
            [
                'name' => 'apply_by',
                'label' => __('Apply by'),
                'title' => __('Apply by'),
                'options' => ['' => __('Select'), '1' => __('Product in list'), '2' => __('Product in category'), '3' => __('Same product')],
                'required' => true,
            ]
        );

        $field_gift_product_ids = $fieldset->addField(
            'gift_product_ids',
            'text',
            [
                'name' => 'gift_product_ids',
                'label' => __('Products'),
                'title' => __('Products'),
                'required' => true,
            ]
        );

        $field_gift_category_id = $fieldset->addField(
            'gift_categories_ids',
            'text',
            [
                'name' => 'gift_categories_ids',
                'label' => __('Categories'),
                'title' => __('Categories'),
                'required' => true,
            ]
        );

        $field_gift_product_ids->setRenderer(
            $this->getLayout()->createBlock('Magestore\Promotionalgift\Block\Adminhtml\Shoppingcartrule\Render\CustomTextField')
        );

        $field_gift_category_id->setRenderer(
            $this->getLayout()->createBlock('Magestore\Promotionalgift\Block\Adminhtml\Shoppingcartrule\Render\CustomTextField')
        );

        /*
         * General Field Set
         */
        $fieldset = $form->addFieldset(
            'promo_gift_infomation_fieldset',
            [
                'legend' => __('Gift Information'),
                'collapsable' => true,
            ]
        );

        $fieldset->addField(
            'number_item_free',
            'text',
            [
                'name' => 'number_item_free',
                'label' => __('Number of selectable gift items'),
                'title' => __('Number of selectable gift items'),
                'note' => __('Set 0 to unlimited. Default: 0.'),
            ]
        );

        $fieldset->addField(
            'qty_item_free',
            'text',
            [
                'name' => 'qty_item_free',
                'label' => __('Quantity of gift item'),
                'title' => __('Quantity of gift item'),
                'note' => __('Default: 1.'),
            ]
        );

        $fieldset->addField(
            'discount_product',
            'text',
            [
                'name' => 'discount_product',
                'label' => __('Discount Percent of Gift Items'),
                'title' => __('Discount Percent of Gift Items'),
                'note' => __('Default: 100.'),
            ]
        );

        $fieldset->addField(
            'free_shipping',
            'select',
            [
                'label' => __('Free Shipping for Gift Items'),
                'title' => __('Free Shipping for Gift Items'),
                'name' => 'free_shipping',
                'options' => ['1' => __('Yes'), '2' => __('No')],
            ]
        );

        $form->setValues($model->getData());

        $this->setForm($form);

        //field dependencies
        $this->setChild('form_after',$this->getLayout()
            ->createBlock('Magento\Backend\Block\Widget\Form\Element\Dependence')
            ->addFieldMap($field_apply_by->getHtmlId(), $field_apply_by->getName())
            ->addFieldMap($field_gift_product_ids->getHtmlId(), $field_gift_product_ids->getName())
            ->addFieldMap($field_gift_category_id->getHtmlId(), $field_gift_category_id->getName())
            ->addFieldDependence($field_gift_product_ids->getName(), $field_apply_by->getName(), '1')
            ->addFieldDependence($field_gift_category_id->getName(), $field_apply_by->getName(), '2')
        );

        return parent::_prepareForm();
    }

    /**
     * Return Tab label.
     *
     * @return string
     *
     * @api
     */
    public function getTabLabel()
    {
        return __('Gift Items');
    }

    /**
     * Return Tab title.
     *
     * @return string
     *
     * @api
     */
    public function getTabTitle()
    {
        return __('Gift Items');
    }

    /**
     * Can show tab in tabs.
     *
     * @return bool
     *
     * @api
     */
    public function canShowTab()
    {
        return true;
    }

    /**
     * Tab is hidden.
     *
     * @return bool
     *
     * @api
     */
    public function isHidden()
    {
        return false;
    }
}
