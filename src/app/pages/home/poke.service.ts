import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PokeService {
  url = 'https://pokeapi.co/api/v2/pokemon/';

  constructor(private http: HttpClient) {}

  getPoke(): Observable<any> {
    return this.http.get(this.url + Math.floor(Math.random() * 152), { headers: { Accept: 'application/json' } });
  }
}