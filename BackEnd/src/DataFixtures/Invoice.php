<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\ORM\EntityManagerInterface;

use App\Entity\Invoice as InvoiceEntity;
use App\Entity\User;

use Faker\Factory;


class Invoice extends Fixture
{
    private $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    public function load(ObjectManager $manager): void
    {
        // $faker = Factory::create();
        /* 
        for ($i = 0; $i < 10; $i++) {
            $userId = rand(1, 10);
            $user = $this->em->getRepository(User::class)->find($userId);

            $invoice = new InvoiceEntity();
            $invoice->setPurchasedDate($faker->dateTimeThisYear());
            $invoice->setPdf($faker->url);
            $invoice->setUser($user);

            $manager->persist($invoice);
        }

        $manager->flush(); */
    }
}
