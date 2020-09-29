import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CompanyForm } from './companyForm';
@Injectable({
  providedIn: 'root',
})
export class CompanySelectService {
  constructor() {}

  public companySelectForm = {
    company: 'Tesla, Inc.',
    subreddit: 'r/WallStreetBets',
    exchange: 'NASDAQ',
  };

  getCompany(): Observable<CompanyForm> {
    return of(this.companySelectForm);
  }

  setCompany(company: string, subreddit: string, exchange: string) {
    this.companySelectForm = {
      company: company,
      subreddit: subreddit,
      exchange: exchange,
    };
  }

  updateCompanyForm(companyForm: CompanyForm) {
    this.companySelectForm = companyForm;
  }
}
