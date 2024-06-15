<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

use App\Entity\User;

use Doctrine\Common\Collections\Criteria;
use Doctrine\ORM\EntityManagerInterface;


class AdminController extends AbstractController
{

    private $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    /**
    * Route for getting all users
    */
    #[Route('/api/admin/users', name: 'getUsers', methods: ['GET'])]
    // #[IsGranted('ROLE_ADMIN', message: 'You do not have permission to access this route.')]
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
    #[Route('/api/admin/{id}', name: 'getUser', methods: ['GET'])]
    public function getUserById(int $id): Response
    {
        $user = $this->em->getRepository(User::class)->find($id);

        return $this->json($user, context: ['groups' => 'user']);
    }

    /**
     * Route for creating a user, methods: ['POST']
     */
    #[Route('/api/admin/create', name: 'createUser', methods: ['POST'])]
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

}
