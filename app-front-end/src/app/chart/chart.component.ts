import { Component, OnInit } from '@angular/core';
import { CompanyDataService } from '../company-data.service';
import { CompanyFormService } from '../company-form.service';
import { CompanyData } from '../companyData';
import { CompanyForm } from '../companyForm';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
})
export class ChartComponent implements OnInit {
  options: any;
  updateOptions: any;
  constructor(
    private companyFormService: CompanyFormService,
    private companyDataService: CompanyDataService
  ) {}
  companyData: CompanyData;
  companyForm: CompanyForm;
  isLoading: false;

  ngOnInit(): void {
    this.companyDataService.companyData.subscribe((companyData) => {
      this.companyData = companyData;
      this.updateOptions = {
        series: [
          {
            data: this.companyData.mentions,
          },
          { data: this.companyData.price },
        ],
      };
    });
    this.options = {
      legend: {
        data: ['mentions', 'prices'],
        align: 'left',
      },
      tooltip: {},
      xAxis: {
        data: this.companyData.dates,
        silent: false,
        splitLine: {
          show: false,
        },
      },
      yAxis: {},
      series: [
        {
          name: 'mentions',
          type: 'line',
          data: this.companyData.mentions,
          animationDelay: (idx) => idx * 10,
        },
        {
          name: 'prices',
          type: 'bar',
          data: this.companyData.price,
          animationDelay: (idx) => idx * 10 + 100,
        },
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx) => idx * 5,
    };
  }
}
