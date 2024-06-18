<?php

namespace App\EventListener;

use Symfony\Component\HttpKernel\Event\RequestEvent;
use Psr\Log\LoggerInterface;

class RequestListener
{
    private $logger;

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    public function onKernelRequest(RequestEvent $event)
{
    $request = $event->getRequest();
    $this->logger->debug('Request URI: ' . $request->getUri(), ['channel' => 'request']);
    $this->logger->debug('Request Headers: ' . json_encode($request->headers->all()), ['channel' => 'request']);
    // $this->logger->debug('Test Monolog');
}
}