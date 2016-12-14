<?php

namespace Bkademy\Webpos\Model;

class Staff extends \Magento\Framework\Model\AbstractModel
{

    /**
     *
     */
    const PASSWORD = 'password';

    /**
     *
     */
    const USER_NAME = 'username';
    /**
     *
     */
    const MIN_PASSWORD_LENGTH = 7;


    /**
     *
     */
    protected function _construct()
    {
        $this->_init('Bkademy\Webpos\Model\ResourceModel\Staff');
    }

    /**
     * @return bool
     */
    public function userExists() {
        $username = $this->getUsername();
        $check = $this->getCollection()->addFieldToFilter('username',$username);
        if ($check->getFirstItem()->getId() && $this->getId() != $check->getFirstItem()->getId()) {
            return true;
        }
        return false;
    }

    /**
     * @return array|bool
     */
    public function validate() {
        $errors = array();
        if ($this->hasNewPassword()) {
            if (strlen($this->getNewPassword()) < self::MIN_PASSWORD_LENGTH) {
                $errors[] = __('Password must be at least of %1 characters.', self::MIN_PASSWORD_LENGTH);
            }

            if (!preg_match('/[a-z]/iu', $this->getNewPassword()) || !preg_match('/[0-9]/u', $this->getNewPassword())
            ) {
                $errors[] = __('Password must include both numeric and alphabetic characters.');
            }

            if ($this->hasPasswordConfirmation() && $this->getNewPassword() != $this->getPasswordConfirmation()) {
                $errors[] = __('Password confirmation must be same as password.');
            }
        }
        if ($this->userExists()) {
            $errors[] = __('A user with the same user name already exists.');
        }
        if (empty($errors)) {
            return true;
        }
        return $errors;
    }

}