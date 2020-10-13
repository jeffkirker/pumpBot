import { Injectable } from '@angular/core';
import { CompanyForm } from './companyForm';
import { Observable, of } from 'rxjs';
import { CompanyData } from './companyData';
import { DATA } from './mock-data';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { CompanySelectService } from './company-select.service';
import { CompanyDetails } from './companyDetails';
import { DETAILS } from './mock-details';
const BACKEND_URL = environment.apiUrl + '/mentions/';

@Injectable({
  providedIn: 'root',
})
export class CompanyDataService {
  constructor(private http: HttpClient) {}
  companyData: CompanyData;
  companyDetails: CompanyDetails = DETAILS;
  public companyForm: CompanyForm = {
    company: 'tsla',
    subreddit: 'wallstreetbets',
    exchange: 'NASDAQ',
  };

  updateCompanyForm(companyForm: CompanyForm) {
    this.companyForm = companyForm;
    console.log('Form updated: ', this.companyForm);
    this.updateDetails();
    this.updateData().subscribe(
      (data) => {
        this.companyData.dates = data[0].dates;
        this.companyData.mentions = data[0].mentions;
        this.companyData.price = data[0].price;
        console.log('Data updated: ', this.companyData);
      },
      (err) => console.error(err)
    );
  }

  updateDetails() {
    this.companyDetails.companyName = this.companyForm.company;
    this.companyDetails.exchange = this.companyForm.exchange;
  }

  updateData(): Observable<CompanyData> {
    const queryParams = `monthly/${this.companyForm.company}`;
    return this.http.get<CompanyData>(BACKEND_URL + queryParams);
  }

  getDetails(): Observable<CompanyDetails> {
    return of(this.companyDetails);
  }

  getData(): Observable<CompanyData> {
    return of(this.companyData);
  }

  getForm(): Observable<CompanyForm> {
    return of(this.companyForm);
  }
}
