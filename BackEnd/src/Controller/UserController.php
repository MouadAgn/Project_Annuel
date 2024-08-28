<?php

namespace App\Controller;

use App\Service\UserStorageService;

use App\Entity\User;

use Doctrine\ORM\EntityManagerInterface;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;


#[Route('/api/user', name: 'user_')]
class UserController extends AbstractController
{
    private $em;
    private $mailer;
    private $userStorageService;
    private $passwordHasher;
    private $jwtManager;

    public function __construct(EntityManagerInterface $em, MailerInterface $mailer, UserStorageService $userStorageService, UserPasswordHasherInterface $passwordHasher, JWTTokenManagerInterface $jwtManager)
    {
        $this->em = $em;
        $this->mailer = $mailer;
        $this->userStorageService = $userStorageService;
        $this->passwordHasher = $passwordHasher;
        $this->jwtManager = $jwtManager;
    }

    /**
     * Route for getting the current user's information
     */
    #[Route('/profile', name: 'profile', methods: ['GET'])]
    public function getUserProfile(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
    
        if (!$user) {
            return $this->json(['status' => 'KO', 'message' => 'User not found or not authenticated'], status: JsonResponse::HTTP_FORBIDDEN);
        }

        $totalStorageCapacity = $this->userStorageService->getUserStorageCapacityInGB($user);
        $totalStorageUsed = $this->userStorageService->calculateTotalStorageUsed($user);

        $userData = [ 
            'user' => $user,
            'totalStorageCapacity' => $totalStorageCapacity,
            'totalStorageUsed' => $totalStorageUsed,
        ];

        return $this->json($userData, context: ['groups' => 'user']);
    }

    /**
     * Route for updating a user's information
     */
    #[Route('/update', name: 'update', methods: ['PATCH'])]
    public function updateUser(Request $request): JsonResponse
    {
        try {
            /**
            * @var User $user
            */
            $user = $this->getUser();

            if (!$user) {
                return new JsonResponse(['status' => 'KO', 'message' => 'Utilisateur non trouvé dans la base de donnée'], JsonResponse::HTTP_NOT_FOUND);
            }
            
            // Get the data and decode it and create an array of allowed fields
            $data = json_decode($request->getContent(), true);
            $allowedFields = ['name', 'firstName', 'currentPassword', 'newPassword', 'mail', 'address', 'zipCode', 'city', 'country'];
            $errors = [];

            // Check if the current password is correct
            if (isset($data['currentPassword'])) {
                if (!$this->passwordHasher->isPasswordValid($user, $data['currentPassword'])) {
                    return new JsonResponse(['status' => 'KO', 'message' => 'Mot de passe actuel incorrect'], JsonResponse::HTTP_UNAUTHORIZED);
                }
            }

            // Validate the new password if provided
            if (isset($data['newPassword'])) {
                if (strlen($data['newPassword']) < 8) {
                    $errors['newPassword'] = 'Le mot de passe doit contenir au moins 8 caractères';
                }
                // Check if the password contain a majuscule & a number & a special character
                if (!preg_match('/[A-Z]/', $data['newPassword'])) {
                    $errors['newPassword'] = 'Le mot de passe doit contenir au moins une majuscule';
                }
                if (!preg_match('/[0-9]/', $data['newPassword'])) {
                    $errors['newPassword'] = 'Le mot de passe doit contenir au moins un chiffre';
                }
                if (!preg_match('/[^a-zA-Z0-9]/', $data['newPassword'])) {
                    $errors['newPassword'] = 'Le mot de passe doit contenir au moins un caractère spécial';
                }
            }
    
            // Check if the data is valid according to the allowed fields
            foreach ($data as $field => $value) {
                if (!in_array($field, $allowedFields)) {
                    $errors[$field] = 'Champ non autorisé';
                    continue;
                }
                // Check if the data is valid according to their type
                switch ($field) {
                    case 'name':
                    case 'firstName':
                    case 'currentPassword':
                    case 'newPassword':
                    case 'mail':
                    case 'address':
                    case 'city':
                    case 'country':
                        if (!is_string($value)) $errors[$field] = 'Doit être une chaîne de caractères';
                        break;
                    case 'zipCode':
                        if (!is_int($value)) $errors[$field] = 'Doit être un entier';
                        break;
                }
            }
    
            if (!empty($errors)) {
                return new JsonResponse(['status' => 'KO', 'errors' => $errors], JsonResponse::HTTP_BAD_REQUEST);
            }
    
            foreach ($data as $field => $value) {
                switch ($field) {
                    case 'name': $user->setName($value); 
                        break;
                    case 'firstName': $user->setFirstName($value); 
                        break;
                    case 'password': 
                        if ($this->passwordHasher->isPasswordValid($user, $data['currentPassword'])) {
                            $hashedPassword = $this->passwordHasher->hashPassword($user, $value);
                            $user->setPassword($hashedPassword); 
                        } else {
                            return new JsonResponse(['status' => 'KO', 'message' => 'Le mot de passe actuel doit être correct pour modifier le mot de passe'], JsonResponse::HTTP_UNAUTHORIZED);
                        }
                    break;
                    case 'mail': 
                        $existingUser = $this->em->getRepository(User::class)->findOneBy(['mail' => $value]);
                        if ($existingUser && $existingUser->getId() !== $user->getId()) {
                            return new JsonResponse(['status' => 'KO', 'message' => 'Email déjà utilisé'], JsonResponse::HTTP_CONFLICT);
                        }
                        $user->setMail($value); 
                        break;
                    case 'address': $user->setAddress($value); 
                        break;
                    case 'zipCode': $user->setZipCode($value); 
                        break;
                    case 'city': $user->setCity($value); 
                        break;
                    case 'country': $user->setCountry($value); 
                        break;
                }
            }
    
            $this->em->flush();
            return new JsonResponse(['status' => 'OK', 'message' => 'Profil mis à jour']);

        } catch (\Exception $e) {
            return new JsonResponse(['status' => 'KO', 'message' => 'Une erreur est surrvenu: ' . $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
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

            // Set to null the user_id in the invoices
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
    #[Route('/addStorage', name: 'addStorage', methods: ['PUT'])]
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
            $user->setActivated(true);

            $this->em->persist($user);
            $this->em->flush();

            // Générer un nouveau token JWT
            $newToken = $this->jwtManager->create($user);

            // Send an email to the user to confirm the storage added
            // $email = (new Email())
            //     ->from($_ENV['MAILER_FROM_ADDRESS'])
            //     ->to($user->getMail())
            //     ->subject('Espace de stockage ajouté !')
            //     ->text('Vous avez bien ajouté 20Go d\'espace de stockage à votre compte !');
            // $this->mailer->send($email);

            return new JsonResponse([
                'status' => 'OK', 
                'message' => 'Storage added',
                'token' => $newToken
            ]);
        } catch (\Exception $e) {
            return new JsonResponse(['status' => 'KO', 'message' => 'An error occurred: ' . $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}