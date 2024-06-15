<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
// use Doctrine\Common\Collections\Criteria;

use Symfony\Component\Mime\Email;

use Symfony\Component\HttpFoundation\Request;

// use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

use Symfony\Component\HttpFoundation\JsonResponse;

// use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Mailer\MailerInterface;

class UserController extends AbstractController
{
    private $em;
    private $mailer;
    private $JWTEncoder;

    public function __construct(EntityManagerInterface $em, JWTTokenManagerInterface $JWTEncoder, MailerInterface $mailer)
    {
        $this->em = $em;
        $this->JWTEncoder = $JWTEncoder;
        $this->mailer = $mailer;
    }

    /**
     * Route for getting the current user's information
     */
    #[Route('/api/user/profile', name: 'getUserProfile', methods: ['GET'])]
    public function getUserProfile(): JsonResponse
    {
        // Get the current user from the token
        $user = $this->getUser();
    
        if (!$user) {
            // Return an error if the user is not found or not authenticated
            return $this->json(['status' => 'KO', 'message' => 'User not found or not authenticated'], status: JsonResponse::HTTP_FORBIDDEN);
        }
    
        //  Return the user's information
        return $this->json($user, context: ['groups' => 'user']);
    }

    /**
     * Route for creating a user, methods: ['POST']
     */
    #[Route('/api/users/create', name: 'createUser', methods: ['POST'])]
    public function createUser(Request $request): JsonResponse
    {
        try {
            // Get the data and decode it
            $data = json_decode($request->getContent(), true);

            // Check if the data is present
            if (!isset($data['name'], $data['firstName'], $data['password'], $data['mail'], $data['address'], $data['zipCode'], $data['city'], $data['country'])) {
                return new JsonResponse(['status' => 'KO', 'message' => 'Missing data!'], JsonResponse::HTTP_BAD_REQUEST);
            }

            // Check if the data is valid according to their type
            $errors = [];
            if (!is_string($data['name'] ?? null)) $errors['name'] = 'Must be a string';
            if (!is_string($data['firstName'] ?? null)) $errors['firstName'] = 'Must be a string';
            if (!is_string($data['password'] ?? null)) $errors['password'] = 'Must be a string';
            if (!is_string($data['mail'] ?? null)) $errors['mail'] = 'Must be a string';
            if (!is_string($data['address'] ?? null)) $errors['address'] = 'Must be a string';
            if (!is_int($data['zipCode'] ?? null)) $errors['zipCode'] = 'Must be an integer';
            if (!is_string($data['city'] ?? null)) $errors['city'] = 'Must be a string';
            if (!is_string($data['country'] ?? null)) $errors['country'] = 'Must be a string';

            // If one of the data is not valid, return an error
            if (!empty($errors)) {
                return new JsonResponse(['status' => 'KO', 'errors' => $errors], JsonResponse::HTTP_BAD_REQUEST);
            }

            // Create a new user with all the fields
            $user = new User();
            $user->setName($data['name']);
            $user->setFirstName($data['firstName']);
            $user->setPassword($data['password']);
            $user->setMail($data['mail']);
            $user->setCreatedDate(new \DateTimeImmutable());
            $user->setAddress($data['address']);
            $user->setZipCode($data['zipCode']);
            $user->setCity($data['city']);
            $user->setCountry($data['country']);

            $em = $this->em;
            $em->persist($user);
            $em->flush();

            return new JsonResponse(['status' => 'OK', 'message' => 'User created!'], JsonResponse::HTTP_CREATED);
        } catch (\Exception $e) {
            return new JsonResponse(['status' => 'KO', 'message' => 'User not created!', 'message2' => $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Route for updating a user, methods: ['PATCH']
     */
    #[Route('/api/users/{id}', name: 'updateUser', methods: ['PATCH'])]
    public function updateUser(int $id, Request $request): JsonResponse
    {
        // Get the data and decode it and create an array of allowed fields
        $data = json_decode($request->getContent(), true);
        $allowedFields = ['name', 'firstName', 'password', 'mail', 'address', 'zipCode', 'city', 'country'];
        $errors = [];

        // Check if the data is valid according to the allowed fields
        foreach ($data as $field => $value) {
            if (!in_array($field, $allowedFields)) {
                $errors[$field] = 'Not a valid field';
                continue;
            }

            // Check if the data is valid according to their type
            switch ($field) {
                case 'name':
                case 'firstName':
                case 'password':
                case 'mail':
                case 'address':
                case 'city':
                case 'country':
                    if (!is_string($value)) $errors[$field] = 'Must be a string';
                    break;
                case 'zipCode':
                    if (!is_int($value)) $errors[$field] = 'Must be an integer';
                    break;
            }
        }

        if (!empty($errors)) {
            return new JsonResponse(['status' => 'KO', 'message' => $errors], JsonResponse::HTTP_BAD_REQUEST);
        }

        $user = $this->em->getRepository(User::class)->find($id);

        foreach ($data as $field => $value) {
            switch ($field) {
                case 'name': $user->setName($value); break;
                case 'firstName': $user->setFirstName($value); break;
                case 'password': $user->setPassword($value); break;
                case 'mail': $user->setMail($value); break;
                case 'address': $user->setAddress($value); break;
                case 'zipCode': $user->setZipCode($value); break;
                case 'city': $user->setCity($value); break;
                case 'country': $user->setCountry($value); break;
            }
        }

        $this->em->flush();

        return new JsonResponse(['status' => 'OK', 'message' => 'User updated']);

    }

    /**
     * @Route("/api/users/{id}", name: 'deleteUser', methods={"DELETE"})
     */
    #[Route('/api/users/delete', name: 'deleteUser', methods: ['DELETE'])]
    public function deleteUser(): JsonResponse
    {
        // 0 by default
        $userNbFiles = 0;
        
        /**
         * @var User $user
         */
        // Get the current user from the token & his name & the number of files
        $user = $this->getUser();
        $userName = $user->getName();
        $userNbFiles = $user->getFiles()->count();

        if (!$user) {
            return new JsonResponse(['status' => 'KO', 'message' => 'User not found or not authenticated'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Set to null the user in the invoices
        $invoices = $user->getInvoices();
        foreach ($invoices as $invoice) {
            $invoice->setUser(null);
            $this->em->persist($invoice);
        }

        $this->em->remove($user);
        $this->em->flush();

        // Send a confirmation email
        $email = (new Email())
        ->from($_ENV['MAILER_FROM_ADDRESS'])
        ->to($user->getMail())
        ->subject('Nous sommes tristes de vous voir partir !')
        ->text('Votre compte à bien été supprimé !');
        $this->mailer->send($email);

        $emailAdmin = (new Email())
        ->from($_ENV['MAILER_FROM_ADDRESS'])
        ->to($_ENV['MAILER_ADMIN'])
        ->subject('Suppresion de compte !')
        ->text('Le client '.$userName.' à supprimer son compte !
        Nombres de fichiers : '.$userNbFiles.'');
        $this->mailer->send($emailAdmin);

        return new JsonResponse(['status' => 'OK', 'message' => 'User deleted']);
    }
}
