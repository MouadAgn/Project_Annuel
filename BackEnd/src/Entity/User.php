<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;

use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Validator\Constraints as Assert;

use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[UniqueEntity(fields: ['mail'], message: 'There is already an account with this email')]
class User implements PasswordAuthenticatedUserInterface, UserInterface 
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Groups(['user'])]
    #[ORM\Column(length: 50)]
    #[Assert\NotBlank]
    private ?string $name = null;

    #[Groups(['user'])]
    #[ORM\Column(length: 50)]
    #[Assert\NotBlank]
    private ?string $firstName = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    private ?string $password = null;

    #[Groups(['user'])]
    #[Assert\NotBlank]
    #[ORM\Column(length: 100, unique: true)]
    private ?string $mail = null;

    #[Groups(['user'])]
    #[Assert\NotBlank]
    #[ORM\Column(length: 150, nullable: true)]
    private ?string $address = null;

    #[Groups(['user'])]
    #[Assert\NotBlank]
    #[ORM\Column(nullable: true)]
    private ?int $zipCode = null;

    #[Groups(['user'])]
    #[Assert\NotBlank]
    #[ORM\Column(length: 100, nullable: true)]
    private ?string $city = null;

    #[Groups(['user'])]
    #[Assert\NotBlank]
    #[ORM\Column(length: 100, nullable: true)]
    private ?string $country = null;
    
    #[ORM\Column]
    // Megaoctets
    private ?int $storageCapacity = 20000;

    #[ORM\Column(type: "integer")]
    private int $role = self::ROLE_USER;
    public const ROLE_USER = 0;
    public const ROLE_ADMIN = 1;

    #[Groups(['user'])]
    #[ORM\Column]
    private ?\DateTimeImmutable $createdDate = null;

    #[Groups(['user'])]
    #[ORM\OneToMany(targetEntity: Invoice::class, mappedBy: 'user')]
    private Collection $invoices;

    #[Groups(['user'])]
    #[ORM\OneToMany(targetEntity: File::class, mappedBy: 'user', cascade: ["remove"], orphanRemoval: true)]
    private Collection $files;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $token = null;

    #[ORM\Column(type: 'boolean', options: ['default' => false])]
    private ?bool $activated = false;

    public function __construct()
    {
        $this->invoices = new ArrayCollection();
        $this->files = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): static
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public function getMail(): ?string
    {
        return $this->mail;
    }

    public function setMail(string $mail): static
    {
        $this->mail = $mail;

        return $this;
    }

    public function getRole(): ?int
    {
        return $this->role;
    }

    public function setRole(int $role): static
    {
        $this->role = $role;
        return $this;
    }

    public function getCreatedDate(): ?\DateTimeImmutable
    {
        return $this->createdDate;
    }

    public function setCreatedDate(\DateTimeImmutable $createdDate): static
    {
        $this->createdDate = $createdDate;

        return $this;
    }

    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(?string $address): static
    {
        $this->address = $address;

        return $this;
    }

    public function getZipCode(): ?int
    {
        return $this->zipCode;
    }

    public function setZipCode(?int $zipCode): static
    {
        $this->zipCode = $zipCode;

        return $this;
    }

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(?string $city): static
    {
        $this->city = $city;

        return $this;
    }

    public function getCountry(): ?string
    {
        return $this->country;
    }

    public function setCountry(?string $country): static
    {
        $this->country = $country;

        return $this;
    }

    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    public function getStorageCapacity(): int
    {
        return $this->storageCapacity;
    }

    public function setStorageCapacity(?int $storageCapacity): static
    {
        $this->storageCapacity = $storageCapacity;
        return $this;
    }

    /**
     * @return Collection<int, Invoice>
     */
    public function getInvoices(): Collection
    {
        return $this->invoices;
    }

    public function addInvoice(Invoice $invoice): static
    {
        if (!$this->invoices->contains($invoice)) {
            $this->invoices->add($invoice);
            $invoice->setUser($this);
        }

        return $this;
    }

    public function removeInvoice(Invoice $invoice): static
    {
        if ($this->invoices->removeElement($invoice)) {
            // set the owning side to null (unless already changed)
            if ($invoice->getUser() === $this) {
                $invoice->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, File>
     */
    public function getFiles(): Collection
    {
        return $this->files;
    }

    public function addFile(File $file): static
    {
        if (!$this->files->contains($file)) {
            $this->files->add($file);
            $file->setUser($this);
        }

        return $this;
    }

    public function removeFile(File $file): static
    {
        if ($this->files->removeElement($file)) {
            // set the owning side to null (unless already changed)
            if ($file->getUser() === $this) {
                $file->setUser(null);
            }
        }

        return $this;
    }

    /* 
    * Method for the UserInterface
    */

    public function getRoles(): array
    {
        if($this->role === self::ROLE_ADMIN){
            return ['ROLE_ADMIN'];
        }
        return ['ROLE_USER'];
    }

    public function getSalt(): ?string
    {
        return null;
    }

    public function getUsername(): ?string
    {
        return $this->getUserIdentifier();
    }

    public function eraseCredentials(): void
    {
    }

    public function getUserIdentifier(): string
    {
        return $this->mail;
    }

    public function getToken(): ?string
    {
        return $this->token;
    }

    public function setToken(?string $token): static
    {
        $this->token = $token;

        return $this;
    }

    public function isActivated(): ?bool
    {
        return $this->activated;
    }

    public function setActivated(bool $activated): static
    {
        $this->activated = $activated;

        return $this;
    }
}