<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

use App\Entity\User as UserEntity;
use App\Entity\Invoice as InvoiceEntity;
use App\Entity\File as FileEntity;


use Faker\Factory;

class User extends Fixture
{
    public const ORDER = 1;
    
    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create();

        for ($i = 0; $i < 10; $i++) {

            // Ajoute 10 Fake User
            $user = new UserEntity();
            $user->setName($faker->name);
            $user->setFirstName($faker->firstName);
            $user->setMail($faker->email);
            $user->setPassword($faker->password);
            $user->setAddress($faker->address);
            $user->setZipCode($faker->randomNumber(5, true));
            $user->setStorageCapacity(20000);
            $user->setCreatedDate(new \DateTimeImmutable());
            $user->setCity($faker->city);
            $user->setCountry($faker->country);
            $user->setRole(0);
            
            $manager->persist($user);

            // Ajoute 10 Fake Invoice
            $invoice = new InvoiceEntity();
            $invoice->setPurchasedDate($faker->dateTimeThisYear());
            $invoice->setPdf($faker->url);
            $invoice->setUser($user);

            $manager->persist($invoice);

            // Ajoute 10 Fake File
            $file = new FileEntity();
            $file->setNameFile($faker->name);
            $file->setWeight($faker->numberBetween(1, 1000));
            $file->setUploadDate($faker->dateTimeThisYear());
            $file->setFormat($faker->randomElement(['jpg', 'png', 'pdf']));
            $file->setPath($faker->url);
            $file->setUser($user);

            $manager->persist($file);
        }

        $manager->flush();
    }
}
