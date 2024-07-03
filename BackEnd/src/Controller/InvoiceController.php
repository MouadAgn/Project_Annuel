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

class InvoiceController extends AbstractController
{
    private $entityManager;
    private $invoiceRepository;

    public function __construct(EntityManagerInterface $entityManager, InvoiceRepository $invoiceRepository)
    {
        $this->entityManager = $entityManager;
        $this->invoiceRepository = $invoiceRepository;
    }

    #[Route("/invoice/create", name: 'invoice_create', methods: ['POST'])]
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

    /**
     * @Route("/invoice/delete/{id}", name="invoice_delete", methods={"DELETE"})
     */
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
}
