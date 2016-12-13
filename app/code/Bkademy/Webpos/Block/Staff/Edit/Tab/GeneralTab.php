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
class GeneralTab extends \Magento\Backend\Block\Widget\Form\Generic implements \Magento\Backend\Block\Widget\Tab\TabInterface
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

        $form->setHtmlIdPrefix('rule_');

        /*
         * General Field Set
         */
        $fieldset = $form->addFieldset(
            'general_fieldset',
            [
                'legend' => __('Rule information'),
                'collapsable' => true,
            ]
        );

        if ($model->getId()) {
            $fieldset->addField('rule_id', 'hidden', ['name' => 'rule_id']);
        }

        $fieldset->addField(
            'name',
            'text',
            [
                'name' => 'name',
                'label' => __('Name'),
                'title' => __('Name'),
                'required' => true,
            ]
        );

        $fieldset->addField(
            'description',
            'textarea',
            [
                'name' => 'description',
                'label' => __('Description'),
                'title' => __('Description'),
            ]
        );

        $fieldset->addField(
            'status',
            'select',
            [
                'label' => __('Status'),
                'title' => __('Status'),
                'name' => 'status',
                'required' => true,
                'options' => ['1' => __('Enabled'), '2' => __('Disabled')],
            ]
        );

        if ($this->_storeManager->isSingleStoreMode()) {
            $websiteId = $this->_storeManager->getStore(true)->getWebsiteId();
            $fieldset->addField('website_ids', 'hidden', ['name' => 'website_ids[]', 'value' => $websiteId]);
            $model->setWebsiteIds($websiteId);
        } else {
            $field = $fieldset->addField(
                'website_ids',
                'multiselect',
                [
                    'name' => 'website_ids[]',
                    'label' => __('Websites'),
                    'title' => __('Websites'),
                    'required' => true,
                    'values' => $this->_systemStore->getWebsiteValuesForForm()
                ]
            );
            $renderer = $this->getLayout()->createBlock(
                'Magento\Backend\Block\Store\Switcher\Form\Renderer\Fieldset\Element'
            );
            $field->setRenderer($renderer);
        }

        $groups = $this->groupRepository->getList($this->_searchCriteriaBuilder->create())
            ->getItems();
        $fieldset->addField(
            'customer_group_ids',
            'multiselect',
            [
                'name' => 'customer_group_ids[]',
                'label' => __('Customer Groups'),
                'title' => __('Customer Groups'),
                'required' => true,
                'values' =>  $this->_objectConverter->toOptionArray($groups, 'id', 'code')
            ]
        );

        $couponTypeFiled = $fieldset->addField(
            'coupon_type',
            'select',
            [
                'name' => 'coupon_type',
                'label' => __('Coupon'),
                'required' => true,
                'options' => ['1' => __('No Coupon'), '2' => __('Specific Coupon')]
            ]
        );

        $couponCodeFiled = $fieldset->addField(
            'coupon_code',
            'text',
            ['name' => 'coupon_code', 'label' => __('Coupon Code'), 'required' => true]
        );

        $autoGenerationCheckbox = $fieldset->addField(
            'use_auto_generation',
            'checkbox',
            [
                'name' => 'use_auto_generation',
                'label' => __('Use Auto Generation'),
                'note' => __('If you select and save the rule you will be able to generate multiple coupon codes.'),
                'onclick' => 'handleCouponsTabContentActivity()',
                'checked' => (int)$model->getUseAutoGeneration() > 0 ? 'checked' : ''
            ]
        );

        $autoGenerationCheckbox->setRenderer(
            $this->getLayout()->createBlock(
                'Magento\SalesRule\Block\Adminhtml\Promo\Quote\Edit\Tab\Main\Renderer\Checkbox'
            )
        );

        $usesPerCouponFiled = $fieldset->addField(
            'uses_per_coupon',
            'text',
            ['name' => 'uses_per_coupon', 'label' => __('Uses per Coupon'), 'note' => __('Usage limit enforced for used coupon. Set 0 to unlimited. Default: 0')]
        );

        $fieldset->addField(
            'uses_per_customer',
            'text',
            ['name' => 'uses_per_customer',
                'label' => __('Uses per Customer'),
                'note' => __('Usage limit enforced for logged in customers only. Set 0 to unlimited. Default: 0')
            ]
        );

        $fieldset->addField(
            'times_used',
            'text',
            [
                'name' => 'times_used',
                'label' => __('Time Used'),
                'title' => __('Time Used'),
                'disabled' => true
            ]
        );

        $dateFormat = $this->_localeDate->getDateFormat(
            \IntlDateFormatter::MEDIUM
        );
        $fieldset->addField(
            'from_date',
            'date',
            [
                'name' => 'from_date',
                'label' => __('Start Date'),
                'title' => __('Start Date'),
                'input_format' => \Magento\Framework\Stdlib\DateTime::DATE_INTERNAL_FORMAT,
                'date_format' => $dateFormat
            ]
        );
        $fieldset->addField(
            'to_date',
            'date',
            [
                'name' => 'to_date',
                'label' => __('End Date'),
                'title' => __('End Date'),
                'input_format' => \Magento\Framework\Stdlib\DateTime::DATE_INTERNAL_FORMAT,
                'date_format' => $dateFormat
            ]
        );

        $fieldset->addField(
            'sort_order',
            'text',
            [
                'name' => 'sort_order',
                'label' => __('Priority'),
                'title' => __('Priority'),
            ]
        );

        $fieldset->addField(
            'banner_image',
            'image',
            [
                'name' => 'banner_image',
                'label' => __('Banner Ads'),
                'title' => __('Banner Ads'),
                'note' => __('Allowed file types: PNG, JPG, JPEG, GIF.'),
            ]
        );

        $form->setValues($model->getData());

        $this->setForm($form);

        // field dependencies
        $this->setChild('form_after',$this->getLayout()->createBlock('Magento\SalesRule\Block\Widget\Form\Element\Dependence')
            ->addFieldMap($couponTypeFiled->getHtmlId(),$couponTypeFiled->getName())
            ->addFieldMap($couponCodeFiled->getHtmlId(),$couponCodeFiled->getName())
            ->addFieldMap($autoGenerationCheckbox->getHtmlId(),$autoGenerationCheckbox->getName())
            ->addFieldMap($usesPerCouponFiled->getHtmlId(),$usesPerCouponFiled->getName())
            ->addFieldDependence($couponCodeFiled->getName(),$couponTypeFiled->getName(),\Magento\SalesRule\Model\Rule::COUPON_TYPE_SPECIFIC)
            ->addFieldDependence($autoGenerationCheckbox->getName(),$couponTypeFiled->getName(),\Magento\SalesRule\Model\Rule::COUPON_TYPE_SPECIFIC)
            ->addFieldDependence($usesPerCouponFiled->getName(),$couponTypeFiled->getName(),\Magento\SalesRule\Model\Rule::COUPON_TYPE_SPECIFIC)
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
        return __('General information');
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
        return __('General information');
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
