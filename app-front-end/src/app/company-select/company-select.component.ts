import { Component, Input, OnInit } from '@angular/core';
import { CompanySelectService } from '../company-select.service';
import { CompanyForm } from '../companyForm';
@Component({
  selector: 'app-company-select',
  templateUrl: './company-select.component.html',
  styleUrls: ['./company-select.component.css'],
})
export class CompanySelectComponent implements OnInit {
  constructor(private companySelectService: CompanySelectService) {}
  companyForm: CompanyForm;

  ngOnInit(): void {
    this.getForm();
  }

  getForm(): void {
    this.companySelectService.getCompany().subscribe((companyForm) => this.companyForm = companyForm);
  }

  updateForm(): void {
    this.companySelectService.updateCompanyForm(this.companyForm);
  }
}
