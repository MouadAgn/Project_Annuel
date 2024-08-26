<?php

namespace App\Controller;
use App\Entity\Invoice;
use App\Entity\User;
use App\Repository\InvoiceRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
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
    private $security;


    public function __construct(EntityManagerInterface $entityManager, InvoiceRepository $invoiceRepository, Security $security)
    {
        $this->entityManager = $entityManager;
        $this->invoiceRepository = $invoiceRepository;
        $this->security = $security;
    }    

    #[Route("/api/invoice/create", name: 'invoice_create', methods: ['POST'])]
    public function createInvoice(Request $request, ValidatorInterface $validator): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (empty($data['id'])) {
            return new JsonResponse(['error' => 'Invalid data'], 400);
        }

        $user = $this->entityManager->getRepository(User::class)->find($data['id']);
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
            <style>
                body { font-family: Arial, sans-serif; }
                h1 { color: #333; }
                p { color: #666; line-height: 1.6; }
                .invoice-template {
                    width: 100%;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    background-color: #f9f9f9;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .invoice-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 20px;
                }
                .invoice-header .left {
                    text-align: left;
                }
                .invoice-header .right {
                    text-align: right;
                    font-weight: bold;
                }
                .invoice-body {
                    margin-bottom: 20px;
                }
                .invoice-footer {
                    border-top: 1px solid #ddd;
                    padding-top: 10px;
                    text-align: center;
                    color: #888;
                }
                .table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                .table th, .table td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                .table th {
                    background-color: #f2f2f2;
                }
                .total {
                    text-align: right;
                }
                .total-amount {
                    font-weight: bold;
                    font-size: 1.2em;
                }
            </style>
        
            <div class='invoice-template'>
                <div class='invoice-header'>
                    <div class='left'>
                        <h1>FACTURE N° " . $invoice->getId() . "</h1>
                        <p><strong>Nom de l'entreprise : </strong> " . "Tech Innovators SARL" . "</p>
                        <p><strong>Adresse : </strong> " . "12 Rue des Entrepreneurs, 75015 Paris, France" . "</p>
                        <p><strong>SIRET : </strong> " . "812 345 678 00012" . "</p>
                    </div>
                    <div class='right'>
                        <p><strong>Date de facture:</strong> " . $invoice->getPurchasedDate()->format('Y-m-d') . "</p>
                        <p><strong>Nom du client:</strong> " . $user->getName() . "</p>
                        <p><strong>Adresse du client:</strong> " . $user->getAddress() . "</p>
                    </div>
                </div>
        
                <div class='invoice-body'>
                    <table class='table'>
                        <thead>
                            <tr>
                                <th>item</th>
                                <th>Prix unitaire HT</th>
                                <th>Quantité</th>
                                <th>Montant HT</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>20go</td>
                                <td>" . "$16.00" . " €</td>
                                <td>" . "1" . "</td>
                                <td>" . "$16.00" . " €</td>
                            </tr>
                        </tbody>
                    </table>
        
                    <p class='total'><strong>Total HT:</strong> " . "$16.00 HT" . " €</p>
                    <p class='total'><strong>TVA (" . "20%" . "%):</strong> " . "20%" . " €</p>
                    <p class='total total-amount'><strong>Total TTC:</strong> " . "$20.00 TTC" . " €</p>
                </div>
        
            </div>
        ";

        $pdf->writeHTML($htmlContent);

            // Define the invoices directory within the public directory
    $invoicesDir = $this->getParameter('kernel.project_dir') . '/public/invoices';

    // Ensure the invoices directory exists
    if (!is_dir($invoicesDir)) {
        mkdir($invoicesDir, 0775, true);
    }

    // Generate the PDF file name and path
    $pdfFileName = 'invoice_' . uniqid() . '.pdf';
    $pdfFilePath = $invoicesDir . '/' . $pdfFileName;

    // Output the PDF to the file path
    $pdf->Output($pdfFilePath, 'F');

    // Store the relative path in the database
    $invoice->setPdf('/invoices/' . $pdfFileName);

    // Validate and save the invoice entity
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

        $pdfPath = $this->getParameter('kernel.project_dir') . '/public' . $invoice->getPdf();

        if (!file_exists($pdfPath)) {
            return new JsonResponse(['error' => 'File not found'], 404);
        }

        return $this->file($pdfPath);
    }


    #[Route("/api/user/invoices", name: 'user_invoices', methods: ['GET'])]
    public function listUserInvoices(): JsonResponse
    {
        // Récupérer l'utilisateur actuellement connecté
        /**
        * @var User $user
        */
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['status' => 'KO', 'message' => 'User not found or not authenticated'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Vérifiez que l'utilisateur est bien une instance de votre classe User
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'Invalid user type'], 500);
        }

        // Récupérer les factures de l'utilisateur
        $invoices = $this->invoiceRepository->findBy(['user' => $user]);
        $pdfUrls = [];

        foreach ($invoices as $invoice) {
            $pdfUrls[] = $invoice->getPdf();
        }

        return new JsonResponse($pdfUrls, 200);
    }

}
