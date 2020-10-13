import { Component, Input, OnInit } from '@angular/core';
import { CompanyDataService } from '../company-data.service';
import { CompanySelectService } from '../company-select.service';
import { CompanyForm } from '../companyForm';

import {COMPANIES} from '../mock-companies';

@Component({
  selector: 'app-company-select',
  templateUrl: './company-select.component.html',
  styleUrls: ['./company-select.component.css'],
})
export class CompanySelectComponent implements OnInit {
  constructor(private companyDataService: CompanyDataService) {}
  companyForm: CompanyForm;
  companies = COMPANIES;
  ngOnInit(): void {
    this.fillForm();
  }

  fillForm(): void {
    this.companyDataService
      .getForm()
      .subscribe((companyForm) => (this.companyForm = companyForm));
  }

  updateForm(): void {
    this.companyDataService.updateCompanyForm(this.companyForm);
  }
}
