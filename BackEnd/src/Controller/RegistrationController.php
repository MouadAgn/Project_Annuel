<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\RegistrationFormType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface; // Importez l'interface

class RegistrationController extends AbstractController
{

    private $entityManager; // Déclarez une propriété pour stocker l'EntityManager

    public function __construct(EntityManagerInterface $entityManager) // Injectez l'EntityManager dans le constructeur
    {
        $this->entityManager = $entityManager;
    }
    
    /**
     * @Route("/registration", name="registration")
     */
    
    public function register(Request $request, MailerInterface $mailer, SessionInterface $session): Response
    {
        $user = new User();
        $form = $this->createForm(RegistrationFormType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            // Enregistrer l'utilisateur en base de données
            
            $user->setRole(0);
            $user->setCreatedDate(new \DateTimeImmutable());
            $this->entityManager->persist($user);
            $this->entityManager->flush();

            // Envoyer l'e-mail de confirmation
            $email = (new Email())
                ->from('votre@email.com')
                ->to($user->getMail())
                ->subject('Confirmation d\'inscription')
                ->text('Votre inscription a été confirmée.');

            $mailer->send($email);

            // Ajouter un message flash de succès
            $this->addFlash('success', 'Inscription réussie !');

            // Rediriger l'utilisateur vers une autre page, par exemple, la page d'accueil
            // return $this->redirectToRoute('home');
        }

        return $this->render('registration/index.html.twig', [
            'registrationForm' => $form->createView(),
        ]);
    }
}
