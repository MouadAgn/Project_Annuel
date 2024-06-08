<?php
/* 
* 
*
*
*
* Ne pas utiliser ce fichier pour l'instant
*
*
*
*/

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;


use App\Entity\Invoice as InvoiceEntity;

use App\Entity\User;

use Faker\Factory;


class Invoice extends Fixture
{
    public const ORDER = 2;

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create();

       /*  
        $users = $manager->getRepository(User::class)->findAll();
        // var_dump($manager->getRepository(User::class)->findAll());
        var_dump($users);
        for ($i = 0; $i < 10; $i++) {
            $user = $faker->randomElement($users);

            $invoice = new InvoiceEntity();
            $invoice->setPurchasedDate($faker->dateTimeThisYear());
            $invoice->setPdf($faker->url);
            $invoice->setUser($user);

            $manager->persist($invoice);
        }

        $manager->flush(); */
    }
}
