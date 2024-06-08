<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

use App\Entity\User as UserEntity;

use Faker\Factory;

class User extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create();

        for ($i = 0; $i < 10; $i++) {
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
        }

        $manager->flush();
    }
}
