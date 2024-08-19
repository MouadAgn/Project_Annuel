<?php

namespace App\Controller;

use App\Entity\Invoice;
use App\Entity\User;
use App\Repository\InvoiceRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use TCPDF;
use Symfony\Component\HttpFoundation\Response;

class InvoiceController extends AbstractController
{
    private $entityManager;
    private $invoiceRepository;

    public function __construct(EntityManagerInterface $entityManager, InvoiceRepository $invoiceRepository)
    {
        $this->entityManager = $entityManager;
        $this->invoiceRepository = $invoiceRepository;
    }

    #[Route("/api/invoice/create", name: 'invoice_create', methods: ['POST'])]
    public function createInvoice(Request $request, ValidatorInterface $validator): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (empty($data['user_id'])) {
            return new JsonResponse(['error' => 'Invalid data'], 400);
        }

        $user = $this->entityManager->getRepository(User::class)->find($data['user_id']);
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], 404);
        }

        $invoice = new Invoice();
        $invoice->setPurchasedDate(new \DateTime());
        $invoice->setUser($user);

        // Generate the PDF
        $pdf = new TCPDF();
        $pdf->AddPage();

        $htmlContent = "
            <h1>Invoice #{$invoice->getId()}</h1>
            <p>User ID: {$user->getId()}</p>
            <p>Name: {$user->getName()}</p>
            <p>Surname: {$user->getUsername()}</p>
            <p>Email: {$user->getMail()}</p>
            <p>Price: $20</p>
            <p>Date: " . $invoice->getPurchasedDate()->format('Y-m-d H:i:s') . "</p>
        ";

        $pdf->writeHTML($htmlContent);

        // Ensure the invoices directory exists
        $invoicesDir = $this->getParameter('kernel.project_dir') . '/invoices';
        if (!is_dir($invoicesDir)) {
            mkdir($invoicesDir, 0775, true);
        }

        $pdfFilePath = $invoicesDir . '/invoice_' . uniqid() . '.pdf';
        $pdf->Output($pdfFilePath, 'F');

        $invoice->setPdf($pdfFilePath);

        $errors = $validator->validate($invoice);
        if (count($errors) > 0) {
            return new JsonResponse(['error' => (string) $errors], 400);
        }

        $this->entityManager->persist($invoice);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Invoice created successfully', 'invoice_id' => $invoice->getId()], 201);
    }


    #[Route("/api/invoice/delete/{id}", name: 'invoice_delete', methods: ['DELETE'])]
    public function deleteInvoice($id): JsonResponse
    {
        $invoice = $this->invoiceRepository->find($id);
        if (!$invoice) {
            return new JsonResponse(['error' => 'Invoice not found'], 404);
        }

        $this->entityManager->remove($invoice);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Invoice deleted successfully'], 200);
    }

    #[Route("/api/invoice/{id}", name: 'invoice_get', methods: ['GET'])]
    public function getInvoice($id): JsonResponse
    {
        $invoice = $this->invoiceRepository->find($id);
        if (!$invoice) {
            return new JsonResponse(['error' => 'Invoice not found'], 404);
        }

        return new JsonResponse([
            'id' => $invoice->getId(),
            'purchasedDate' => $invoice->getPurchasedDate()->format('Y-m-d H:i:s'),
            'pdf' => $invoice->getPdf(),
            'user' => [
                'id' => $invoice->getUser()->getId(),
                'name' => $invoice->getUser()->getName(),
                'username' => $invoice->getUser()->getUsername(),
                'email' => $invoice->getUser()->getMail(),
            ],
        ], 200);
    }
    
    #[Route("/api/invoices", name: 'invoice_list', methods: ['GET'])]
    public function listInvoices(): JsonResponse
    {
        $invoices = $this->invoiceRepository->findAll();
        $invoiceData = [];

        foreach ($invoices as $invoice) {
            $invoiceData[] = [
                'id' => $invoice->getId(),
                'purchasedDate' => $invoice->getPurchasedDate()->format('Y-m-d H:i:s'),
                'pdf' => $invoice->getPdf(),
                'user' => [
                    'id' => $invoice->getUser()->getId(),
                    'name' => $invoice->getUser()->getName(),
                    'username' => $invoice->getUser()->getUsername(),
                    'email' => $invoice->getUser()->getMail(),
                ],
            ];
        }

        return new JsonResponse($invoiceData, 200);
    }

    #[Route("/api/invoice/download/{id}", name: 'invoice_download', methods: ['GET'])]
    public function downloadInvoice($id): Response
    {
        $invoice = $this->invoiceRepository->find($id);
        if (!$invoice) {
        return new JsonResponse(['error' => 'Invoice not found'], 404);
    }

        $pdfPath = $invoice->getPdf();

        if (!file_exists($pdfPath)) {
            return new JsonResponse(['error' => 'File not found'], 404);
        }

        return $this->file($pdfPath);
    }

}
