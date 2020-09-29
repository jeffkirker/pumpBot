import { Component, OnInit } from '@angular/core';
import { CompanySelectService } from '../company-select.service';
import { CompanyForm } from '../companyForm';

@Component({
  selector: 'app-details-panel',
  templateUrl: './details-panel.component.html',
  styleUrls: ['./details-panel.component.css']
})
export class DetailsPanelComponent implements OnInit {

  constructor(private companySelectService: CompanySelectService) { }
  companyForm: CompanyForm;
  ngOnInit(): void {
    this.getForm();
  }

  getForm(): void {
    this.companySelectService.getCompany().subscribe((companyForm) => this.companyForm = companyForm);
  }
}
