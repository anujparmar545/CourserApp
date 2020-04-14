import { Injectable } from '@angular/core';
import { Leader, LEADERS } from '../shared/leader';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor() { }

  getAllLeaders(): Leader[] {
    return LEADERS;
  }
}
