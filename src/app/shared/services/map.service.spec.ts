import {MapService} from "./map.service";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {TestBed} from "@angular/core/testing";
import {maxFrequency} from "./planificator.service";
import {from, Observable, of, throwError} from "rxjs";
import {LatLngTuple} from "leaflet";
import {Delivery} from "../../core/models/delivery.models";
import * as L from 'leaflet';
import {IOptimizedBundle} from "../../core/models/optimized-bundle.models";
import {environment} from "../../../environments/environment";
import {SetupBundle} from "../../core/models/setup-bundle.models";

describe('MapService', () => {
  let service: MapService;
  let http: HttpClient;
  let mapMock: any;

  beforeEach(() => {
    mapMock = {
      marker: jest.fn(),
      addLayer: jest.fn()
    };
    TestBed.configureTestingModule({
      providers: [
        MapService,
        { provide: HttpClient, useValue: { get: jest.fn(), post : jest.fn() } },
      ],
    });
    service = TestBed.inject(MapService);
    http = TestBed.inject(HttpClient);
  });

  /*  ------------------------------------ test ------------------------------------ */
  it('should test the test function', async () => {
    // Arrange
    const initialSetupBundle: SetupBundle = {
        multipleOrders: [
            { address: "60 Rue de la Chimie, 38400 Saint-Martin-d'Hères, France", orders: ['order1', 'order2'] },
            { address: "Rue Victor Hugo, 69002 Lyon, France", orders: ['order12', 'order23'] }
        ],
        deliverymen: ['deliveryman1', 'deliveryman2'],
        trucks: ['truck1', 'truck2'],
      coordinates: [0,0]
    }
    const toursCount = 5;
    const expectedCoords: [number,number] = [
      45.19407653808594,
      5.768377304077148
    ];
    const expectedMatrix: any = [[45.193912,5.767934], [45.7546655,4.830187]];
    const expectedOptimizedBundle: IOptimizedBundle = { longTournees: [], tournees: [[]] };

    jest.spyOn(service, 'addressToCoords').mockImplementation((delivery) => Promise.resolve(expectedCoords));
    jest.spyOn(service, 'requestMatrix').mockReturnValue(of(expectedMatrix));
    jest.spyOn(service, 'optimizeRoutes').mockResolvedValue(expectedOptimizedBundle);

    // Act
    const result = await service.test(initialSetupBundle, toursCount);

    // Assert
    expect(result).toEqual(expectedOptimizedBundle);
    expect(service.requestMatrix).toHaveBeenCalledWith(service.sigCoords());
    expect(service.optimizeRoutes).toHaveBeenCalledWith(expectedMatrix.distances, toursCount);
  });

  /*  ------------------------------------ testAddressToCoords ------------------------------------ */
  it('should call testAddressToCoords method and return results', async () => {
    // Arrange
    const delivery : Delivery = {
      address : "60 Rue de la Chimie, 38400 Saint-Martin-d'Hères, France",
      orders : ['order1', 'order2']
    };
    const latLngTupleResponse : [number, number] = [45.19407653808594,5.768377304077148];
    const expectedObservable = of({
      features: [
        {
          geometry: {
            coordinates: latLngTupleResponse
          }
        }
      ]
    });
    (http.get as jest.Mock).mockReturnValue(expectedObservable);

    // Act
    const result = service.testAddressToCoords(delivery);

    // Assert
    expect(http.get).toHaveBeenCalledWith("https://api-adresse.data.gouv.fr/search/?q="+encodeURIComponent(delivery.address!)+"&limit=1");
    result.subscribe((res) => expect(res).toEqual(latLngTupleResponse));
  });

  /*  ------------------------------------ testTest ------------------------------------ */
  it('should test the testTest function', async () => {
    // Arrange
    const toursCount = 5;
    const expectedMatrix = { distances: [[45.193912,5.767934], [45.7546655,4.830187]] };
    const expectedOptimizedBundle: IOptimizedBundle = { longTournees: [], tournees: [[]] };

    jest.spyOn(service, 'requestMatrix').mockReturnValue(of(expectedMatrix));
    jest.spyOn(service, 'optimizeRoutes').mockResolvedValue(expectedOptimizedBundle);

    // Act
    const result = await service.testTest(toursCount);

    // Assert
    expect(result).toEqual(expectedOptimizedBundle);
    expect(service.requestMatrix).toHaveBeenCalledWith(service.sigCoords());
    expect(service.optimizeRoutes).toHaveBeenCalledWith(expectedMatrix.distances, toursCount);
  });


  /*  ------------------------------------ testAllAdressesToCoords ------------------------------------ */
  it('should call testAllAdressesToCoords method and return results', async () => {
    // Arrange
    const deliveries : Delivery[] = [
      {address : "60 Rue de la Chimie, 38400 Saint-Martin-d'Hères, France", orders : ['order1', 'order2'], coordinates : [
          45.193912,5.767934
        ]},
      {address : "Rue Victor Hugo, 69002 Lyon, France", orders : ['order12', 'order23'], coordinates :[45.7546655,4.830187]}
    ];
    const toursCount = 5;
    const expectedCoords: [number,number] = [45.19407653808594,5.768377304077148];
    const expectedMatrix: any = [[45.193912,5.767934], [45.7546655,4.830187]];
    const expectedOptimizedBundle: IOptimizedBundle = { longTournees: [], tournees: [[]] };

    const obs = (maxFrequency(2, 1000)(from(deliveries))) as Observable<Delivery[]>;
    jest.spyOn(service, 'testAddressToCoords').mockReturnValue(of(expectedCoords));
    jest.spyOn(service, 'requestMatrix').mockReturnValue(of(expectedMatrix));
    jest.spyOn(service, 'optimizeRoutes').mockResolvedValue(expectedOptimizedBundle);
    jest.spyOn(service, 'testTest').mockResolvedValue(expectedOptimizedBundle);

    // Act
    service.testAllAdressesToCoords(deliveries, toursCount);

    // Assert
    setTimeout(() => {
        expect(service.testAddressToCoords).toHaveBeenCalled();
        expect(service.requestMatrix).toHaveBeenCalled();
        expect(service.optimizeRoutes).toHaveBeenCalled();
        expect(service.testTest).toHaveBeenCalled();
        expect(obs).toBeTruthy();
        expect(obs).toBeInstanceOf(Observable);
    }, 1000);
  });

  /*  ------------------------------------ optimizeRoutes ------------------------------------ */
  it('should call optimizeRoutes method and return result', async () => {
    // Arrange
    const toursCount = 3;
    const dist = [[1, 2], [3, 4]];
    const expectedOptimizedBundle: IOptimizedBundle = { longTournees: [], tournees: [[]] };
    (http.post as jest.Mock).mockReturnValue(of(expectedOptimizedBundle));

    // Act
    const result = await service.optimizeRoutes(dist, toursCount);

    // Assert
    expect(http.post).toHaveBeenCalledWith(
      environment.roUrl,
      { distancesMatrix: dist, toursCount: toursCount, warehouseIndexInDistancesMatrix: 0 }
    );
    expect(result).toEqual(expectedOptimizedBundle);
  });

  it('should call optimizeRoutes method and handle error response', async () => {
    // Arrange
    const toursCount = 3;
    const dist = [[1, 2], [3, 4]];

    const errorResponse = { message: 'An error occurred' }; // Mocked error response
    (http.post as jest.Mock).mockReturnValue(throwError(errorResponse));

    // Act
    try {
      await service.optimizeRoutes(dist, toursCount);
      new Error('Expected error to be thrown');
    } catch (error) {
      // Assert
      expect(error).toEqual(errorResponse);
    }
  });


  /*  ------------------------------------ addressToCoords ------------------------------------ */
  it('should call addressToCoords method and return results', async() => {
    // Arrange
    const delivery : Delivery = {
      address : "60 Rue de la Chimie, 38400 Saint-Martin-d'Hères, France",
      orders : ['order1', 'order2']
    };
    const latLngTupleResponse : LatLngTuple = [45.19407653808594,5.768377304077148];
    const expectedObservable = of({
      features: [
        {
          geometry: {
            coordinates: latLngTupleResponse
          }
        }
      ]
    });
    (http.get as jest.Mock).mockReturnValue(expectedObservable);
    const latLngTupleResponseInverse : [number, number]  = [5.768377304077148, 45.19407653808594];

    // Act
    const result = await service.addressToCoords(delivery);

    // Assert
    expect(http.get).toHaveBeenCalledWith("https://api-adresse.data.gouv.fr/search/?q="+encodeURIComponent(delivery.address!)+"&limit=1");
    expect(result).toEqual(latLngTupleResponse);
    expect(delivery.coordinates).toEqual(latLngTupleResponseInverse);
  });

  it('should call addressToCoords method and return Error Response', async () => {
    // Arrange
    const delivery : Delivery = {
      address : "60 Rue de la Chimie, 38400 Saint-Martin-d'Hères, France",
      orders : ['order1', 'order2']
    };
    const coords = [45.19407653808594,5.768377304077148];
    const errorResponse = { message: 'error' } as HttpErrorResponse;

    const expectedObservable  = throwError(errorResponse);
    (http.post as jest.Mock) = jest.fn().mockReturnValue(expectedObservable);

    // Act
    try {
      const obs = from(service.addressToCoords(delivery));
      obs.subscribe({
        next: (res) => {
          expect(res).toEqual(coords);
        }
      });
    } catch (error) {
      expect(error).toEqual(errorResponse);
    }
  });

  it('should handle error response', async () => {
    // Arrange
    const delivery : Delivery = {
      address : "60 Rue de la Chimie, 38400 Saint-Martin-d'Hères, France",
      orders : ['order1', 'order2']
    };
    jest.spyOn(http, 'get').mockImplementation(() => throwError('Erreur de requête'));

    // Act
    try {
      await service.addressToCoords(delivery);
    } catch (error) {
      // Assert
      expect(error).toEqual('Erreur de requête');
      expect(http.get).toHaveBeenCalledWith("https://api-adresse.data.gouv.fr/search/?q="+encodeURIComponent(delivery.address!)+"&limit=1");
      expect(delivery.coordinates).toBeUndefined();
    }
  });


  /*  ------------------------------------ requestRoutes ------------------------------------ */

  it('should call requestRoutes method and return results', async () => {
    // Arrange
    const coords: LatLngTuple[] = [
      [48.8566, 2.3522], // Paris
      [51.5074, -0.1278], // Londres
    ];
    const routeResponse  = of({
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          [48.8566, 2.3522],
          [51.5074, -0.1278],
        ],
      },
    })

    const expectedObservable = routeResponse;
    (http.post as jest.Mock) = jest.fn().mockReturnValue(expectedObservable);

    // Act
    const result = service.requestRoutes(coords);

    // Assert

    result.subscribe((res) => expect(res).toEqual(routeResponse));

    // Assert
    // Check if the http post was called with the right arguments
    expect(http.post).toHaveBeenCalledWith(
      "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
      { 'coordinates': coords },
      {
        headers: {
          'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
          'Authorization': '5b3ce3597851110001cf6248941cf3dd3298435b825d39a1afde6112',
          'Content-Type': 'application/json; charset=utf-8'
        }
      }
    );
  });




  it('should call requestRoutes method and return Error Response', async () => {
    // Arrange
    const coords: LatLngTuple[] = [
      [48.8566, 2.3522], // Paris
      [51.5074, -0.1278], // Londres
    ];
    const errorResponse = { message: 'error' } as HttpErrorResponse;

    const expectedObservable = throwError(errorResponse);
    (http.post as jest.Mock) = jest.fn().mockReturnValue(expectedObservable);

    // Act
    try {
      service.requestRoutes(coords);
    } catch (error) {
      // Assert
      expect(error).toEqual(errorResponse);
    }
  });
  /*  ------------------------------------ requestMatrix ------------------------------------ */

  it('should call requestMatrix method and return results', async () => {
    // Act
    const coords: LatLngTuple[] = [
      [48.8566, 2.3522], // Paris
      [51.5074, -0.1278], // Londres
    ];
    const matrixResponse = of([[48.8566, 2.3522], [51.5074, -0.1278]])
    const expectedObservable = matrixResponse;
    (http.post as jest.Mock) = jest.fn().mockReturnValue(expectedObservable);

    // Act
    const result =  service.requestMatrix(coords);

    // Assert
    result.subscribe((res) => expect(res).toEqual(matrixResponse))
    expect(http.post).toHaveBeenCalledWith(
      "https://api.openrouteservice.org/v2/matrix/driving-car",
      {
        'locations': coords,
        'metrics': ['distance'],
        'units': 'km'
      },
      {
        headers: {
          'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
          'Authorization': '5b3ce3597851110001cf6248941cf3dd3298435b825d39a1afde6112',
          'Content-Type': 'application/json; charset=utf-8'
        }
      }
    );
    expect(result).toEqual(matrixResponse);

  });

    it('should call requestMatrix method and return Error Response', async () => {
        // Arrange
        const coords: LatLngTuple[] = [
            [48.8566, 2.3522], // Paris
            [51.5074, -0.1278], // Londres
        ];
        const errorResponse = { message: 'error' } as HttpErrorResponse;

        const expectedObservable = throwError(errorResponse);
        (http.post as jest.Mock) = jest.fn().mockReturnValue(expectedObservable);

        // Act
        try {
            service.requestMatrix(coords);
        } catch (error) {
            // Assert
            expect(error).toEqual(errorResponse);
        }
    });
  /*  ------------------------------------ initRoutesLayer ------------------------------------ */
  it('should call initRoutesLayer method', () => {
    // Arrange
    const mapMock : any = {
      addLayer: jest.fn()
    };
    const coords: LatLngTuple[] = [
      [48.8566, 2.3522], // Paris
      [51.5074, -0.1278], // Londres
    ];
    const routeResponse  = {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          [48.8566, 2.3522],
          [51.5074, -0.1278],
        ],
      },
    }
    const expectedObservable = of(routeResponse);
    (http.post as jest.Mock) = jest.fn().mockReturnValue(expectedObservable);

    // Act
    service.initRoutesLayer(mapMock);

    // Assert
      setTimeout(() => {
          expect(http.post).toHaveBeenCalled();
          expect(mapMock.addLayer).toHaveBeenCalled();
      }, 1000);
  });

  /*  ------------------------------------ initMarker ------------------------------------ */
  it('should call initMarker method', () => {
    // Arrange
    const delivery: Delivery = { address: "12 rue de la paix", orders: ["order1"], coordinates: [45.19407653808594, 5.768377304077148] };

    const addToMock = jest.fn();
    const bindPopupMock = jest.fn();

    const spyOnAddTo = jest.spyOn(L.Marker.prototype, 'addTo').mockImplementation(addToMock);
    const spyOnBindPopup = jest.spyOn(L.Marker.prototype, 'bindPopup').mockImplementation(bindPopupMock);

    // Act
    service.initMarker(mapMock, delivery);

    // Assert
    expect(spyOnAddTo).toHaveBeenCalledWith(mapMock);
    expect(spyOnBindPopup).toHaveBeenCalledWith(service.makePopup(delivery));
  });

  /*  ------------------------------------ initAllMarkers ------------------------------------ */
  it('should call initAllMarkers method', () => {
    // Arrange
    const deliveries : Delivery[] = [
      {address : "60 Rue de la Chimie, 38400 Saint-Martin-d'Hères, France", orders : ['order1', 'order2'], coordinates : [
          45.19407653808594,5.768377304077148
        ]},
      {address : "Rue Victor Hugo, 69002 Lyon, France", orders : ['order12', 'order23'], coordinates :[45.7546655,4.830187]}
    ]
    const warehouseCoords : LatLngTuple = [45.19407653808594,5.768377304077148];
    const spyInitMarker = jest.spyOn(service, 'initMarker').mockReturnValue();

    // Act
    service.initAllMarkers(mapMock, deliveries, warehouseCoords)

    // Assert
    expect(spyInitMarker).toHaveBeenCalledTimes(deliveries.length);
  })
  /*  ------------------------------------ makePopup ------------------------------------ */
  it('should call makePopup method', () => {
    // App
    const delivery : Delivery  =
      {address : "12 rue de la paix", orders : ["order1"]}

    // Act
    const popUpHTML = service.makePopup(delivery);

    // Assert
    expect(popUpHTML).toEqual("<div><u>Adresse:</u> " + delivery.address + "</div>");
  })

  /*  ------------------------------------ setDeliveries ------------------------------------ */
  it('should call setDeliveries method', () => {
    // Arrange
    const deliveries : Delivery[] = [
      {address : "60 Rue de la Chimie, 38400 Saint-Martin-d'Hères, France", orders : ['order1', 'order2'], coordinates : [
          45.19407653808594,5.768377304077148
        ]},
      {address : "Rue Victor Hugo, 69002 Lyon, France", orders : ['order12', 'order23'], coordinates :[45.7546655,4.830187]}
    ]
    // Act
    service.setDeliveries(deliveries)

    // Assert
    expect(service.sigDeliveries()).toEqual(deliveries)
  });

});
