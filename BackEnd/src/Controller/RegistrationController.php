<?php

namespace App\Controller;


use App\Entity\User;
use Symfony\Component\Mime\Email;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\HttpFoundation\Response;

use Symfony\Component\Routing\Annotation\Route;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;

class RegistrationController extends AbstractController
{

    private $em;
    private $validator;
    private $passwordHasher;
    private $JWTManager;
    private $mailer;

    public function __construct(EntityManagerInterface $em, ValidatorInterface $validator, UserPasswordHasherInterface $passwordHasher, JWTTokenManagerInterface $JWTManager, MailerInterface $mailer)
    {
        $this->em = $em;
        $this->validator = $validator;
        $this->passwordHasher = $passwordHasher;
        $this->JWTManager = $JWTManager;
        $this->mailer = $mailer;
    }
    
    /**
     * @Route("/registration", name="registration", methods={"POST"})
     */
    #[Route('/api/register', name: 'register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        try {
            // Get the data and decode it
            $data = json_decode($request->getContent(), true);
            // var_dump($data);

            // Check if the data is present and if its not empty -- UTILISER LE VALIDATOR POUR CE BLOC
            if ((!isset($data['name']) || empty($data['name'])) || 
            (!isset($data['firstName']) || empty($data['firstName'])) || 
            (!isset($data['password']) || empty($data['password'])) || 
            (!isset($data['mail']) || empty($data['mail'])) || 
            (!isset($data['address']) || empty($data['address'])) || 
            (!isset($data['zipCode']) || empty($data['zipCode'])) || 
            (!isset($data['city']) || empty($data['city'])) || 
            (!isset($data['country']) || empty($data['country']))) {
                return new JsonResponse(['status' => 'Missing data'], Response::HTTP_BAD_REQUEST);
            } 
            

            // Check if the email already exist -- Déjà géré par le UniqueEntity
            /* $user = $this->em->getRepository(User::class)->findOneBy(['mail' => $data['mail']]);
            if ($user) {
                return new JsonResponse(['status' => 'Email already exist!'], Response::HTTP_BAD_REQUEST);
            } */

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
            $user->setMail($data['mail']);
            $user->setCreatedDate(new \DateTimeImmutable());
            $user->setAddress($data['address']);
            $user->setZipCode($data['zipCode']);
            $user->setCity($data['city']);
            $user->setCountry($data['country']);
            
            // Hash the password
            $pwd = $this->passwordHasher->hashPassword($user, $data['password']);
            $user->setPassword($pwd);

            // Check with Validator
            $errorsValidator = $this->validator->validate($user);
            if (count($errorsValidator) > 0) {
                $errorsString = (string) $errorsValidator;
                return new JsonResponse(['errors' => $errorsString], Response::HTTP_BAD_REQUEST);
            }

            // Send a confirmation email
            $email = (new Email())
                ->from($_ENV['MAILER_FROM_ADDRESS'])
                ->to($user->getMail())
                ->subject('Bienvenue sur notre Application de stockage en ligne !')
                ->text('Votre compte à bien été créé !');
            $this->mailer->send($email);

            $this->em->persist($user);
            $this->em->flush();

            return new JsonResponse(['status' => 'User created!'], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return new JsonResponse(['status' => 'User not created!', 'message' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
