import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FaceDetectionService } from 'src/app/services/face-detection.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {

  constructor(public faceDetection: FaceDetectionService,
              public dashboard: DashboardService,
              private router: Router) { }

  ngOnInit(): void {
    if (!this.faceDetection.detections?.length) {
      this.navigateToPresenterView();
    }
  }

  public get downloadJson(): number | undefined {
    if (!this.faceDetection.detections?.length) { return undefined; }

    const fileToSave = new Blob([JSON.stringify(this.faceDetection.detections)], {
      type: 'json',
    });

    const time = new Date();
    fileSaver.saveAs(fileToSave, `moody_${time.toLocaleDateString().split('/').join('-')}_${time.getHours()}-${time.getMinutes()}.json`);
  }

  public get moodyScore(): string | undefined {
    const average = this.calculateAverage(this.faceDetection.detections);
    return average == undefined ? undefined : average.toString();
  }

  public get avgGroupFlow(): string | undefined {
    return this.calculateAveragePercent(this.dashboard.groupFlow);
  }

  public get avgPeak(): string | undefined {
    return this.calculateAveragePercent(this.dashboard.peak);
  }

  public get avgHappy(): string | undefined {
    return this.calculateAveragePercent(this.dashboard.happy);
  }

  private calculateAverage(data: {[key: string]: any, value: number }[]): number | undefined {
    if (!data?.length) { return undefined; }
  
    const validValues = data
      ?.map(value => value.value)
      .filter(value => value !== undefined && value !== null && !isNaN(value) && isFinite(value));
  
    if (!validValues.length) { return undefined; }
  
    const average = validValues.reduce((acc, current) => acc + current, 0) / validValues.length;

    return parseFloat(average.toFixed(2));  // return 2 fixed-point digits
  }

  private calculateAveragePercent(data: {[key: string]: any, value: number }[]): string | undefined {
    const avg = this.calculateAverage(data) * 100;
    return avg.toString().split('.')[0] + '%';
  }

  private navigateToPresenterView(): void {
    this.router.navigateByUrl('/presenterview');
  }

}
