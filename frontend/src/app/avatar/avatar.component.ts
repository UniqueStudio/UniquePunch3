import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.styl']
})
export class AvatarComponent implements OnInit {
  @Input() userid: string;
  src: string;
  constructor() {
    this.src = `http://localhost:5000/avatar/${this.userid}.jpeg`;
    console.log(this.userid);
  }

  ngOnInit() {
  }

}
