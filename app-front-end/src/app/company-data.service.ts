import { Injectable } from '@angular/core';
import { CompanyForm } from './companyForm';
import { Observable, of } from 'rxjs';
import { CompanyData } from './companyData';
import { DATA } from './mock-data';

@Injectable({
  providedIn: 'root',
})
export class CompanyDataService {
  constructor() {}
  companyForm: CompanyForm;
  updateData(companyForm: CompanyForm) {
    this.companyForm = companyForm;
  }

  getData(): Observable<CompanyData> {
    return of(DATA);
  }
}
