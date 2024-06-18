<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\Finder\Finder;
use Symfony\Component\HttpFoundation\JsonResponse;


class FileController extends AbstractController
{
    /**
     * Route pour l'ajout de fichier, méthode POST
     */
    #[Route('/api/add-file', name: 'add_file', methods: ['POST'])]
    public function addFile(Request $request, SluggerInterface $slugger): Response
    {
        $file = $request->files->get('file');

        if ($file === null) {
            return new Response("Aucun fichier reçu dans la requête", 400);
        }
        
        if (!$file instanceof UploadedFile) {
            return new Response("Le fichier reçu n'est pas une instance de UploadedFile", 400);
        }
        
        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $slugger->slug($originalFilename);
        $newFilename = $safeFilename . '-' . uniqid() . '.' . $file->guessExtension();
        
        try {
            $file->move(
                $this->getParameter('uploads_directory'),
                $newFilename
            );
        } catch (FileException $e) {
            return new Response("Échec de l'upload du fichier : " . $e->getMessage(), 500);
        }
        
        return new Response("Fichier uploadé avec succès", 200);
    }

/**
 * Route pour afficher tous les fichiers dans public/uploads, méthode GET
 */
#[Route('/api/list-files', name: 'list_files', methods: ['GET'])]
public function listFiles(): Response
{
    // Chemin vers le répertoire public/uploads
    $directory = $this->getParameter('uploads_directory');

    // Crée un Finder pour parcourir les fichiers dans le répertoire
    $finder = new Finder();
    $finder->files()->in($directory);

    // Initialise un tableau pour stocker les noms des fichiers
    $fileList = [];

    // Parcourt chaque fichier trouvé
    foreach ($finder as $file) {
        // Ajoute le nom du fichier à la liste
        $fileList[] = $file->getFilename();
    }

    // Retourne la liste des fichiers au format JSON
    return $this->json($fileList);
}

/**
 * Route pour supprimer un fichier, méthode DELETE
 */
#[Route('/api/delete-file/{filename}', name: 'delete_file', methods: ['DELETE'])]
public function deleteFile(string $filename): Response
{
    // Chemin vers le répertoire public/uploads
    $directory = $this->getParameter('uploads_directory');

    // Chemin complet du fichier à supprimer
    $filePath = $directory . '/' . $filename;

    // Vérifie si le fichier existe
    if (!file_exists($filePath)) {
        return new JsonResponse(['message' => 'Le fichier spécifié n\'existe pas'], 404);
    }

    // Supprime le fichier
    try {
        unlink($filePath);
    } catch (\Exception $e) {
        return new JsonResponse(['message' => 'Une erreur est survenue lors de la suppression du fichier'], 500);
    }

    return new JsonResponse(['message' => 'Le fichier a été supprimé avec succès'], 200);
}

}
