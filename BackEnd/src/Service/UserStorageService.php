<?php

namespace App\Service;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class UserStorageService
{
    private $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    public function getUserStorageCapacityInGB(User $user): float
    {
        $storageCapacityMB = $user->getStorageCapacity();
        return $this->convertMBtoGB($storageCapacityMB);
    }

    public function calculateTotalStorageUsed(User $user): float
    {
        $files = $user->getFiles();
        $totalStorageUsed = 0;
        foreach ($files as $file) {
            $totalStorageUsed += $file->getWeight();
        }
        
        return $this->convertMBtoGB($totalStorageUsed);
    }

    private function convertMBtoGB(float $sizeInMB): float
    {
        return round($sizeInMB / 1000, 2);
    }
}