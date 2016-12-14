<?php

namespace Bkademy\Webpos\Block;

class AbstractBlock extends \Magento\Framework\View\Element\Template
{

    /**
     * @var array
     */
    protected $_layoutProcessors;

    /**
     * @var \Magento\Checkout\Model\CompositeConfigProvider
     */
    protected $configProvider;

    /**
     * AbstractBlock constructor.
     * @param \Magento\Framework\View\Element\Template\Context $context
     * @param array $layoutProcessors
     * @param array $data
     */
    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        \Bkademy\Webpos\Model\WebposConfigProvider\CompositeConfigProvider $configProvider,
        array $layoutProcessors = [],
        array $data = []
    ) {
        $this->_layoutProcessors = $layoutProcessors;
        $this->configProvider = $configProvider;
        parent::__construct($context, $data);
    }

    /**
     * @return string
     */
    public function getJsLayout()
    {
        foreach ($this->_layoutProcessors as $processor) {
            $this->jsLayout = $processor->process($this->jsLayout);
        }
        return parent::getJsLayout();
    }

    /**
     * Retrieve checkout configuration
     *
     * @return array
     * @codeCoverageIgnore
     */
    public function getWebposConfig()
    {
        return $this->configProvider->getConfig();
    }

}
