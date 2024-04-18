# Ikeo Planificator - V1.0 (Golem)

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
- Display of a view that enables the Planificator to create delivery tours and to assign teams and deliveries to each
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
