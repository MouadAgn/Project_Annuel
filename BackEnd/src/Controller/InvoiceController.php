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
        <style>
            body { font-family: Arial, sans-serif; }
            h1 { color: #333; }
            p { color: #666; line-height: 1.6; }
            .email-template {
                width: 100%;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 5px;
                background-color: #f9f9f9;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .email-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 20px;
            }
            .email-header .left {
                text-align: left;
            }
            .email-header .right {
                text-align: right;
                font-weight: bold;
            }
            .email-body {
                margin-bottom: 20px;
            }
            .email-footer {
                border-top: 1px solid #ddd;
                padding-top: 10px;
                text-align: center;
                color: #888;
            }
        </style>
        
        <div class='email-template'>
            <div class='email-header'>
                <div class='left'>
                    <h1>Facture</h1>
                </div>
                <div class='right'>
                    <p> <strong>" . $invoice->getPurchasedDate()->format('Y-m-d') . "</strong>.</p>
                    <p> <strong>" . $user->getAddress() . "</strong>.</p>
                </div>
            </div>
            <div class='email-body'>
                <p>Bonjour Mr. {$user->getName()},</p>
                <p>Voici votre facture numéro <strong>#{$invoice->getId()}</strong>, d'un montant total de <strong>$20</strong>.</p>
                <p>Merci pour votre achat !</p>
                
                <p>Si vous avez des questions, n'hésitez pas à nous contacter à <strong>{$user->getMail()}</strong>.</p>
            </div>
            <div class='email-footer'>
                <p>Merci de votre confiance.</p>
            </div>
        </div>
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

    #[Route("/api/user/invoices", name: 'user_invoices', methods: ['GET'])]
    public function listUserInvoices(): JsonResponse
    {
        // Récupérer l'utilisateur actuellement connecté
        $user = $this->getUser();
    
        // Vérifier si l'utilisateur est authentifié
        if (!$user) {
            return new JsonResponse(['error' => 'User not authenticated'], 401);
        }
    
        // Vérifiez que l'utilisateur est bien une instance de votre classe User
        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'Invalid user type'], 500);
        }
    
        // Récupérer les factures de l'utilisateur
        $invoices = $this->invoiceRepository->findBy(['user' => $user]);
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

}
