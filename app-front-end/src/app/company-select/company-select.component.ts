import { Component, Input, OnInit } from '@angular/core';
import { CompanyDataService } from '../company-data.service';
import { CompanyFormService } from '../company-form.service';
import { CompanyData } from '../companyData';
import { CompanyForm } from '../companyForm';

import { COMPANIES } from '../mock-companies';

@Component({
  selector: 'app-company-select',
  templateUrl: './company-select.component.html',
  styleUrls: ['./company-select.component.css'],
})
export class CompanySelectComponent implements OnInit {
  constructor(private companyDataService: CompanyDataService) {}
  companyForm: CompanyForm = {
    subreddit: 'wallstreetbets',
    company: 'tsla',
    exchange: 'NASDAQ',
  };
  companyData: CompanyData;
  companies = COMPANIES;
  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.companyDataService
      .getData(this.companyForm)
      .subscribe((companyData: CompanyData) => {
        this.companyData = companyData;
        this.updateData();
      }),
      (err) => console.log(err),
      () => console.log('Company Data Received');
  }

  updateData() {
    this.companyDataService.updateData(this.companyData);
  }
}
