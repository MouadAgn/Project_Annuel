<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

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
}
