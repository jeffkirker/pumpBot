import { Component, OnInit } from '@angular/core';
import { CompanyDataService } from '../company-data.service';
import { CompanyData } from '../companyData';
@Component({
  selector: 'app-chart-container',
  templateUrl: './chart-container.component.html',
  styleUrls: ['./chart-container.component.css'],
})
export class ChartContainerComponent implements OnInit {
  options: any;
  constructor(private companyDataService: CompanyDataService) {}
  data: CompanyData;
  ngOnInit(): void {
    this.showData();
  }

  renderChart(data: CompanyData) {
    console.log(data)
    this.options = {
      legend: {
        data: ['Stock Price', 'Company Mentions'],
        align: 'left',
      },
      tooltip: {},
      xAxis: {
        data: data.dates,
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
          data: data.price,
          animationDelay: (idx) => idx * 10,
        },
        {
          name: 'Company Mentions',
          type: 'bar',
          data: data.mentions,
          animationDelay: (idx) => idx * 10 + 100,
        },
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx) => idx * 5,
    };
  }
  showData() {
    this.companyDataService.getData().subscribe((companyData: CompanyData) => {
      this.renderChart(companyData[0]);
    });
  }
}
