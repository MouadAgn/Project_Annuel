<?php

namespace App\Controller;

use App\Form\FileUploadType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class FileUploadController extends AbstractController
{
    /**
     * @Route("/upload", name="file_upload")
     */
    public function upload(Request $request): Response
    {
        $form = $this->createForm(FileUploadType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $file = $form->get('file')->getData();

            // Gérez le téléchargement du fichier ici, par exemple, en le déplaçant vers un répertoire de stockage

            $this->addFlash('success', 'Le fichier a été téléversé avec succès.');

            return $this->redirectToRoute('file_upload');
        }

        return $this->render('file_upload/index.html.twig', [
            'form' => $form->createView(),
        ]);
    }
}
