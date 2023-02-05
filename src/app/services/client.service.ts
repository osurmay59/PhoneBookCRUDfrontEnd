import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from '../interface/client';


@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private baseUrl: string = 'https://localhost:7020/';
  private apiUrl: string = 'api/v1/clients';

  constructor(private http: HttpClient) { }

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.baseUrl}${this.apiUrl}`);
  }

  getClient(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.baseUrl}${this.apiUrl}/${id}`);
  }

  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${this.apiUrl}/${id}`);
  }

  saveClient(client: Client): Observable<Client> {
    return this.http.post<Client>(`${this.baseUrl}${this.apiUrl}`, client);
  }

  updateClient(id: number, client: Client): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}${this.apiUrl}/${id}`, client);
  }
}
