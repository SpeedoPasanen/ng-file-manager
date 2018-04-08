import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'ngfm-progress-snack',
  templateUrl: './ngfm-progress-snack.component.html',
  styleUrls: ['./ngfm-progress-snack.component.css']
})
export class NgfmProgressSnackComponent implements OnInit {
  message: string = '';
  value$: BehaviorSubject<number> = new BehaviorSubject(0);
  get value() { return this.value$.getValue(); }
  set value(n: number) {
    this.value$.next(n);
  }
  constructor(private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
  }

}
