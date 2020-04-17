import { Component, OnInit } from '@angular/core';
import { LeaderService } from 'src/app/services/leader.service';
import { Leader,LEADERS } from '../shared/leader';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  leaders:Leader[];

  constructor(private leaderService: LeaderService ) {}

  ngOnInit(): void {
    this.leaders = LEADERS;
  }

}
