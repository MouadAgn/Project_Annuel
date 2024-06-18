<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

#[Route('/api/user', name: 'users_')]
class UserController extends AbstractController
{
    private $em;
    private $mailer;

    public function __construct(EntityManagerInterface $em, MailerInterface $mailer)
    {
        $this->em = $em;
        $this->mailer = $mailer;
    }

    /**
     * Route for getting the current user's information
     */
    #[Route('/profile', name: 'profile', methods: ['GET'])]
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
     * Route for updating a user's information
     */
    #[Route('/{id}', name: 'update', methods: ['PATCH'])]
    public function updateUser(int $id, Request $request): JsonResponse
    {
        try {

            /**
            * @var User $user
            */
            $user = $this->getUser();

            if (!$user) {
                return new JsonResponse(['status' => 'KO', 'message' => 'User not found or not authenticated'], JsonResponse::HTTP_NOT_FOUND);
            }
            
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
    
            if (!$user) {
                return new JsonResponse(['status' => 'KO', 'message' => 'User not found'], JsonResponse::HTTP_NOT_FOUND);
            }
    
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

        } catch (\Exception $e) {
            return new JsonResponse(['status' => 'KO', 'message' => 'An error occurred: ' . $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Route for deleting a user
     */
    #[Route('/delete', name: 'delete', methods: ['DELETE'])]
    public function deleteUser(): JsonResponse
    {
        try {
            // 0 by default
            $userNbFiles = 0;
            
            /**
             * @var User $user
             */
            $user = $this->getUser();
            if (!$user) {
                return new JsonResponse(['status' => 'KO', 'message' => 'User not found or not authenticated'], JsonResponse::HTTP_NOT_FOUND);
            }
            
            $userName = $user->getName();
            // Get the number of files
            $userNbFiles = $user->getFiles()->count();

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

            // Send an email to the admin with the user's name and the number of files
            $emailAdmin = (new Email())
                ->from($_ENV['MAILER_FROM_ADDRESS'])
                ->to($_ENV['MAILER_ADMIN'])
                ->subject('Suppression de compte !')
                ->text('Le client '.$userName.' a supprimé son compte !
            Nombre de fichiers : '.$userNbFiles.'');
            $this->mailer->send($emailAdmin);

            return new JsonResponse(['status' => 'OK', 'message' => 'User deleted']);
        } catch (\Exception $e) {
            return new JsonResponse(['status' => 'KO', 'message' => 'An error occurred: ' . $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Route for adding storage to a user
     */
    #[Route('/add_storage', name: 'addStorage', methods: ['PUT'])]
    public function addStorage(): JsonResponse
    {
        try {
            $user = $this->getUser();

            if (!$user) {
                return new JsonResponse(['status' => 'KO', 'message' => 'User not found or not authenticated'], JsonResponse::HTTP_NOT_FOUND);
            }
            
            /**
            * @var User $user
            */
            $user->setStorageCapacity($user->getStorageCapacity() + 20000);

            $this->em->persist($user);
            $this->em->flush();

            // Send an email to the user to confirm the storage added
            $email = (new Email())
                ->from($_ENV['MAILER_FROM_ADDRESS'])
                ->to($user->getMail())
                ->subject('Espace de stockage ajouté !')
                ->text('Vous avez bien ajouté 20Go d\'espace de stockage à votre compte !');
            $this->mailer->send($email);

            return new JsonResponse(['status' => 'OK', 'message' => 'Storage added']);
        } catch (\Exception $e) {
            return new JsonResponse(['status' => 'KO', 'message' => 'An error occurred: ' . $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}