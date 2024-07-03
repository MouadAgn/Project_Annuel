<?php

namespace App\Controller;

use App\Entity\Invoice;
use App\Entity\User;
use App\Repository\InvoiceRepository;
use Doctrine\ORM\EntityManagerInterface;
use Dompdf\Dompdf;
use Dompdf\Options;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class InvoiceController extends AbstractController
{
    private $entityManager;
    private $invoiceRepository;

    public function __construct(EntityManagerInterface $entityManager, InvoiceRepository $invoiceRepository)
    {
        $this->entityManager = $entityManager;
        $this->invoiceRepository = $invoiceRepository;
    }

    /**
     * @Route("/invoice/create", name="invoice_create", methods={"POST"})
     */
    public function createInvoice(Request $request, ValidatorInterface $validator): JsonResponse
    {
        // Extract data from request
        $data = json_decode($request->getContent(), true);

        // Validate data
        if (empty($data['user_id'])) {
            return new JsonResponse(['error' => 'Invalid data'], 400);
        }

        // Find user by ID
        $user = $this->entityManager->getRepository(User::class)->find($data['user_id']);
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], 404);
        }

        // Create and set up new Invoice entity
        $invoice = new Invoice();
        $invoice->setPurchasedDate(new \DateTime());
        $invoice->setUser($user);

        // Generate the HTML content for the PDF
        $htmlContent = "
            <html>
            <head>
                <meta charset='UTF-8'>
                <title>Invoice</title>
            </head>
            <body>
                <h1>Invoice #{$invoice->getId()}</h1>
                <p>User ID: {$user->getId()}</p>
                <p>Name: {$user->getName()}</p>
                <p>Surname: {$user->getSurname()}</p>
                <p>Email: {$user->getEmail()}</p>
                <p>Price: $20</p>
                <p>Date: " . $invoice->getPurchasedDate()->format('Y-m-d H:i:s') . "</p>
            </body>
            </html>
        ";

        $pdfOptions = new Options();
        $pdfOptions->set('defaultFont', 'Arial');

        $dompdf = new Dompdf($pdfOptions);
        $dompdf->loadHtml($htmlContent);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        // Define the PDF file path
        $pdfFilePath = 'invoices/invoice_' . uniqid() . '.pdf'; // generate unique filename
        file_put_contents($pdfFilePath, $dompdf->output());

        // Set the PDF file path in the Invoice entity
        $invoice->setPdf($pdfFilePath);

        // Validate the invoice entity
        $errors = $validator->validate($invoice);
        if (count($errors) > 0) {
            return new JsonResponse(['error' => (string) $errors], 400);
        }

        // Persist and save the invoice
        $this->entityManager->persist($invoice);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Invoice created successfully', 'invoice_id' => $invoice->getId()], 201);
    }

    /**
     * @Route("/invoice/delete/{id}", name="invoice_delete", methods={"DELETE"})
     */
    public function deleteInvoice($id): JsonResponse
    {
        // Find invoice by ID
        $invoice = $this->invoiceRepository->find($id);
        if (!$invoice) {
            return new JsonResponse(['error' => 'Invoice not found'], 404);
        }

        // Remove the invoice
        $this->entityManager->remove($invoice);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Invoice deleted successfully'], 200);
    }
}
