import { Injectable } from '@angular/core';
import { Leader, LEADERS } from '../shared/leader';
import { Observable,of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor() { }

  getAllLeaders(): Observable<Leader[]> {
    return of(LEADERS).pipe(delay(2000));
   
  }
}
