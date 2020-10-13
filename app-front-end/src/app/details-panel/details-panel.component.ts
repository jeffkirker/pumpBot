import { Component, OnInit } from '@angular/core';
import { CompanySelectService } from '../company-select.service';
import { CompanyForm } from '../companyForm';
import { CompanyDetails } from '../companyDetails';
import { CompanyDataService } from '../company-data.service';

@Component({
  selector: 'app-details-panel',
  templateUrl: './details-panel.component.html',
  styleUrls: ['./details-panel.component.css'],
})
export class DetailsPanelComponent implements OnInit {
  constructor(private companyDataService: CompanyDataService) {}
  companyForm: CompanyForm;
  companyDetails: CompanyDetails;
  ngOnInit(): void {
    this.getDetails();
  }

  getDetails(): void {
    this.companyDataService
      .getDetails()
      .subscribe((companyDetails) => (this.companyDetails = companyDetails));
  }
}
