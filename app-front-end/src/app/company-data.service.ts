import { Injectable } from '@angular/core';
import { CompanyForm } from './companyForm';
import { Observable, of } from 'rxjs';
import { CompanyData } from './companyData';
import { DATA } from './mock-data';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
const BACKEND_URL = environment.apiUrl + '/mentions/';

@Injectable({
  providedIn: 'root',
})
export class CompanyDataService {
  constructor(private http: HttpClient) {}
  companyForm: CompanyForm;
  companyData: CompanyData;

  //TEMP
  timeframe = 'monthly';

  updateData(companyForm: CompanyForm) {
    this.companyForm = companyForm;
    // console.log(this.getData());
    this.getData();
  }

  getData() {
    console.log(this.companyForm);
    console.log('making api call?');
    console.log(
      'Url:',
      BACKEND_URL + `${this.timeframe}/${this.companyForm.company}`
    );
    return this.http.get(
      // BACKEND_URL + `${this.timeframe}/${this.companyForm.company}`
      'http://localhost:4000/api/mentions/monthly/tsla'
    );
  }
}
