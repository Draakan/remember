import { Component, AfterViewChecked } from '@angular/core';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { SingleDataSet, Label } from 'ng2-charts';

@Component({
  selector: 'app-statistics',
  templateUrl: 'statistics.page.html',
  styleUrls: ['statistics.page.scss']
})
export class StatiscticsPage implements AfterViewChecked {

  public title: string = 'Statistics';

  public barChartLegend: boolean = true;
  public isLoading: boolean = true;

  public doughnutChartData: SingleDataSet = [
    10, 20, 30
  ];

  public doughnutChartLabels: Label[] = ['One week', 'Two weeks', 'Three weeks'];

  public doughnutChartType: ChartType = 'doughnut';

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType: ChartType = 'bar';

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];

  constructor() {}

  ngAfterViewChecked() {
    setTimeout(() => {
    this.isLoading = false;
    }, 450);
  }

}
