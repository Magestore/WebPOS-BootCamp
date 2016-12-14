<?php

/**
 * Magestore.
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

namespace Magestore\Promotionalgift\Block\Adminhtml\Shoppingcartrule\Edit;

/**
 * class Tabs.
 *
 * @category Magestore
 * @package  Magestore_Promotionalgift
 * @module   Promotionalgift
 * @author   Magestore Developer
 */
class Tabs extends \Magento\Backend\Block\Widget\Tabs
{
    /**
     * construct.
     */
    protected function _construct()
    {
        parent::_construct();
        $this->setId('shoppingcartrule_edit_tabs');
        $this->setDestElementId('edit_form');
        $this->setTitle(__('Shopping Cart Rule Information'));
        parent::_prepareLayout();
    }
}
