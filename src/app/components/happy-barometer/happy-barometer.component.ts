import {Component, Input, OnInit} from '@angular/core';


@Component({
  selector: 'app-happy-barometer',
  templateUrl: './happy-barometer.component.html',
  styleUrls: ['./happy-barometer.component.scss']
})
export class HappyBarometerComponent implements OnInit {

  @Input() label?: string;
  @Input() value?: number;
  @Input() orangeThreshold?: number;
  @Input() greenThreshold?: number;
  thresholdConfig = {};
  size: number;
  thickness: number;


  public get roundedValue(): number | undefined {
    if (!this.value) { return this.value; }
    // console.log(this.value);
    return Math.round(this.value * 100);
  }

  onResize(event) {
    this.size = Math.min(event.target.innerHeight / 5, 300);
    this.thickness = this.size * 0.1;
    // console.log(this.size);
  }

  // thresholdConfig = {
  //   0: {color: 'red'},
  //   orangeThreshold: {color: 'orange'},
  //   greenThreshold: {color: 'green'}
  // };

  constructor() {
    this.onResize({target: window});
    // console.log("Constructor: " + this.size)
  }

  ngOnInit(): void {
    this.thresholdConfig = {
      0: {color: 'red'},
      [this.orangeThreshold]: {color: 'orange'},
      [this.greenThreshold]: {color: 'green'}
    };
  }
}
