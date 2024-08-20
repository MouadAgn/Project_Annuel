<?php

namespace App\Controller;

use Stripe\Stripe;
use Stripe\PaymentIntent;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class PaymentController extends AbstractController
{
    // Route for creating a payment intent on Stripe
    #[Route('/api/create-payment-intent', methods: ['POST'])]
    public function createPaymentIntent(): JsonResponse
    {
        Stripe::setApiKey($_ENV['STRIPE_SECRET_KEY']);

        $paymentIntent = PaymentIntent::create([
            'amount' => 2000,
            'currency' => 'eur',

        ]);

        return $this->json(['clientSecret' => $paymentIntent->client_secret]);
    }
}