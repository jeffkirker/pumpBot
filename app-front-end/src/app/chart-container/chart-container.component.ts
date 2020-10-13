import { Component, OnInit } from '@angular/core';
import { CompanyDataService } from '../company-data.service';
import { CompanySelectService } from '../company-select.service';
import { CompanyData } from '../companyData';
import { CompanyForm } from '../companyForm';
@Component({
  selector: 'app-chart-container',
  templateUrl: './chart-container.component.html',
  styleUrls: ['./chart-container.component.css'],
})
export class ChartContainerComponent implements OnInit {
  options: any;
  constructor(private companyDataService: CompanyDataService) {}
  companyData: CompanyData;
  companyForm: CompanyForm;
  isLoading = false;
  ngOnInit(): void {
    this.companyDataService.updateData();
    this.getData();
  }

  getData() {
    this.companyDataService.getData().subscribe((companyData) => {
      this.isLoading = true;
      this.companyData = companyData;
      console.log('Data received in chart container: ', this.companyData);
      this.renderChart(companyData);
    });

  }

  renderChart(companyData) {
    console.log("Render chart : ",companyData);
    this.options = {
      legend: {
        data: ['Stock Price', 'Company Mentions'],
        align: 'left',
      },
      tooltip: {},
      xAxis: {
        data: companyData.dates,
        silent: false,
        splitLine: {
          show: false,
        },
      },
      yAxis: {},
      series: [
        {
          name: 'Stock Price',
          type: 'line',
          data: companyData.price,
          animationDelay: (idx) => idx * 10,
        },
        {
          name: 'Company Mentions',
          type: 'bar',
          data: companyData.mentions,
          animationDelay: (idx) => idx * 10 + 100,
        },
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx) => idx * 5,
    };
    this.isLoading = false;
  }
}
