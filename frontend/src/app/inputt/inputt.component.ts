import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-inputt',
  templateUrl: './inputt.component.html',
  styleUrls: ['./inputt.component.styl']
})
export class InputtComponent implements OnInit {
  @Input() str;
  constructor() { }

  ngOnInit() {
  }

}
