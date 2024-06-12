<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Common\Collections\Criteria;

use Symfony\Component\HttpFoundation\Request;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

use Symfony\Component\HttpFoundation\JsonResponse;

use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;

class UserController extends AbstractController
{
    private $em;
    private $JWTEncoder;

    public function __construct(EntityManagerInterface $em, JWTTokenManagerInterface $JWTEncoder)
    {
        $this->em = $em;
        $this->JWTEncoder = $JWTEncoder;
    }

    /* 
    * Route for login
    */
    // #[Route('/api/login_check', name: 'login', methods: ['POST'])]
    // public function login(Request $request): JsonResponse
    // {
    //     $jsonData = json_decode($request->getContent(), true);

    //     if (empty($jsonData['mail']) || empty($jsonData['password'])) {
    //         return new JsonResponse(['error' => 'Missing credentials'], 400);
    //     }

    //     // Check if user exists
    //     $user = $this->em->getRepository(User::class)->findOneBy(['mail' => $jsonData['mail']]);
        
    //     if (!$user || !password_verify($jsonData['password'], $user->getPassword())) {
    //         return new JsonResponse(['error' => 'Invalid credentials'], 401);
    //     }

    //     $token = $this->JWTEncoder->create($user);

    //     return new JsonResponse(['token' => $token], 200);
    // }

    /**
     * Route for getting all users ---- A DEPLACER DANS ADMINCONTROLLER
     */
    
    #[Route('/api/admin/users', name: 'getUsers', methods: ['GET'])]
    // #[IsGranted('ROLE_ADMIN', message: 'Vous n\'avez pas les droits suffisants pour créer un livre')]
    public function getAllUsers(): Response
    {
        $criteria = new Criteria();
        $criteria->where(Criteria::expr()->eq('role', User::ROLE_USER));

        $users = $this->em->getRepository(User::class)->matching($criteria);

        $filterUsers = $users->map(function ($user) {
            return [
                'id' => $user->getId(),
                'name' => $user->getName(),
                'firstName' => $user->getFirstName(),
                'storageCapacity' => $user->getStorageCapacity(),
                'role' => $user->getRole()
            ];
        });

        return $this->json($filterUsers);
    }

    /**
     * Route for getting a user by id ------- UTILISER PAR L'ADMIN
     */
    #[Route('/api/users/{id}', name: 'getUser', methods: ['GET'])]
    public function getUserById(int $id): Response
    {
        $user = $this->em->getRepository(User::class)->find($id);

        return $this->json($user, context: ['groups' => 'user']);
    }

    /**
     * Route for getting the current user's information
     */
    #[Route('/api/user/profile', name: 'getUserProfile', methods: ['GET'])]
    public function getUserProfile(): Response
    {
        // Récupérer l'utilisateur connecté à partir du token JWT
        $user = $this->getUser();
    
        if (!$user) {
            // Gérer le cas où l'utilisateur n'est pas trouvé ou non connecté
            return $this->json(['message' => 'User not found or not authenticated'], status: Response::HTTP_FORBIDDEN);
        }
    
        // Retourner les informations de l'utilisateur connecté
        return $this->json($user, context: ['groups' => 'user']);
    }

    /**
     * Route for creating a user, methods: ['POST']
     */
    #[Route('/api/users/create', name: 'createUser', methods: ['POST'])]
    public function createUser(Request $request): JsonResponse
    {
        /* if($request -> getMethod() !== 'POST'){
            return new JsonResponse(['status' => 'Method not allowed!'], Response::HTTP_METHOD_NOT_ALLOWED);
        } */

        try {
            // Get the data and decode it
            $data = json_decode($request->getContent(), true);
            // var_dump($data);

            // Check if the data is present
            if (!isset($data['name'], $data['firstName'], $data['password'], $data['mail'], $data['address'], $data['zipCode'], $data['city'], $data['country'])) {
                return new JsonResponse(['status' => 'Missing data!'], Response::HTTP_BAD_REQUEST);
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
                return new JsonResponse(['errors' => $errors], Response::HTTP_BAD_REQUEST);
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

            return new JsonResponse(['status' => 'User created!'], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return new JsonResponse(['status' => 'User not created!', 'message' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Route for updating a user, methods: ['PATCH']
     */
    #[Route('/api/users/{id}', name: 'updateUser', methods: ['PATCH'])]
    public function updateUser(int $id, Request $request): JsonResponse
    {
        /* if ($request->getMethod() !== 'PATCH') {
            return new JsonResponse(['status' => 'Method not allowed!'], Response::HTTP_METHOD_NOT_ALLOWED);
        } */

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

            // 
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
            return new JsonResponse(['errors' => $errors], Response::HTTP_BAD_REQUEST);
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

        return new JsonResponse(['status' => 'User updated']);

    }

    /**
     * @Route("/api/users/{id}", name: 'deleteUser', methods={"DELETE"})
     */
    #[Route('/api/users/{id}', name: 'deleteUser', methods: ['DELETE'])]
    public function deleteUser(int $id): JsonResponse
    {
        /* if($request -> getMethod() !== 'DELETE'){
            return new JsonResponse(['status' => 'Method not allowed!'], Response::HTTP_METHOD_NOT_ALLOWED);
        } */

        $user = $this->em->getRepository(User::class)->find($id);

        if (!$user) {
            return new JsonResponse(['status' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $this->em->remove($user);
        $this->em->flush();

        return new JsonResponse(['status' => 'User deleted']);
    }
}
