import { Injectable } from '@angular/core';
import { Promotion } from '../shared/promotion';
import { PROMOTIONS } from '../shared/promotions';
import { Observable,of } from 'rxjs';

import { map, catchError,delay } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { ProcessHTTPMsgService } from './process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  Promo:Observable<Promotion[]>;
  Promo1:any;


  constructor(private http: HttpClient,
              private processHTTPMsgService: ProcessHTTPMsgService) { }

  getPromotions(): Observable<Promotion[]> {
    //return of(PROMOTIONS).pipe(delay(2000));
    return this.http.get<Promotion[]>(baseURL + 'promotions').pipe(catchError(this.processHTTPMsgService.handleError));
    
   
  }

  getPromotion(id: string): Observable<Promotion> {
    //return of(PROMOTIONS.filter((promo) => (promo.id === id))[0]).pipe(delay(2000));
    return this.http.get<Promotion>(baseURL + 'promotions/' + id).pipe(catchError(this.processHTTPMsgService.handleError));
 
  }

  getFeaturedPromotion(): Observable<Promotion> {
    return of(PROMOTIONS.filter((promot) => promot.featured)[0]).pipe(delay(2000));
    
  }
  
}
