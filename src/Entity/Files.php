<?php

namespace App\Entity;

use App\Repository\FilesRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: FilesRepository::class)]
class Files
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $NameFile = null;

    #[ORM\Column]
    private ?float $Weight = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $UploadDate = null;

    #[ORM\Column(length: 10)]
    private ?string $Format = null;

    #[ORM\Column(length: 255)]
    private ?string $Path = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNameFile(): ?string
    {
        return $this->NameFile;
    }

    public function setNameFile(string $NameFile): static
    {
        $this->NameFile = $NameFile;

        return $this;
    }

    public function getWeight(): ?float
    {
        return $this->Weight;
    }

    public function setWeight(float $Weight): static
    {
        $this->Weight = $Weight;

        return $this;
    }

    public function getUploadDate(): ?\DateTimeInterface
    {
        return $this->UploadDate;
    }

    public function setUploadDate(\DateTimeInterface $UploadDate): static
    {
        $this->UploadDate = $UploadDate;

        return $this;
    }

    public function getFormat(): ?string
    {
        return $this->Format;
    }

    public function setFormat(string $Format): static
    {
        $this->Format = $Format;

        return $this;
    }

    public function getPath(): ?string
    {
        return $this->Path;
    }

    public function setPath(string $Path): static
    {
        $this->Path = $Path;

        return $this;
    }
}
