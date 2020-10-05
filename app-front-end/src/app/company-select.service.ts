import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CompanyForm } from './companyForm';
import { CompanyDetailService } from './company-detail.service';

@Injectable({
  providedIn: 'root',
})
export class CompanySelectService {
  constructor(private companyDetailService: CompanyDetailService) {}

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
    console.log(this.companySelectForm);
    this.companyDetailService.requestDetails(companyForm);
  }
}
