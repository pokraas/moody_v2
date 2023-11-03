import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScreenRecorderService } from 'src/app/services/screen-recorder.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { debounceTime, filter, take, takeUntil} from 'rxjs/operators';
import { Subject } from 'rxjs';
import 'chartjs-adapter-moment';

@Component({
  selector: 'app-presenterview',
  templateUrl: './presenterview.component.html',
  styleUrls: ['./presenterview.component.scss']
})
export class PresenterviewComponent implements OnInit, OnDestroy {

  constructor(private screenRecorder: ScreenRecorderService,
              private dashboard: DashboardService,
              private router: Router) { }

  private ngUnsubscribe: Subject<boolean> = new Subject();

  showWarnings = true;

  public groupFlowIndicator?: number;

  public groupFlowIndicator$ = this.dashboard.groupFlowIndicatorLatest$.subscribe((x) => (this.groupFlowIndicator = x))

  public peakIndicator?: number;

  public peakIndicator$ = this.dashboard.peakIndicatorLatest$.subscribe((x) => (this.peakIndicator = x))

  public happiness?: number;

  private happiness_update_time: number = 2000; // update happiness every 2 seconds or more

  private happiness$ = this.dashboard.mean_happy.pipe(
    debounceTime(this.happiness_update_time)
  ).subscribe(
    (value) => {
      this.happiness = value;
      // console.log("Value of the Happiness: " + value)
      this.setWarningtext();

      this.dashboard.happy.push({
        timestamp: Date.now(),
        value: this.happiness,
      });
    }
  );

  

//   static MOVING_AVERAGE_NUMBER = 10;

//   public averageHappiness$ = this.screenRecorder.faceDetections$.pipe(
//     map((detections) => detections.map((detection) => {
//       return (<any>detection).expressions.happy;
//     })),
//     map(arr => arr.reduce((acc, current) => acc + current, 0) / arr.length),
//     scan((acc, curr) => {
//       if (!curr) {
//         return acc;
//       }

//       acc.push(curr);

//       if (acc.length > PresenterviewComponent.MOVING_AVERAGE_NUMBER) {
//         acc.shift();
//       }

//       return acc;
//     }, []),

// // Calculate moving average
//     map(arr => arr.reduce((acc, current) => acc + current, 0) / arr.length),
//     tap((value) => {
//       this.happyness = value;
//       this.setWarningtext();
//     })
//   );

  // private standardDeviation: number = 0.4;
  // private groupflow: number =0.09;

  public warningText = 'Hello';

  public warningColor = 'white';

  ngOnDestroy(): void{
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {

    if (this.screenRecorder.record$.value.type === 'stop') {
      this.navigateToHome();
      return;
    }
    this.screenRecorder.record$
      .pipe(
        filter(record => record.type === 'stop'),
        takeUntil(this.ngUnsubscribe),
        take(1),
      ).subscribe(this.onFinishRecording.bind(this));
  }

  private navigateToHome(): void {
    this.router.navigateByUrl('');
  }
  

  private onFinishRecording(): void {
    this.router.navigateByUrl('analytics');
  }

  public setWarningtext() {
    if (this.peakIndicator <= 0.25 ) {
      this.warningText = 'Team engagement seems to be low.';
      this.warningColor = 'red';
    } else {
      if (this.groupFlowIndicator <= 0.50) {
        this.warningText = 'It looks like your team is not on the same page.';
        this.warningColor = 'red';
      } else {
        if (this.happiness <= 0.01) {
          this.warningText = 'Team morale seems to be low.';
          this.warningColor = 'red';
        } else {
          if (this.peakIndicator <= 0.33 ) {
            this.warningText = 'Team engagement seems to be flat.';
            this.warningColor = 'orange';
          } else {
            if (this.groupFlowIndicator <= 0.67) {
              this.warningText = 'Someone in the team seems to be lost.';
              this.warningColor = 'orange';
            } else {
              if (this.happiness <= 0.04) {
                this.warningText = 'The mood in the team seems to decrease.';
                this.warningColor = 'orange';
              } else {
                this.warningText = 'You are doing a great job. Keep going!';
                this.warningColor = 'white';
              }
            }
          }
        }
      }
    }
  }
}
