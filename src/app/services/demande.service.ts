import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DemandeService {

  private api = '/api/demandes';

  constructor(private http: HttpClient) {}

  create(data: any) {
    return this.http.post(this.api, data);
  }

  getMesDemandes() {
    return this.http.get<any[]>(this.api + '/mes-demandes');
  }

  getEnAttente() {
    return this.http.get<any[]>(this.api + '/en-attente');
  }

  getAll(statut?: string) {

    const url = statut
      ? `${this.api}/all?statut=${statut}`
      : `${this.api}/all`;

    return this.http.get<any[]>(url);
  }

  valider(id: number) {
    return this.http.put(
      this.api + '/' + id + '/valider',
      {}
    );
  }

  downloadCsv(id: number) {
    return this.http.get(
      `/api/demandes/${id}/csv`,
      {
        responseType: 'blob'
      }
    );
  }

  rejeter(id: number, motif: string) {
    return this.http.put(
      this.api + '/' + id + '/rejeter',
      {
        motif,
        motifRejet: motif
      }
    );
  }
}