<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserRepository::class)]
class User
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $Id = null;

    #[ORM\Column(length: 50)]
    private ?string $Name = null;

    #[ORM\Column(length: 50)]
    private ?string $FirstName = null;

    #[ORM\Column(length: 255)]
    private ?string $Password = null;

    #[ORM\Column(length: 100, unique: true)]
    private ?string $Mail = null;

    #[ORM\Column(type: "integer")]
    private int $Role = self::ROLE_USER;

    public const ROLE_USER = 0;
    public const ROLE_ADMIN = 1;

    #[ORM\Column]
    private ?\DateTimeImmutable $CreatedDate = null;

    #[ORM\Column(length: 150, nullable: true)]
    private ?string $Address = null;

    #[ORM\Column(nullable: true)]
    private ?int $ZipCode = null;

    #[ORM\Column(length: 100, nullable: true)]
    private ?string $City = null;

    #[ORM\Column(length: 100, nullable: true)]
    private ?string $Country = null;

    public function getId(): ?int
    {
        return $this->Id;
    }

    public function getName(): ?string
    {
        return $this->Name;
    }

    public function setName(string $Name): static
    {
        $this->Name = $Name;

        return $this;
    }

    public function getFirstName(): ?string
    {
        return $this->FirstName;
    }

    public function setFirstName(string $FirstName): static
    {
        $this->FirstName = $FirstName;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->Password;
    }

    public function setPassword(string $Password): static
    {
        $this->Password = $Password;

        return $this;
    }

    public function getMail(): ?string
    {
        return $this->Mail;
    }

    public function setMail(string $Mail): static
    {
        $this->Mail = $Mail;

        return $this;
    }

    public function getRole(): ?int
    {
        return $this->Role;
    }

    public function setRole(int $Role): static
    {
        $this->Role = $Role;
        return $this;
    }

    public function getCreatedDate(): ?\DateTimeImmutable
    {
        return $this->CreatedDate;
    }

    public function setCreatedDate(\DateTimeImmutable $CreatedDate): static
    {
        $this->CreatedDate = $CreatedDate;

        return $this;
    }

    public function getAddress(): ?string
    {
        return $this->Address;
    }

    public function setAddress(?string $Address): static
    {
        $this->Address = $Address;

        return $this;
    }

    public function getZipCode(): ?int
    {
        return $this->ZipCode;
    }

    public function setZipCode(?int $ZipCode): static
    {
        $this->ZipCode = $ZipCode;

        return $this;
    }

    public function getCity(): ?string
    {
        return $this->City;
    }

    public function setCity(?string $City): static
    {
        $this->City = $City;

        return $this;
    }

    public function getCountry(): ?string
    {
        return $this->Country;
    }

    public function setCountry(?string $Country): static
    {
        $this->Country = $Country;

        return $this;
    }

 /*    public function addUser(User $user): static
    {
        if(!$this->users->contains($user)) {
            $this->users[] = $user;
            $user->addUser($this);
        }
    } */

    public function isAdmin(): bool
    {
        return $this->Role === self::ROLE_ADMIN;
    }
}
