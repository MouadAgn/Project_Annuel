<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240220203211 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE files (id INT AUTO_INCREMENT NOT NULL, name_file VARCHAR(255) NOT NULL, weight DOUBLE PRECISION NOT NULL, upload_date DATETIME NOT NULL, format VARCHAR(10) NOT NULL, path VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE invoice (id INT AUTO_INCREMENT NOT NULL, purchased_date DATETIME NOT NULL, pdf VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE user ADD first_name VARCHAR(50) NOT NULL, ADD password VARCHAR(255) NOT NULL, ADD mail VARCHAR(100) NOT NULL, ADD role INT NOT NULL, ADD created_date DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', ADD address VARCHAR(150) DEFAULT NULL, ADD zip_code INT DEFAULT NULL, ADD city VARCHAR(100) DEFAULT NULL, ADD country VARCHAR(100) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE files');
        $this->addSql('DROP TABLE invoice');
        $this->addSql('ALTER TABLE user DROP first_name, DROP password, DROP mail, DROP role, DROP created_date, DROP address, DROP zip_code, DROP city, DROP country');
    }
}
