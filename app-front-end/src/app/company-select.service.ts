import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CompanyDataService } from './company-data.service';
import { CompanyDetailService } from './company-detail.service';
import { CompanyData } from './companyData';
import { CompanyForm } from './companyForm';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

const BACKEND_URL = environment.apiUrl + '/mentions/';

@Injectable({
  providedIn: 'root',
})
export class CompanySelectService {
  constructor(
    private companyDetailService: CompanyDetailService,
    private companyDataService: CompanyDataService,
    private http: HttpClient
  ) {}
  companyData: CompanyData;
  //TEMP
  timeframe = 'monthly';
  public companyForm = {
    company: 'Tesla, Inc.',
    subreddit: 'wallstreetbets',
    exchange: 'nasdaq',
  };

  getCompany(): Observable<CompanyForm> {
    return of(this.companyForm);
  }

  updateCompanyForm(companyForm: CompanyForm) {
    this.companyForm = companyForm;
    console.log('Company form updated: ', this.companyForm);
    this.getData().subscribe((companyData: CompanyData) => {
      this.companyData = companyData[0];
      console.log('select service data: ', this.companyData);
    });

    this.companyDetailService.updateDetails(companyForm);
    // this.companyDataService.updateData(companyForm);
  }

  getData(): Observable<CompanyData> {
    return this.http
      .get<CompanyData>(
        BACKEND_URL + `${this.timeframe}/${this.companyForm.company}`
      )
      .pipe(tap((_) => console.log('fetched company data')));
  }
}
