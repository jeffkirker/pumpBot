import { Component, OnInit } from '@angular/core';
import { CompanyDetails } from '../companyDetails';
import { CompanyDataService } from '../company-data.service';
import { CompanyFormService } from '../company-form.service';
import { DETAILS } from '../mock-details';
import { CompanyDetailService } from '../company-detail.service';

@Component({
  selector: 'app-details-panel',
  templateUrl: './details-panel.component.html',
  styleUrls: ['./details-panel.component.css'],
})
export class DetailsPanelComponent implements OnInit {
  constructor(private companyDetailService: CompanyDetailService) {}
  companyDetails: CompanyDetails = DETAILS;
  ngOnInit(): void {
    this.getDetails();
  }

  getDetails() {
    this.companyDetailService.getDetails().subscribe(
      (companyDetails) => {
        this.companyDetails = companyDetails;
      },
      (err) => console.log(err),
      () => console.log('Details updated: ', this.companyDetails)
    );
  }
}
