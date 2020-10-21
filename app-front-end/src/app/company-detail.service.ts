import { Injectable } from '@angular/core';
import { CompanyForm } from './companyForm';
import { Observable, of } from 'rxjs';

import { DETAILS } from './mock-details';
import { CompanyDetails } from './companyDetails';
import { CompanyFormService } from './company-form.service';
@Injectable({
  providedIn: 'root',
})
export class CompanyDetailService {
  constructor() {}
  companyDetails: CompanyDetails = DETAILS;

  getDetails() {
    return of(this.companyDetails);
  }

  updateDetails(companyForm: CompanyForm) {
    // TODO: make api call with companyForm fields to get company details
    this.companyDetails.companyName = companyForm.company;
    this.companyDetails.exchange = companyForm.exchange;
  }
}
