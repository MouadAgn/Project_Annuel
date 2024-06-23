## BACKEND
Installer les dépendances :

`cd .\BackEnd`

`composer i`

Générer une Pair de clés : 

`cd .\BackEnd`

`php bin/console lexik:jwt:generate-keypair`


Ajouter des fakes données : 

`cd .\BackEnd`

`php bin/console doctrine:fixtures:load`


#### MAILER : 
Pour mettre en place la simulation d'envoi de mail : 

Ajouter vos paramètres `MAILER_DSN` transmis par MailTrap dans le fichier `.env`

## FRONTEND
Installer les dépendances :

`cd .\FrontEnd`

`npm i`
