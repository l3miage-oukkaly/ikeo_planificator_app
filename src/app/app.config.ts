import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient} from "@angular/common/http";
import {DatePipe} from "@angular/common";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {provideAnimations} from "@angular/platform-browser/animations";
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(), DatePipe, provideAnimationsAsync(), provideAnimations(), provideFirebaseApp(() => initializeApp({"projectId":"projet-integrateur-miage-g08","appId":"1:60690128346:web:e2dea6334cc53b53def4e3","storageBucket":"projet-integrateur-miage-g08.appspot.com","apiKey":"AIzaSyBmdkFsMV3403xQd17RVHZcBPzeWt7YISA","authDomain":"projet-integrateur-miage-g08.firebaseapp.com","messagingSenderId":"60690128346","measurementId":"G-F62C1ECVW9"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
};
