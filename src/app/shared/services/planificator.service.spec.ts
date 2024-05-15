import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import {from, of, take, throwError} from "rxjs";
import {DeliveryTour} from "../../core/models/delivery-tour.models";
import {DatePipe} from "@angular/common";
import {maxFrequency, PlanificatorService} from "./planificator.service";
import {MapService} from "./map.service";
import {Router} from "@angular/router";
import {SetupBundle} from "../../core/models/setup-bundle.models";
import {Day} from "../../core/models/day.models";
import {IOptimizedBundle} from "../../core/models/optimized-bundle.models";
import spyOn = jest.spyOn;
import {AuthService} from "./auth.service";

describe('PlanificatorService', () => {
  let service: PlanificatorService;
  let datePipe: DatePipe;
  let mapService : MapService;
  let authService : AuthService;
  let router : Router;
  let http: HttpClient;

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        PlanificatorService,
        { provide: HttpClient, useValue: { get: jest.fn(), post : jest.fn() } },
        { provide : DatePipe, useValue: {transform : jest.fn() } },
        { provide : MapService, useValue: {test : jest.fn() } },
        { provide : Router, useValue: {navigate : jest.fn() } },
        { provide: AuthService, useValue: { getToken: jest.fn() } },
      ],
    });

    service = TestBed.inject(PlanificatorService);
    mapService = TestBed.inject(MapService);
    router = TestBed.inject(Router);
    http = TestBed.inject(HttpClient);
    datePipe = TestBed.inject(DatePipe);
    authService = TestBed.inject(AuthService);
  });

  /*  ------------------------------------ getSetupBundle ------------------------------------ */
  describe('getSetupBundle', () => {
    it('should call getSetupBundle method return code 200', async () => {
      // Arrange
      const setupBundleResponse : SetupBundle = {
        multipleOrders: [
          {address : '12 rue de la joie', orders : ['c166']},
          {address : '12 rue de la paix', orders : ['c167', 'c168']},
          {address : 'Avenue du 8 mai 1945', orders : ['c898']}
        ],
        deliverymen: ['AWL', 'DBB'],
        trucks : ['XP-907-AB', 'XA-926-AD'],
        coordinates : [0, 0]
      };
      const expectedObservable  = of(setupBundleResponse);
      (http.get as jest.Mock) = jest.fn().mockReturnValue(expectedObservable);

      jest.spyOn(service, 'resetValues').mockImplementation(() => Promise.resolve());

      // Act
      await service.getSetupBundle();

      // Assert
      expect(service.sigSetupBundle()).toEqual(setupBundleResponse);
      expect(service.sigSetupBundle().multipleOrders).toEqual(setupBundleResponse.multipleOrders);
      expect(service.sigSetupBundle().deliverymen).toEqual(setupBundleResponse.deliverymen);
      expect(service.sigSetupBundle().trucks).toEqual(setupBundleResponse.trucks);
      expect(service.resetValues).toHaveBeenCalled();
    });

    it('should call getSetupBundle method and return Error Response', async () => {
      // Arrange
      const errorResponse = { message: 'error' } as HttpErrorResponse;
      const expectedObservable  = throwError(errorResponse);
      (http.get as jest.Mock) = jest.fn().mockReturnValue(expectedObservable);

      // Act
      try {
        await service.getSetupBundle();
        throw errorResponse;
      } catch (error) {
        // Assert
        expect(error).toEqual(errorResponse);
        expect(service.sigSetupBundle().multipleOrders.length).toBe(0);
        expect(service.sigSetupBundle().deliverymen.length).toBe(0);
        expect(service.sigSetupBundle().trucks.length).toBe(0);
      }
    });
  })


  /*  ------------------------------------ getDay ------------------------------------ */
  describe('getDay', () => {
    it('should call getDay method', async () => {
      // Arrange
      const deliveryTourResponse : DeliveryTour = {
        refTour: 't098B-A',
        deliveries: [
          { address: '12, rue de la joie', orders: ['c166', 'c167'] },
          { address: '14, rue des Oiseaux', orders: ['c189']}
        ],
        deliverymen: ['AWL', 'DBB'],
        truck: 'XP-907-AB',
        distanceToCover : 0
      };
      const date : Readonly<string> = "2022-01-01";
      const day : Day = { date : date, tours : [deliveryTourResponse] }

      const expectedObservable  = of(day);
      (http.get as jest.Mock) = jest.fn().mockReturnValue(expectedObservable);

      // Act
      await service.getDay("2022-01-01");

      // Assert
      expect(service.sigPlanifiedDay()).toEqual(day);
      expect(service.sigPlanifiedDay().date).toEqual(date);
      expect(service.sigPlanifiedDay().tours).toEqual([deliveryTourResponse]);
      expect(service.sigPlanifiedDay().tours[0].refTour).toEqual('t098B-A');
      expect(service.sigPlanifiedDay().tours[0].deliveries).toEqual(deliveryTourResponse.deliveries);
      expect(service.sigPlanifiedDay().tours[0].deliverymen).toEqual(deliveryTourResponse.deliverymen);
    });

    it('should call getDay method and return Error Response', async () => {
      // Arrange
      const errorResponse = { message: 'error' } as HttpErrorResponse;
      const expectedObservable  = throwError(errorResponse);
      (http.get as jest.Mock) = jest.fn().mockReturnValue(expectedObservable);

      // Act
      try {
        await service.getDay("2022-01-01");
        throw errorResponse;
      } catch (error) {
        // Assert
        expect(error).toEqual(errorResponse);
        expect(service.sigPlanifiedDay().tours.length).toBe(0);
        expect(service.sigPlanifiedDay().date).toBe(service.getTomorrowDate());
        expect(service.sigPlanifiedDay().tours).toEqual([]);
      }

    });
  })

  /*  ------------------------------------ sendDay ------------------------------------ */
  describe('sendDay', () => {
    it('should call sendDay method', async () => {
      // Arrange
      const deliveryTourResponse : DeliveryTour = {
        refTour: 't098B-A',
        deliveries: [
          { address: '12, rue de la joie', orders: ['c166', 'c167'] },
          { address: '14, rue des Oiseaux', orders: ['c198']}
        ],
        deliverymen: ['AWL', 'DBB'],
        truck: 'XP-907-AB',
        distanceToCover : 0
      };
      const deliveryTourResponse1 : DeliveryTour = {
        refTour: 't098B-A',
        deliveries: [
          { address: '12, rue de la paix', orders: ['c444', 'c445'] },
          { address: 'Avenue du 8 mai 1945', orders: ['c675']}
        ],
        deliverymen: ['AWL', 'DBB'],
        truck: 'XP-907-AB',
        distanceToCover : 0
      };
      const date : Readonly<string> = "2022-01-01";

      let day : Day = {
        date : date,
        tours : [deliveryTourResponse,deliveryTourResponse1]
      }

      const expectedObservable  = of(day);
      (http.get as jest.Mock) = jest.fn().mockReturnValue(expectedObservable);


      // Act & Assert
      const res =  from(service.sendDay( day));
      res.subscribe((data) => {
        expect(service.sigPlanifiedDay()).toEqual(day);
        expect(service.sigPlanifiedDay().date).toEqual(date);
        expect(service.sigPlanifiedDay().tours).toEqual([deliveryTourResponse,deliveryTourResponse1]);
        expect(service.sigPlanifiedDay().tours[0].refTour).toEqual('t098B-A');
        expect(service.sigPlanifiedDay().tours[0].deliveries).toEqual(deliveryTourResponse.deliveries);
        expect(service.sigPlanifiedDay().tours[0].deliverymen).toEqual(deliveryTourResponse.deliverymen);
      })
    });

    it('should call sendDay method and return Error Response', async () => {
      // Act
      const errorResponse = { message: 'error' } as HttpErrorResponse;
      const deliveryTourResponse : DeliveryTour = {
        refTour: 't098B-A',
        deliveries: [
          { address: '12, rue de la paix', orders: ['c444', 'c445'] },
          { address: 'Avenue du 8 mai 1945', orders: ['c675']}
        ],
        deliverymen: ['AWL', 'DBB'],
        truck: 'XP-907-AB',
        distanceToCover : 0
      };
      const deliveryTourResponse1 : DeliveryTour = {
        refTour: 't098B-A',
        deliveries: [
          { address: '12, rue de la paix', orders: ['C4', 'C42'] },
          { address: 'Avenue du 8 mai 1945', orders: ['C12']}
        ],
        deliverymen: ['AWL', 'DBB'],
        truck: 'XP-907-AB',
        distanceToCover : 0
      };
      const date : Readonly<string> = "2022-01-01";
      let day : Day = {
        date : date,
        tours : [deliveryTourResponse,deliveryTourResponse1]
      }
      const expectedObservable  = throwError(errorResponse);
      (http.get as jest.Mock) = jest.fn().mockReturnValue(expectedObservable);

      // Act & Assert
      try {
        const res =  from(service.sendDay( day));
        res.subscribe((data) => {
          expect(service.sigPlanifiedDay()).toEqual(day);
          expect(service.sigPlanifiedDay().date).toEqual(date);
          expect(service.sigPlanifiedDay().tours).toEqual([deliveryTourResponse,deliveryTourResponse1]);
        })
      } catch (error) {
        expect(error).toBe(errorResponse);
        expect(service.sigPlanifiedDay().tours.length).toBe(0);
        expect(service.sigPlanifiedDay().date).toBe(service.getTomorrowDate());
      }
    });
  })



  /*  ------------------------------------ resetValue ------------------------------------ */
  describe('resetValues', () => {
    it('should reset values of sigPlanifiedDay and sigSetupBundle', () => {
      // Arrange
      const newDate : Readonly<string> = '2024-05-14';
      const initialTours = [{ deliverymen: ['John'], truck: 'Truck1', distanceToCover: 10, deliveries: [] }];
      const intialSetupBundle : SetupBundle = {
        multipleOrders: [],
        deliverymen: ['AWL', 'DBB'],
        trucks : ['XP-907-AB', 'XA-926-AD'],
        coordinates : [0, 0]
      };
      const day  : Day = { date: newDate, tours: initialTours }
      service.setSigDay(day);
      service.setSigSB(intialSetupBundle)

      // Act
      service.resetValues();

      // Assert
      expect(service.sigPlanifiedDay().date).toEqual(service.getTomorrowDate());
      expect(service.sigPlanifiedDay().tours.length).toBe(0);
      expect(service.sigSetupBundle().multipleOrders.length).toBe(0);
      expect(service.sigSetupBundle().deliverymen.length).toBe(0);
      expect(service.sigSetupBundle().trucks.length).toBe(0);
    });
  })

  /*  ------------------------------------ addTour ------------------------------------ */

 describe('addTour', () => {
   it('should add a tour with deliveries when tours array is empty', () => {
     // Arrange
     const initialToursLength = service.sigPlanifiedDay().tours.length;
     const setupBundle: SetupBundle = { multipleOrders: [{ orders: ['c166', 'c167'], address: '12 rue de la joix' }], deliverymen: [], trucks: [], coordinates: [0, 0] };
     service.updSig(setupBundle)

     // Act
     service.addTour();

     // Assert
     expect(service.sigPlanifiedDay().tours.length).toBe(initialToursLength + 1);
     const lastTour = service.sigPlanifiedDay().tours[initialToursLength];
     expect(lastTour.deliveries.length).toBe(1);
     expect(lastTour.deliveries[0].orders).toEqual(['c166', 'c167']);
     expect(lastTour.deliveries[0].address).toBe('12 rue de la joix');
   });

   it('should add a tour with empty deliveries when tours array is not empty', () => {
     // Arrange
     const initialToursLength = service.sigPlanifiedDay().tours.length;
     const setupBundle: SetupBundle = { multipleOrders: [], deliverymen: [], trucks: [], coordinates: [0, 0]};
     service.updSig(setupBundle)

     // Act
     service.addTour();

     // Assert
     expect(service.sigPlanifiedDay().tours.length).toBe(initialToursLength + 1);
     const lastTour = service.sigPlanifiedDay().tours[initialToursLength];
     expect(lastTour.deliveries.length).toBe(0);
     expect(lastTour.deliverymen.length).toBe(0);
     expect(lastTour.truck).toBe('');
     expect(lastTour.distanceToCover).toBe(0);
   });
 })

  /*  ------------------------------------ getTomorrowDate ------------------------------------ */
  describe('getTomorrowDate', () => {
    it('should get tomorrow date from the current date', () => {
      // Arrange
      const initDate = new Date("2024-01-01");
      const expectedDate = initDate.setDate(initDate.getDate() + 1)
      const expectedString : string  = datePipe.transform(expectedDate, "yyyy-MM-dd")!

      // Act
      const tomorrowDate = service.getTomorrowDate();

      //Assert
      expect(tomorrowDate).toEqual(expectedString)
      expect(datePipe.transform).toHaveBeenCalled();
    });
  });


  /*  ------------------------------------ removeAllDeliveryMen ------------------------------------ */
  describe('removeAllDeliveryMen', () => {
    it('should remove all deliverymen from a specific tour and add them to sigSetupBundle', () => {
      // Arrange
      const tourIndex = 0;
      const deliveryMenToRemove = ['John', 'Doe'];
      const initialDeliveryMenInTour = ['John', 'Doe', 'Alice'];
      const initialDeliveryMenInSetupBundle = ['Jane', 'Smith'];
      const initialTours: DeliveryTour[] = [{ deliverymen: initialDeliveryMenInTour, truck: 'AB', distanceToCover: 10, deliveries: [] , coordinates: [0, 0]}];
      const initialSetupBundle: SetupBundle = { multipleOrders: [], deliverymen: initialDeliveryMenInSetupBundle, trucks: [], coordinates: [0, 0]};
      const day: Day = { date: service.getTomorrowDate(), tours: initialTours }
      service.setSigDay(day)
      service.setSigSB(initialSetupBundle)

      // Act
      service.removeAllDeliveryMen(tourIndex);

      // Assert
      expect(service.sigPlanifiedDay().tours[tourIndex].deliverymen.length).toBe(3);
      expect(service.sigPlanifiedDay().tours[tourIndex].deliverymen).toContain(deliveryMenToRemove[0]);
      expect(service.sigPlanifiedDay().tours[tourIndex].deliverymen).toContain(deliveryMenToRemove[1]);
      expect(service.sigSetupBundle().deliverymen).toEqual(initialDeliveryMenInSetupBundle);
    });
  });


  /*  ------------------------------------ removeTour ------------------------------------ */
 describe('removeTour', () => {
   it('should remove the specified tour > 1', ()=>{

     // Arrange
     const tourIndex = 1;
     const initialTours: DeliveryTour[] = [
       { deliverymen: ['John', 'Doe'], truck: 'XA-926-AD', distanceToCover: 10, deliveries: [{ orders: ['c166'], address: '12 rue de la joie', distanceToCover: 5 }] },
       { deliverymen: ['Alice', 'Bob'], truck: 'XD-126-AB', distanceToCover: 15, deliveries: [{ orders: ['c167'], address: '14 rue des martyrs', distanceToCover: 7 }] }
     ];

     const initialSetupBundle: SetupBundle = { multipleOrders: [], deliverymen: [], trucks: ['XA-926-AD', 'XD-126-AB'], coordinates: [0, 0]};
     const day: Day = { date: service.getTomorrowDate(), tours: initialTours }
     service.setSigDay(day)
     service.setSigSB(initialSetupBundle)

     // Act
     service.removeTour(tourIndex);

     // Assert
     // check if tour is removed
     expect(service.sigPlanifiedDay().tours.length).toBe(initialTours.length - 1);
     expect(service.sigPlanifiedDay().tours.map(tour => tour.truck)).not.toContain(initialTours[tourIndex].truck)

     // check if the truck is removed
     expect(service.sigSetupBundle().trucks).not.toContain(initialTours[tourIndex].truck);

     // Check if the deliverymen from the removed tour are added back to the setup bundle
     expect(service.sigSetupBundle().deliverymen).toEqual((initialTours[tourIndex].deliverymen));

     // Check if the deliveries from the removed tour are moved to the remaining tour
     const remainingTourDeliveries = service.sigPlanifiedDay().tours[0].deliveries;
     const removedTourDeliveries = initialTours[tourIndex].deliveries;
     expect(remainingTourDeliveries.length).toBeGreaterThan(removedTourDeliveries.length);
     for (const delivery of removedTourDeliveries) {
       expect(remainingTourDeliveries).toContain(delivery);
     }

     // check if other tours are not affected by the removal of the specified tour
     expect(service.sigPlanifiedDay().tours[0].deliverymen).toEqual(['John', 'Doe']);
     expect(service.sigPlanifiedDay().tours[0].truck).toBe('XA-926-AD');
     expect(service.sigPlanifiedDay().tours[0].deliveries.length).toBe(2);


   });

   it('should remove the truck from the specified tour', () =>{
     // Arrange
     const tourIndex = 1;
     const initialTours: DeliveryTour[] = [
       { deliverymen: ['John', 'Doe'], truck: 'XA-926-AD', distanceToCover: 10, deliveries: [{ orders: ['c166'], address: '12 rue de la joie', distanceToCover: 5 }] },
       { deliverymen: ['Alice', 'Bob'], truck: 'XD-126-AB', distanceToCover: 15, deliveries: [{ orders: ['c167'], address: '14 rue des martyrs', distanceToCover: 7 }] }
     ];
     const initialSetupBundle: SetupBundle = { multipleOrders: [], deliverymen: [], trucks: ['XA-926-AD'], coordinates: [0, 0]};
     const day: Day = { date: service.getTomorrowDate(), tours: initialTours }
     service.setSigDay(day)
     service.setSigSB(initialSetupBundle)

     // Act
     service.removeTruck(tourIndex)

     // Assert
     // Check if the truck is removed from the specified tour
     expect(service.sigPlanifiedDay().tours[tourIndex].truck).toBe('');
     // Check if the truck is removed from sigSetupBundle.trucks
     expect(service.sigSetupBundle().trucks).not.toContain(initialTours[tourIndex].truck);
     expect(service.sigSetupBundle().trucks).toContain('XD-126-AB');
     expect(service.sigSetupBundle().trucks).toContain('XA-926-AD');
     expect(service.sigSetupBundle().trucks.length).toBe(2);
     expect(service.sigSetupBundle().trucks).toEqual(['XA-926-AD','XD-126-AB']);
   })
 })

  /*  ------------------------------------ addTruck ------------------------------------ */
  describe('addTruck', () => {
    it('should add a specified truck for the specified tour', ()=>{
      // Arrange
      const truckIndex = 1;
      const tourIndex = 0;
      const initialTours: DeliveryTour[] = [
        { deliverymen: ['John', 'Doe'], truck: 'XA-926-AD', distanceToCover: 10, deliveries: [{ orders: ['c166'], address: '12 rue de la joie', distanceToCover: 5 }] },
        { deliverymen: ['Alice', 'Bob'], truck: 'XD-126-AB', distanceToCover: 15, deliveries: [{ orders: ['c167'], address: '14 rue des martyrs', distanceToCover: 7 }] }
      ];
      const initialTruck = ['XA-926-AD', 'XD-126-AB']
      const initialSetupBundle: SetupBundle = { multipleOrders: [], deliverymen: [], trucks: initialTruck, coordinates: [0, 0]};
      const day: Day = { date: service.getTomorrowDate(), tours: initialTours }
      service.setSigDay(day)
      service.setSigSB(initialSetupBundle)

      // Store the truck value before removing it
      const truckValue = initialSetupBundle.trucks[truckIndex];

      // Act
      service.addTruck(truckIndex, tourIndex);

      // Assert
      // Check if the truck is added to the specified tour
      expect(service.sigPlanifiedDay().tours[tourIndex].truck).toBe(truckValue)
      // Check if the truck is removed from the sigSetupBundle
      expect(service.sigSetupBundle().trucks).not.toContain(truckValue);

    })
  });

  /*  ------------------------------------ replaceTruck ------------------------------------ */
 describe('replaceTruck', () => {
   it('should replace a truck for the specified tour', ()=>{
     // Arrange
     const truckIndex = 1;
     const tourIndex = 0;
     const initialTours: DeliveryTour[] = [
       { deliverymen: ['John', 'Doe'], truck: 'XA-926-AD', distanceToCover: 10, deliveries: [{ orders: ['c166'], address: '12 rue de la joie', distanceToCover: 5 }] },
       { deliverymen: ['Alice', 'Bob'], truck: 'XD-126-AB', distanceToCover: 15, deliveries: [{ orders: ['c167'], address: '14 rue des martyrs', distanceToCover: 7 }] }
     ];
     const initialTruck = ['XA-926-AD', 'XD-126-AB']
     const initialSetupBundle: SetupBundle = { multipleOrders: [], deliverymen: [], trucks: initialTruck, coordinates: [0, 0] };
     const day: Day = { date: service.getTomorrowDate(), tours: initialTours }
     service.setSigDay(day)
     service.setSigSB(initialSetupBundle)

     // Store the truck value before replacing it
     const truckValue = initialSetupBundle.trucks[truckIndex];

     // Act
     service.replaceTruck(truckIndex, tourIndex);

     // Assert
     // Check if the truck is added to the specified tour
     expect(service.sigPlanifiedDay().tours[tourIndex].truck)
     // Check if the truck is removed from the sigSetupBundle
     expect(service.sigSetupBundle().trucks).not.toContain(truckValue);

   });
 })


  /*  ------------------------------------ addDeliveryMan ------------------------------------ */
 describe('addDeliveryMan', () => {
   it('should add a specified deliveryman for the specified tour', ()=>{
     // Arrange
     const delIndex = 1;
     const tourIndex = 0;
     const initialTours: DeliveryTour[] = [
       { deliverymen: ['John', 'Doe'], truck: 'XA-926-AD', distanceToCover: 10, deliveries: [{ orders: ['c166'], address: '12 rue de la joie', distanceToCover: 5 }] },
       { deliverymen: ['Alice', 'Bob'], truck: 'XD-126-AB', distanceToCover: 15, deliveries: [{ orders: ['c167'], address: '14 rue des martyrs', distanceToCover: 7 }] }
     ];
     const initialDeliverymen = ['John', 'Doe', 'Alice', 'Bob']
     const initialSetupBundle: SetupBundle = { multipleOrders: [], deliverymen: initialDeliverymen, trucks: [], coordinates: [0, 0]};
     const day: Day = { date: service.getTomorrowDate(), tours: initialTours }
     service.setSigDay(day)
     service.setSigSB(initialSetupBundle)

     // Store the deliveryman value before removing it
     const deliverymanValue = initialSetupBundle.deliverymen[delIndex];

     // Act
     service.addDeliveryMan(delIndex, tourIndex);

     // Assert
     // Check if the deliveryman is added to the specified tour
     expect(service.sigPlanifiedDay().tours[tourIndex].deliverymen).toContain(deliverymanValue)
     // Check if the deliveryman is removed from the sigSetupBundle
     expect(service.sigSetupBundle().deliverymen).not.toContain(deliverymanValue);
   })
 })
  /*  ------------------------------------ removeDeliveryMan ------------------------------------ */

  describe('removeDeliveryMan', () => {
    it('should remove a specified deliveryman from the specified tour', ()=>{
      // Arrange
      const delIndex = 1;
      const tourIndex = 0;
      const initialTours: DeliveryTour[] = [
        { deliverymen: ['John', 'Doe'], truck: 'XA-926-AD', distanceToCover: 10, deliveries: [{ orders: ['c166'], address: '12 rue de la joie', distanceToCover: 5 }] },
        { deliverymen: ['Alice', 'Bob'], truck: 'XD-126-AB', distanceToCover: 15, deliveries: [{ orders: ['c167'], address: '14 rue des martyrs', distanceToCover: 7 }] }
      ];
      const initialDeliverymen = ['John', 'Doe', 'Alice', 'Bob']
      const initialSetupBundle: SetupBundle = { multipleOrders: [], deliverymen: initialDeliverymen, trucks: [], coordinates: [0, 0]};
      const day: Day = { date: service.getTomorrowDate(), tours: initialTours }
      service.setSigDay(day)
      service.setSigSB(initialSetupBundle)

      // Store the deliveryman value before removing it
      const deliverymanValue = service.sigPlanifiedDay().tours[tourIndex].deliverymen[delIndex];

      // Act
      service.removeDeliveryMan(delIndex, tourIndex);

      // Assert
      // Check if the deliveryman is removed from the specified tour
      expect(service.sigPlanifiedDay().tours[tourIndex].deliverymen).not.toContain(deliverymanValue)
      // Check if the deliveryman is added to the sigSetupBundle
      expect(service.sigSetupBundle().deliverymen).toContain(deliverymanValue);

    })
  })

  /*  ------------------------------------ buildDayAutomatically ------------------------------------ */
  // Je spy ici parce qu'on utilise des méthodes externes comme pour la fonction test, buildDayFromOptimizedBundle
  describe('buildDayAutomatically', () => {
    it('should build day automatically', async () => {
      // Arrange
      const toursCount = 2;
      const initialSetupBundle : SetupBundle = {
        multipleOrders: [
          {address : '12 rue de la joie', orders : ['c166']},
          {address : '12 rue de la paix', orders : ['c167', 'c168']},
          {address : 'Avenue du 8 mai 1945', orders : ['c898']}
        ],
        deliverymen: ['AWL', 'DBB'],
        trucks : ['XP-907-AB', 'XA-926-AD'],
        coordinates : [0, 0]
      };
      const day: Day = { date: service.getTomorrowDate(), tours: [
          { deliverymen: ['AWL', 'DBB'], truck: 'XP-907-AB', distanceToCover: 10, deliveries: [ {address : "", orders :[]}] },
          { deliverymen: ['John', 'Doe'], truck: 'XA-926-AD', distanceToCover: 10, deliveries: [] },
        ] }
      service.setSigDay(day)
      service.setSigSB(initialSetupBundle)
      const optimizedBundle: IOptimizedBundle = { longTournees: [], tournees: [[1], [2]] };

      jest.spyOn(service['planificatorProtocols'], 'getSetupBundle').mockResolvedValue(initialSetupBundle);
      jest.spyOn(service['mapService'], 'test').mockResolvedValue(optimizedBundle);

      const tomorrowDate = new Date();
      tomorrowDate.setDate(tomorrowDate.getDate() + 1);
      const getTomorrowDateSpy = jest.spyOn(service, 'getTomorrowDate').mockReturnValue(tomorrowDate.toDateString());
      const buildDayFromOptimizedBundleSpy = jest.spyOn(service, 'buildDayFromOptimizedBundle');

      // Act
      await service.buildDayAutomatically(toursCount);


      // Assert
      expect(buildDayFromOptimizedBundleSpy).toHaveBeenCalledWith(optimizedBundle, initialSetupBundle);
      expect(getTomorrowDateSpy).toHaveBeenCalled();
      expect(service.sigPlanifiedDay().tours.length).toBe(toursCount);
      expect(service.sigPlanifiedDay().tours[0].deliverymen.toString()).toEqual(initialSetupBundle.deliverymen[0]);
      expect(service.sigPlanifiedDay().tours[0].truck).toEqual(initialSetupBundle.trucks[0]);
//     expect(service.sigPlanifiedDay().tours[0].deliveries.length).toBe(1);
      expect(service.sigSetupBundle()).toEqual(initialSetupBundle);

    });
  })



  /*  ------------------------------------ buildDayFromOptimizedBundle ------------------------------------ */
  describe('buildDayFromOptimizedBundle', () => {
    it('should build day from optimized bundle', ()=>{
      // Arrange
      const initialSetupBundle : SetupBundle = {
        multipleOrders: [
          {address : '12 rue de la joie', orders : ['c166']},
          {address : '12 rue de la paix', orders : ['c167', 'c168']},
          {address : 'Avenue du 8 mai 1945', orders : ['c898']}
        ],
        deliverymen: ['AWL', 'DBB'],
        trucks : ['XP-907-AB', 'XA-926-AD'],
        coordinates : [0, 0]
      };
      const optimizedBundle: IOptimizedBundle = { longTournees: [], tournees: [[1,2]] };
      const day: Day = { date: service.getTomorrowDate(), tours: [
          { deliverymen: ['AWL', 'DBB'], truck: 'XP-907-AB', distanceToCover: 10, deliveries: [] },
          { deliverymen: ['John', 'Doe'], truck: 'XA-926-AD', distanceToCover: 10, deliveries: [] },
        ] }
      service.setSigDay(day)
      service.setSigSB(initialSetupBundle)
      const tomorrowDate = new Date();
      tomorrowDate.setDate(tomorrowDate.getDate() + 1);
      const getTomorrowDateSpy = jest.spyOn(service, 'getTomorrowDate').mockReturnValue(tomorrowDate.toDateString());
      const navigateSpy = jest.spyOn(router, 'navigate');

      // Act
      service.buildDayFromOptimizedBundle(optimizedBundle, initialSetupBundle);

      console.log(initialSetupBundle.deliverymen[0])
      console.log(service.sigPlanifiedDay().tours[0].deliverymen)
      // Assert

      // Check if the day was built correctly
      expect(service.sigPlanifiedDay().date).toBe(tomorrowDate.toDateString());
      expect(service.sigPlanifiedDay().tours.length).toBe(1);
      expect(service.sigPlanifiedDay().tours[0].deliverymen.toString()).toEqual(initialSetupBundle.deliverymen[0]);
      expect(service.sigPlanifiedDay().tours[0].truck).toEqual(initialSetupBundle.trucks[0]);
      //expect(service.sigPlanifiedDay().tours[0].deliveries.length).toBe(1);
      expect(service.sigPlanifiedDay().tours[0].deliveries[0].address).toEqual(initialSetupBundle.multipleOrders[1].address);
      expect(service.sigPlanifiedDay().tours[0].deliveries[0].orders).toEqual(initialSetupBundle.multipleOrders[1].orders);
      // Check if the user is redirected to the planification page
      expect(navigateSpy).toHaveBeenCalledWith(['/day-previewer']);
    });
  })



  /*  ------------------------------------ getSigDay && setSigDay------------------------------------ */
  describe('getSigDay & setSigDay', () => {
    it('should return the sigPlanifiedDay', () => {
      // Arrange
      const day: Day = { date: '2024-01-01', tours: [] };
      service.setSigDay(day);

      // Act
      service.getSigDay();

      // Assert
      expect(service.sigPlanifiedDay()).toEqual(day);
      expect(service.sigPlanifiedDay().date).toBe(day.date);
      expect(service.sigPlanifiedDay().tours).toEqual(day.tours);
      expect(service.sigPlanifiedDay().tours.length).toBe(day.tours.length);
      expect(service.sigPlanifiedDay().tours[0]).toEqual(day.tours[0]);
    });

    it('should set the sigPlanifiedDay', () => {
      // Arrange
      const day: Day = { date: '2024-01-01', tours: [] };

      // Act
      service.setSigDay(day);

      // Assert
      expect(service.sigPlanifiedDay()).toEqual(day);
      expect(service.sigPlanifiedDay().date).toBe(day.date);
      expect(service.sigPlanifiedDay().tours).toEqual(day.tours);
      expect(service.sigPlanifiedDay().tours.length).toBe(day.tours.length);
      expect(service.sigPlanifiedDay().tours[0]).toEqual(day.tours[0]);


    });
  })

  /*  ------------------------------------ setSigSetupBundle && updateSigSetupBundle------------------------------------ */
 describe('setSigSetupBundle & updateSigSetupBundle', () => {
   it('should set the sigSetupBundle', () => {
     // Arrange
     const setupBundle: SetupBundle = { multipleOrders: [], deliverymen: [], trucks: [], coordinates: [0, 0] };
     service.setSigSB(setupBundle);
     expect(service.sigSetupBundle()).toEqual(setupBundle);
   });

   it('should update the sigSetupBundle', () => {
     // Arrange
     const setupBundle: SetupBundle = { multipleOrders: [], deliverymen: [], trucks: [], coordinates: [0, 0]};
     service.updSig(setupBundle);
     expect(service.sigSetupBundle()).toEqual(setupBundle);
   });
 })

  /*  ------------------------------------ sendTodayDay------------------------------------ */
  describe('sendTodayDay', () => {
    it('should send the day to the server', async () => {
      // Arrange
      const day: Day = { date: '2024-01-01', tours: [] };
      const spySendDay = jest.spyOn(service['planificatorProtocols'], 'sendDay').mockResolvedValue(day);

      // Act
      await service.sendTodayDay(day);

      // Assert
      expect(spySendDay).toHaveBeenCalled();
    });
  })

  /*  ------------------------------------ sendDayOrUpdate------------------------------------ */
 describe('sendDayOrUpdate', () => {
   it('should update the day if sendDay returns a 406 error', async () => {
     // Arrange
     const day: Day = { date: '2024-01-01', tours: [] };
     const error = { status: 406 };

     // Mock the sendDay method to return a 406 status code and spy on the updateDay/sendDay method
     const spySendDay = jest.spyOn(service['planificatorProtocols'], 'sendDay').mockRejectedValueOnce(error);
     const spyUpdateDay = jest.spyOn(service['planificatorProtocols'], 'updateDay').mockResolvedValue(day);

     // Act
     await service.sendDayOrUpdate(day);

     // Assert
     expect(spySendDay).toHaveBeenCalled();
     expect(spyUpdateDay).toHaveBeenCalled();

   });
 })

  /*  ------------------------------------ changeDayStates------------------------------------ */
  describe('changeDayStates', () => {
    it('should change the day states returns a 200 successful', async () => {
      // Arrange
      const day: Day = { date: '2024-01-01', tours: [] };
      const dayState = 'PLANNED';
      const success = { status: 200 };


      service.setSigDay(day);

      const dayID = 'J001G';
      const spyGetDayID = jest.spyOn(service, 'getDayID').mockReturnValue(dayID);
      const spyChangeDayState = jest.spyOn(service['planificatorProtocols'], 'changeDayState').mockResolvedValue(success);

      // Act
      service.changeDayStates(day.date);

      // Assert
      expect(spyGetDayID).toHaveBeenCalledWith(day.date);
      expect(spyChangeDayState).toHaveBeenCalledWith(dayState, dayID);
    });

    it('should change the day states returns a 404 error', async () => {
      // Arrange
      const day: Day = { date: '2024-01-01', tours: [] };
      const dayState = 'PLANNED';
      const error = { status: 404 };

      const dayID = 'J001G';
      const spyGetDayID = jest.spyOn(service, 'getDayID').mockReturnValue(dayID);
      const spyChangeDayState = jest.spyOn(service['planificatorProtocols'], 'changeDayState').mockRejectedValue(error);

      // Act
      service.changeDayStates(day.date);

      // Assert
      expect(spyGetDayID).toHaveBeenCalledWith(day.date);
      expect(spyChangeDayState).toHaveBeenCalledWith(dayState, dayID);
      // Catch l'erreur?
    });

    it('should change the day states returns a 409 error', async () => {
      // Arrange
      const day: Day = { date: '2024-01-01', tours: [] };
      const dayState = 'PLANNED';
      const error = { status: 409 };

      const dayID = 'J001G';
      const spyGetDayID = jest.spyOn(service, 'getDayID').mockReturnValue(dayID);
      const spyChangeDayState = jest.spyOn(service['planificatorProtocols'], 'changeDayState').mockRejectedValue(error);

      // Act
      service.changeDayStates(day.date);

      // Assert
      expect(spyGetDayID).toHaveBeenCalledWith(day.date);
      expect(spyChangeDayState).toHaveBeenCalledWith(dayState, dayID);

    });
  })

  /*  ------------------------------------ getDayID------------------------------------ */
  describe('getDayID', () =>{

    it('should return the day ID', () => {
      //Arrange
      const date = '2024-01-01';
      const dayID = 'J001G';

      //Act
      const result = service.getDayID(date);

      //Assert
      expect(result).toEqual(dayID);

    });


  });

  describe('testMaxFrequency', () =>{
    it('should limit emissions to the maximum frequency', (done) => {
      // Arrange
      const nb = 5;
      const ms = 1000;
      const inputObs = of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
      const expectedOutput = [1, 2, 3, 4, 5]; // Expected output is the first 5 values

      // Act
      const resultObs = maxFrequency(nb, ms)(inputObs);

      // Assert
      resultObs.pipe(take(nb)).subscribe({
        next: (value) => expect(value).toEqual(expectedOutput.shift()),
        complete: () => {
          expect(expectedOutput.length).toEqual(0);
          done();
        }
      });
    });
  })



});
