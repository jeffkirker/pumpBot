import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CompanyDataService } from './company-data.service';
import { CompanyDetailService } from './company-detail.service';
import { CompanyData } from './companyData';
import { CompanyForm } from './companyForm';

@Injectable({
  providedIn: 'root',
})
export class CompanyFormService {
  constructor(
    private companyDetailService: CompanyDetailService,
    private companyDataService: CompanyDataService
  ) {}
  companyData: CompanyData;

  companyForm: CompanyForm = {
    company: 'tsla',
    exchange: 'NASDAQ',
    subreddit: 'wallstreetbets',
  };

  getForm(): Observable<CompanyForm> {
    return of(this.companyForm);
  }

  setForm(companyForm: CompanyForm) {
    this.companyForm = companyForm;
    console.log('Company Form updated: ', this.companyForm);
    // this.companyDetailService.updateDetails(this.companyForm);
  }
}
