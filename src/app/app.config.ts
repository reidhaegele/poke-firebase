import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(HttpClientModule), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"gdsc-pokeguesser","appId":"1:727402778079:web:dc883025c5aec64c99c86a","storageBucket":"gdsc-pokeguesser.appspot.com","apiKey":"AIzaSyBhqvsoqUbGnXAUmU08mkAnBcDF3WmsfLs","authDomain":"gdsc-pokeguesser.firebaseapp.com","messagingSenderId":"727402778079"}))), importProvidersFrom(provideAuth(() => getAuth())), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
