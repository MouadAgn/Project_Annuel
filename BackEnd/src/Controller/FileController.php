<?php

namespace App\Controller;

use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\Finder\Finder;
use Symfony\Component\HttpFoundation\JsonResponse;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\File;
use Psr\Log\LoggerInterface;

use App\Entity\User;


class FileController extends AbstractController
{
    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    /**
     * Route pour l'ajout de fichier, méthode POST
     */
    #[Route('/api/user/add-file', name: 'add_file', methods: ['POST'])]
    public function addFile(Request $request, SluggerInterface $slugger, EntityManagerInterface $entityManager, LoggerInterface $logger): JsonResponse
    {
        
    // Vérifie si l'utilisateur est connecté
    /** @var User $user */
    $user = $this->getUser();
    if (!$user) {
        return new JsonResponse(['status' => 'KO', 'message' => 'User not found or not authenticated'], status: JsonResponse::HTTP_FORBIDDEN);
    }

    $uploadedFile = $request->files->get('file');

    if (!$uploadedFile || $uploadedFile->getError() !== UPLOAD_ERR_OK) {
        $logger->error('No file received or upload error', [
            'error' => $uploadedFile ? $uploadedFile->getError() : 'No file'
        ]);
        return new JsonResponse(['error' => 'Aucun fichier reçu ou une erreur est survenue lors du téléchargement'], 400);
    }

    // Vérification de la taille du fichier (20 Go = 20 * 1024 * 1024 * 1024 octets)
    $maxFileSize = 20 * 1024 * 1024 * 1024; // 20 Go en octets
    if ($uploadedFile->getSize() > $maxFileSize) {
        $logger->error('File size exceeds 20 GB', ['size' => $uploadedFile->getSize()]);
        return new JsonResponse(['error' => 'Le fichier ne doit pas dépasser 20 Go'], 400);
    }

    $tempPath = $uploadedFile->getPathname();
    $logger->info('Temporary file path', ['path' => $tempPath]);

    if (!file_exists($tempPath)) {
        $logger->error('Temporary file does not exist', ['path' => $tempPath]);
        return new JsonResponse(['error' => 'Le fichier temporaire n\'existe pas'], 400);
    }

    if (!is_readable($tempPath)) {
        $logger->error('Temporary file is not readable', ['path' => $tempPath]);
        return new JsonResponse(['error' => 'Le fichier temporaire n\'est pas lisible'], 400);
    }

    try {
        // Lire le contenu du fichier immédiatement
        $content = file_get_contents($tempPath);
        if ($content === false) {
            $logger->error('Failed to read temporary file', ['path' => $tempPath]);
            return new JsonResponse(['error' => 'Impossible de lire le fichier temporaire'], 500);
        }

        $originalFilename = pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $slugger->slug($originalFilename);
        $newFilename = $safeFilename.'-'.uniqid().'.'.$uploadedFile->guessExtension();
        $uploadPath = $this->getParameter('uploads_directory').'/'.$newFilename;

        // Écrire le contenu dans le nouveau fichier
        if (file_put_contents($uploadPath, $content) === false) {
            $logger->error('Failed to write file', ['path' => $uploadPath]);
            return new JsonResponse(['error' => 'Impossible d\'écrire le fichier'], 500);
        }

        $logger->info('File written successfully', ['path' => $uploadPath]);

        // Création de l'entité File
        $file = new File();
        $file->setNameFile($newFilename);
        $file->setWeight(strlen($content) / 1024 / 1024); // Taille en Mo
        $file->setUploadDate(new \DateTime());
        $file->setFormat($uploadedFile->guessExtension());
        $file->setPath($uploadPath);
        $file->setUser(null);

        // Persist l'entité File
        $logger->info('Attempting to persist file entity');
        $entityManager->persist($file);
        $logger->info('File entity persisted, attempting to flush');
        $entityManager->flush();
        $logger->info('Entity manager flushed successfully');

        $logger->info('File entry created in database', [
            'file_id' => $file->getId(),
            'file_name' => $file->getNameFile()
        ]);

        return new JsonResponse([
            'message' => 'Fichier uploadé avec succès et enregistré dans la base de données',
            'file_id' => $file->getId(),
            'file_name' => $file->getNameFile()
        ], 200);

    } catch (\Exception $e) {
        $logger->error('Error during file upload or database operation', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
        return new JsonResponse(['error' => 'Erreur lors de l\'upload ou de l\'enregistrement en base de données: '.$e->getMessage()], 500);
    }
}


/**
 * Route pour afficher tous les fichiers dans public/uploads, méthode GET
 */
#[Route('/api/list-files', name: 'list_files', methods: ['GET'])]
public function listFiles(EntityManagerInterface $entityManager): JsonResponse 
{
    $fileRepository = $entityManager->getRepository(File::class);
    $files = $fileRepository->findAll();

    $fileList = [];

    foreach ($files as $file) {
        $fileList[] = [
            'file_id' => $file->getId(),
            'name_file' => $file->getNameFile(),
            'upload_date' => $file->getUploadDate()->format('Y-m-d H:i:s'),
            'weight' => $file->getWeight(),
            'format' => $file->getFormat(),
            // You can add more fields here if needed
        ];
    }

    return new JsonResponse($fileList);
}

/**
 * Route pour supprimer un fichier, méthode DELETE
 */
#[Route('/api/delete-file/{filename}', name: 'delete_file', methods: ['DELETE'])]
public function deleteFile(string $filename, EntityManagerInterface $entityManager): Response
{
    // Chemin vers le répertoire public/uploads
    $directory = $this->getParameter('uploads_directory');

    // Chemin complet du fichier à supprimer
    $filePath = $directory . '/' . $filename;

    // Vérifie si le fichier existe
    if (!file_exists($filePath)) {
        return new JsonResponse(['message' => 'Le fichier spécifié n\'existe pas'], 404);
    }

    // Recherche l'entrée correspondante dans la base de données
    $fileRepository = $entityManager->getRepository(File::class);
    $file = $fileRepository->findOneBy(['nameFile' => $filename]);

    if (!$file) {
        return new JsonResponse(['message' => 'Le fichier n\'existe pas dans la base de données'], 404);
    }

    try {
        // Supprime le fichier physique
        unlink($filePath);

        // Supprime l'entrée de la base de données
        $entityManager->remove($file);
        $entityManager->flush();

    } catch (\Exception $e) {
        return new JsonResponse(['message' => 'Une erreur est survenue lors de la suppression du fichier: ' . $e->getMessage()], 500);
    }

    return new JsonResponse(['message' => 'Le fichier a été supprimé avec succès du système de fichiers et de la base de données'], 200);
}
}
