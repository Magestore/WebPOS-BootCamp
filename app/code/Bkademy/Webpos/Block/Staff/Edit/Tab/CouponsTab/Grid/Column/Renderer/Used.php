<?php
/**
 * Copyright © 2015 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magestore\Promotionalgift\Block\Adminhtml\Shoppingcartrule\Edit\Tab\CouponsTab\Grid\Column\Renderer;

/**
 * Coupon codes grid "Used" column renderer
 *
 * @author      Magento Core Team <core@magentocommerce.com>
 */
class Used extends \Magento\Backend\Block\Widget\Grid\Column\Renderer\Text
{
    /**
     * @param \Magento\Framework\DataObject $row
     * @return string
     */
    public function render(\Magento\Framework\DataObject $row)
    {
        $value = (int)$row->getData($this->getColumn()->getIndex());
        return empty($value) ? __('No') : __('Yes');
    }
}
