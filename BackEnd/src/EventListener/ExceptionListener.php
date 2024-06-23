<?php

namespace App\EventListener;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;



class ExceptionListener
{
    /* public function onKernelException(ExceptionEvent $event)
    {
        $exception = $event->getThrowable();

        if ($exception instanceof MethodNotAllowedHttpException) {
            $response = new JsonResponse([
                'error' => 'Méthode non autorisée. Veuillez vérifier la méthode HTTP utilisée pour votre requête.'
            ], JsonResponse::HTTP_METHOD_NOT_ALLOWED);

            $event->setResponse($response);
        }
    } */


}