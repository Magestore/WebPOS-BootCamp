<?php

/**
 *  Copyright © 2016 Magestore. All rights reserved.
 *  See COPYING.txt for license details.
 *
 */
namespace Bkademy\Webpos\Controller\Adminhtml\Staff;

/**
 * class \Bkademy\Webpos\Controller\Adminhtml\Staff\Edit
 *
 * Edit user
 * Methods:
 *  execute
 *
 * @category    Magestore
 * @package     Magestore\Webpos\Controller\Adminhtml\Staff\Staff
 * @module      Webpos
 * @author      Magestore Developer
 */
class Edit extends \Bkademy\Webpos\Controller\Adminhtml\Staff
{

    /**
     * @return $this|\Magento\Framework\View\Result\Page
     */
    public function execute()
    {
        $id = $this->getRequest()->getParam('staff_id');
        $resultRedirect = $this->resultRedirectFactory->create();
        $model = $this->_objectManager->create('Bkademy\Webpos\Model\Staff');

        $registryObject = $this->_objectManager->get('Magento\Framework\Registry');

        if ($id) {
            $model = $model->load($id);
            if (!$model->getId()) {
                $this->messageManager->addError(__('This role no longer exists.'));
                return $resultRedirect->setPath('webpos/*/', ['_current' => true]);
            }
        }
        $data = $this->_objectManager->get('Magento\Backend\Model\Session')->getFormData(true);
        if (!empty($data)) {
            $model->setData($data);
        }
        $registryObject->register('current_staff', $model);
        $resultPage = $this->_resultPageFactory->create();
        if (!$model->getId()) {
            $pageTitle = __('New Staff');
        } else {
            $pageTitle =  __('Edit Staff %1', $model->getDisplayName());
        }
        $resultPage->getConfig()->getTitle()->prepend($pageTitle);
        return $resultPage;
    }

}
