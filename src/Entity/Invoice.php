<?php

namespace App\Entity;

use App\Repository\InvoiceRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: InvoiceRepository::class)]
class Invoice
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $PurchasedDate = null;

    #[ORM\Column(length: 255)]
    private ?string $Pdf = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPurchasedDate(): ?\DateTimeInterface
    {
        return $this->PurchasedDate;
    }

    public function setPurchasedDate(\DateTimeInterface $PurchasedDate): static
    {
        $this->PurchasedDate = $PurchasedDate;

        return $this;
    }

    public function getPdf(): ?string
    {
        return $this->Pdf;
    }

    public function setPdf(string $Pdf): static
    {
        $this->Pdf = $Pdf;

        return $this;
    }
}
