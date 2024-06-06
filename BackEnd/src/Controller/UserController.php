<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

use App\Entity\User;

use Doctrine\ORM\EntityManagerInterface;

use Doctrine\Common\Collections\Criteria;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;


class UserController extends AbstractController
{
    private $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    /**
     * Route for getting all users
     */
    #[Route('/api/users', name: 'getUsers', methods: ['GET'])]
    public function getAllUsers(): Response
    {
        $criteria = new Criteria();
        $criteria->where(Criteria::expr()->eq('Role', User::ROLE_USER));

        $users = $this->em->getRepository(User::class)->matching($criteria);

        return $this->json($users);
    }

    /**
     * Route for getting a user by id
     */
    #[Route('/api/users/{id}', name: 'getUser', methods: ['GET'])]
    public function getUserById(int $id): Response
    {
        $user = $this->em->getRepository(User::class)->find($id);

        return $this->json($user);
    }

    /**
     * Route for creating a user, methods: ['POST']
     */
    #[Route('/api/users/create', name: 'createUser')]
    public function createUser(Request $request): JsonResponse
    {
        if($request -> getMethod() !== 'POST'){
            return new JsonResponse(['status' => 'Method not allowed!'], Response::HTTP_METHOD_NOT_ALLOWED);
        }

        try {
            // Récupération des données et les décode
            $data = json_decode($request->getContent(), true);
            // var_dump($data);

            // Vérifie si les données sont présentes
            if (!isset($data['Name'], $data['FirstName'], $data['Password'], $data['Mail'], $data['Address'], $data['ZipCode'], $data['City'], $data['Country'])) {
                return new JsonResponse(['status' => 'Missing data!'], Response::HTTP_BAD_REQUEST);
            }

            // Vérifie si les données sont valides par rapport à leur type
            $errors = [];
            if (!is_string($data['Name'] ?? null)) $errors['Name'] = 'Must be a string';
            if (!is_string($data['FirstName'] ?? null)) $errors['FirstName'] = 'Must be a string';
            if (!is_string($data['Password'] ?? null)) $errors['Password'] = 'Must be a string';
            if (!is_string($data['Mail'] ?? null)) $errors['Mail'] = 'Must be a string';
            if (!is_string($data['Address'] ?? null)) $errors['Address'] = 'Must be a string';
            if (!is_int($data['ZipCode'] ?? null)) $errors['ZipCode'] = 'Must be an integer';
            if (!is_string($data['City'] ?? null)) $errors['City'] = 'Must be a string';
            if (!is_string($data['Country'] ?? null)) $errors['Country'] = 'Must be a string';

            // Si les données ne sont pas valides, on retourne une erreur
            if (!empty($errors)) {
                return new JsonResponse(['errors' => $errors], Response::HTTP_BAD_REQUEST);
            }

            // Création d'un nouvel utilisateur
            $user = new User();
            $user->setName($data['Name']);
            $user->setFirstName($data['FirstName']);
            $user->setPassword($data['Password']);
            $user->setMail($data['Mail']);
            $user->setCreatedDate(new \DateTimeImmutable());
            $user->setAddress($data['Address']);
            $user->setZipCode($data['ZipCode']);
            $user->setCity($data['City']);
            $user->setCountry($data['Country']);

            $em = $this->em;
            $em->persist($user);
            $em->flush();

            return new JsonResponse(['status' => 'User created!'], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return new JsonResponse(['status' => 'User not created!', 'message' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @Route("/api/users/{id}", name: 'updateUser', methods={"PATCH"})
     */
    #[Route('/api/users/{id}', name: 'updateUser', methods: ['PATCH'])]
    public function updateUser(int $id, Request $request): JsonResponse
    {
        if ($request->getMethod() !== 'PATCH') {
            return new JsonResponse(['status' => 'Method not allowed!'], Response::HTTP_METHOD_NOT_ALLOWED);
        }

        $data = json_decode($request->getContent(), true);
        $allowedFields = ['Name', 'FirstName', 'Password', 'Mail', 'Address', 'ZipCode', 'City', 'Country'];
        $errors = [];

        foreach ($data as $field => $value) {
            if (!in_array($field, $allowedFields)) {
                $errors[$field] = 'Not a valid field';
                continue;
            }

            switch ($field) {
                case 'Name':
                case 'FirstName':
                case 'Password':
                case 'Mail':
                case 'Address':
                case 'City':
                case 'Country':
                    if (!is_string($value)) $errors[$field] = 'Must be a string';
                    break;
                case 'ZipCode':
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
                case 'Name': $user->setName($value); break;
                case 'FirstName': $user->setFirstName($value); break;
                case 'Password': $user->setPassword($value); break;
                case 'Mail': $user->setMail($value); break;
                case 'Address': $user->setAddress($value); break;
                case 'ZipCode': $user->setZipCode($value); break;
                case 'City': $user->setCity($value); break;
                case 'Country': $user->setCountry($value); break;
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
