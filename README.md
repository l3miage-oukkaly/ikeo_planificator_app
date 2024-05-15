## Bienvenue au Projet Integrateur 2024

 IKEO, une application web dédiée à l'optimisation des plannings de livraison en entrepôt et à la gestion efficace des tournées des livreurs.

![IKEO_LOGO](./IKEO_LOGO.png)

# Contributeurs:
##### - OURZIK    Jugurta
##### - OUKKAL    Yacine
##### - BOUQUETY  Andy
##### - MIEL      Nils
##### - FARINA    Alessandro
##### - MONACHON  Vivian

Niveau: Licence 3 MIAGE 
---

### Technologies & environements :

* Java/Springboot pour le back-end ( RO et server métier).
* PostgreSQL pour la base de données.
* Docker pour la conteneurisation de l'application.
* Angular et angularMaterial pour le front-end.
* Openrouteservice et data.gouv APIs pour la carte et le géocodage.
* Jest  et Junit pour les tests.

---

### Objectifs du projet:
* Développement d'un produit suivant des spécifications.
* Intégration des connaissances acquises au long de l'année universitaire 2023-2024.
* Maîtrise du Gitflow (features et branches, pull requests et  routines de revue de code ).
* Daily meetings et collaboration entre équipes.
* Mise en place de la méthodologie agile.
* Mise en place d'une organisation en pair programming.
* Exploration du DevOps.
* Compréhension de la philosophie de springboot et particulièrement le concept de l'inversion de contrôle à travers l'injection de dépendances.
* Maîtrise de l'architecture hexagonale.
* Maîtrise de la gestion d'erreurs.
* Compréhension plus approfondie de certaines notions vue en cours comme les observables en angular et les promesses.
* Maîtrise de l'architecture MVVM.
* Développement de test unitaires et de tests d'intégration.
* Mise en pratique des algorithmes vue en cours de la RO pour l'optimisations des itinéraires de livraison.

---

### Comment lancer le server
mettez vous à la racine du projet et sur la ligne de commande tapez la commande suivante:

```sh
  docker-compose -f docker/docker-compose-prod.yml up --build &
  ```
---

### Comment contribuer:

Ce que vous devez faire :

    Créer un projet (Fork).
    Cloner le repo forké localement.
    Ajouter quelques changements localement, pousser vers votre repo forké.
    Ensuite, lancez une pull request vers ce repo.

Pour plus de détails, voici les étapes à suivre.

    Tout d'abord, forker le projet sur github.

    Utilisez git pour cloner et installer votre projet forké localement.


    # après le clonage, naviguer vers le projet

    # pour synchroniser avec l'origine
    git remote add upstream <main_repo_url>
    git remote add origin <your_forked_repo_url>


    # pour configurer votre branche de développement locale
    git branch your_local_branch
    git checkout votre_branche_locale

    # pour ajouter vos modifications
    git add *
    git commit -m "+votre_branche_locale : votre commit ici"

    # pousser vers votre repo forké
    git push origin votre_branche_locale



# Ikeo PlanificatorProtocols - V1.0 

### Version française :

L'application permet à un planificateur d'entrepôt de créer chaque jour, un planning de livraison pour
la journée suivante. On appellera typiquement ce planning une "Journée".

L'application donne également au planificateur la possibilité de visualiser la Journée à J+1 si celle-ci a
déjà été programmée.

Au démarrage de l'application :
- Le planificateur saisit son adresse mail afin de créer un header d'identification pour les
  requêtes au serveur
- Il accède ensuite à un écran avec un bouton qui lui permet de construire la Journée J+1, ou bien de la visualiser si 
elle est déjà planifiée

Le processus de création d'une Journée consiste en : 
- Requête au serveur d'un bundle de données sous la forme :
  - Bundle { Livraisons : Delivery[], Livreurs : DeliveryMan[], Camions : Truck[] }
  - La liste Livraisons correspond à une liste des 30 commandes les plus anciennes,
regroupées en sous-listes adressées au même Client
  - La liste Livreurs correspond à une liste de livreurs \[Prénom, Nom, ID]
- Affichage d'une vue qui permet au Planificateur de créer des tournées et d'y affecter les différentes livraisons
& équipes
  - Ainsi, lorsque le planificateur ajoute une tournée, il doit sélectionner le ou les livreurs qui se chargeront de 
  la livraison, ainsi que le camion qu'ils conduiront. Cet ensemble forme une Equipe.
  - Lors de la création de la **première tournée**, toutes les livraisons reçues y seront insérées. Le planificateur peut
  réarranger l'ordre de ces livraisons comme il le souhaite ou les affecter à d'autres tournées qu'il aura créé.
- Lorsque le Planificateur juge qu'il a terminé sa tâche, il peut confirmer la Journée à l'aide d'un bouton. S'ensuit
alors un envoi au serveur d'un bundle de données Journée sous la forme :
  - Journée { Tournées : Tournée[] }
  - Tournée { Livraisons : Tuple<Livraison, number>[], Livreurs : Livreur[], Camion, DistanceTotale : number }
    - Le Tuple<Livraison, number> consiste en une paire de valeurs : Une livraison et la distance qui la sépare du
point de livraison suivant
    - La liste livreurs est une liste d'ID de livreurs, on omet ici le Nom & le Prénom des livreurs
    - La DistanceTotale est la distance totale parcourue par le Camion lors de la Tournée.

Le processus de visualisation d'une Journée consiste en :
- Requête au serveur d'un bundle de données Journée J+1 (même format que vu précédemment)
- Affichage de chaque tournée en colonne : Equipes & Livraisons respectives

---

### Version anglaise :

The app enables a warehouse planificator to create a delivery planning for the following day. This daily planning
will typically be called "Day".

The app also lets the planificator visualize the Day D+1 if it already has been planned.

On startup :
- The planificator has to enter its email address to create an identity header for server requests
- He's then redirected to a view with a single button that lets him plan the Day D+1, or to visualize it if it's
already planned

The creation process of a Day consists in :
- Request to the server of a data bundle : 
  - Bundle { Deliveries : Delivery[], DeliveryMen : DeliveryMan[], Trucks: Truck[] }
  - The Deliveries list is the list of the 30 oldest orders, grouped in sub-lists addressed to the same Client.
  - The DeliveryMen list is a list such as \[Name, Surname, ID]
- Display of a view that enables the PlanificatorProtocols to create delivery tours and to assign teams and deliveries to each
  - Whenever the planificator creates a new tour, it has to assign one ore more delivery men to it, as well as the
truck they will be driving. They form a Team.
  - Whenever the **first delivery tour** is created, every single delivery of the Deliveries list will be assigned 
to it by default. The planificator is free to reorder them as he wishes, or to assign some of it to other existing
delivery tours.
- When the planificator is done with the task, he can confirm the Day thanks to a button. The client thus sends 
the Day data bundle to the server : 
  - Day { DeliveryTours : DeliveryTour[] }
  - DeliveryTour { Deliveries : Tuple<Delivery, number>[], DeliveryMen : DeliveryMan[], Truck, TotalDistance : number }
    - The Tuple<Delivery, number> is a pair of values : A delivery and the distance to the next delivery point
    - The list of delivery men is a list of their IDs, we omit their Name & Surname 
    - The TotalDistance is the total distance that the Truck covers during the Delivery Tour.

The visualization process is :
- A request to the server of a Day data bundle D+1 (same data structure as the previous one)
- Display of each Delivery Tour in columns : respective Teams & Deliveries
