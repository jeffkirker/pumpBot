import { Component, OnInit } from '@angular/core';
import { CompanySelectService } from '../company-select.service';
import { CompanyForm } from '../companyForm';
import { CompanyDetails } from '../companyDetails';
import { CompanyDetailService } from '../company-detail.service';

@Component({
  selector: 'app-details-panel',
  templateUrl: './details-panel.component.html',
  styleUrls: ['./details-panel.component.css'],
})
export class DetailsPanelComponent implements OnInit {
  constructor(private companySelectService: CompanySelectService, private companyDetailService: CompanyDetailService) {}
  companyForm: CompanyForm;
  companyDetails: CompanyDetails;
  ngOnInit(): void {
    this.getDetails();
  }

  getDetails(): void {
    this.companyDetailService
      .getDetails()
      .subscribe((companyDetails) => (this.companyDetails = companyDetails));
  }
}
