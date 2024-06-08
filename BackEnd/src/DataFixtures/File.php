<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\ORM\EntityManagerInterface;


use App\Entity\Files as FilesEntity;
use App\Entity\User;

use Faker\Factory;



class Files extends Fixture
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
            // $user = $this->em->getRepository(User::class)->find($userId);
            
            $file = new FilesEntity();
            $file->setNameFile($faker->name);
            $file->setWeight($faker->randomFloat(2, 0, 100));
            $file->setUploadDate($faker->dateTimeThisYear());
            $file->setFormat($faker->randomElement(['jpg', 'png', 'pdf']));
            $file->setPath($faker->url);
            // $file->setUser($user);

            $manager->persist($file);
        }

        $manager->flush(); */
    }
}
