import { Injectable } from '@angular/core';
import { CompanySelectService } from './company-select.service';
import { CompanyForm } from './companyForm';
import { Observable, of } from 'rxjs';
import {CompanyData } from './companyData';
import { DATA } from './mock-data';
@Injectable({
  providedIn: 'root',
})
export class CompanyDataService {
  constructor(private companySelectService: CompanySelectService) {}

  getData(): Observable<CompanyData> {
    return of(DATA)
  }
}
