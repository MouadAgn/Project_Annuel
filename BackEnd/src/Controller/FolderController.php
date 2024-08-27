<?php

namespace App\Controller;

use App\Entity\Folder;
use App\Entity\File;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\SecurityBundle\Security;
use Psr\Log\LoggerInterface;


class FolderController extends AbstractController
{
    private $security;
    private $entityManager;
    private $logger;


    public function __construct(Security $security, EntityManagerInterface $entityManager, LoggerInterface $logger)
    {
        $this->security = $security;
        $this->entityManager = $entityManager;
        $this->logger = $logger;

    }

    #[Route('/api/folders', name: 'create_folder', methods: ['POST'])]
    public function createFolder(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $user = $this->security->getUser();

        // if (!$user) {
        //     return new JsonResponse(['error' => 'User not authenticated'], 401);
        // }

        $folder = new Folder();
        $folder->setName($data['name']);
        // You might want to set the parent folder if it's provided in the request

        $this->entityManager->persist($folder);
        $this->entityManager->flush();

        return new JsonResponse([
            'message' => 'Folder created successfully',
            'id' => $folder->getId(),
            'name' => $folder->getName()
        ], 201);
    }

    #[Route('/api/folders', name: 'list_folders', methods: ['GET'])]
    public function listFolders(): JsonResponse
    {
        $folders = $this->entityManager->getRepository(Folder::class)->findAll();
        $folderData = [];

        foreach ($folders as $folder) {
            $folderData[] = [
                'id' => $folder->getId(),
                'name' => $folder->getName(),
                'fileCount' => count($folder->getFiles())
            ];
        }

        return new JsonResponse($folderData);
    }

    #[Route('/api/folders/{id}', name: 'delete_folder', methods: ['DELETE'])]
    public function deleteFolder(int $id): JsonResponse
    {
        $folder = $this->entityManager->getRepository(Folder::class)->find($id);

        if (!$folder) {
            return new JsonResponse(['error' => 'Folder not found'], 404);
        }

        $this->entityManager->remove($folder);
        $this->entityManager->flush();
        

        return new JsonResponse(['message' => 'Folder deleted successfully']);
    }

    #[Route('/api/folders/{folderId}/files', name: 'add_file_to_folder', methods: ['POST'])]
    public function addFileToFolder(Request $request, int $folderId): JsonResponse
    {
        $this->logger->info('Received request to add file to folder', ['folderId' => $folderId]);
        
        $data = json_decode($request->getContent(), true);
        $this->logger->info('Received data', ['data' => $data]);
        
        if (!isset($data['fileId'])) {
            $this->logger->error('File ID not provided in request');
            return new JsonResponse(['error' => 'File ID not provided'], 400);
        }

        $folder = $this->entityManager->getRepository(Folder::class)->find($folderId);
        $file = $this->entityManager->getRepository(File::class)->find($data['fileId']);

        if (!$folder) {
            $this->logger->error('Folder not found', ['folderId' => $folderId]);
            return new JsonResponse(['error' => 'Folder not found'], 404);
        }

        if (!$file) {
            $this->logger->error('File not found', ['fileId' => $data['fileId']]);
            return new JsonResponse(['error' => 'File not found'], 404);
        }

        try {
            $file->setFolder($folder);
            $this->entityManager->flush();
            $this->logger->info('File added to folder successfully', ['fileId' => $file->getId(), 'folderId' => $folder->getId()]);
            return new JsonResponse(['message' => 'File added to folder successfully']);
        } catch (\Exception $e) {
            $this->logger->error('Error adding file to folder', ['error' => $e->getMessage()]);
            return new JsonResponse(['error' => 'An error occurred while adding the file to the folder'], 500);
        }
    }

    #[Route('/api/folders/{id}/files', name: 'list_files_in_folder', methods: ['GET'])]
    public function listFilesInFolder(int $id): JsonResponse
    {
        $folder = $this->entityManager->getRepository(Folder::class)->find($id);

        if (!$folder) {
            return new JsonResponse(['error' => 'Folder not found'], 404);
        }

        $files = $folder->getFiles();
        $fileData = [];

        foreach ($files as $file) {
            $fileData[] = [
                'id' => $file->getId(),
                'name' => $file->getNameFile(),
                'weight' => $file->getWeight(),
                'format' => $file->getFormat(),
                'uploadDate' => $file->getUploadDate()->format('Y-m-d H:i:s')
            ];
        }

        return new JsonResponse($fileData);
    }
}