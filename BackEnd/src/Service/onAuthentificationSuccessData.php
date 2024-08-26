<?php

namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use App\Entity\User;

class JWTCreatedListener
{
    public function onJWTCreated(JWTCreatedEvent $event)
    {
        $payload = $event->getData();
        $user = $event->getUser();

        if ($user instanceof User) {
            // Ajout de l'information 'activated' au payload
            $payload['activated'] = $user->isActivated();
            
            // Si vous voulez aussi ajouter les rôles explicitement
            $payload['roles'] = $user->getRoles();
        }

        $event->setData($payload);
    }
}