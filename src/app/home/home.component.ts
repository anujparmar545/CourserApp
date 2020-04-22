import { Component, OnInit,Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { LeaderService } from '../services/leader.service';
import {  LEADERS, Leader } from '../shared/leader';

import { flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {'[@flyInOut]': 'true','style': 'display: block;'},
  animations: [flyInOut(), expand()]
})
export class HomeComponent implements OnInit {

  dish: Dish;
  promotion: Promotion;
  leaders: Leader[];
  leader: any;
  featuredLeaders: any;
  dishErrMess: string;
  leaderErrMess: string;
  promoErrMess: string;

  constructor(private dishservice: DishService,
              private promotionservice: PromotionService,
              private leaderService:LeaderService,
              @Inject('BaseURL') public baseURL,
              ) { }

  ngOnInit() {
   
    this.dishservice.getFeaturedDish().subscribe(dish => this.dish = dish,dishErrMess => this.dishErrMess = <any>dishErrMess);
    
    this.promotionservice.getFeaturedPromotion().subscribe(promotion => this.promotion = promotion, errmess => this.promoErrMess = <any>errmess);

    this.leaderService.getAllLeaders().subscribe(leaders => this.leaders = leaders, errmess => this.leaderErrMess = <any>errmess);
 
    
    console.log('this.leader',this.leaders);
  
    for(this.leader of LEADERS){
     
      if(this.leader.featured)
        this.featuredLeaders=this.leader;
    }
  }


}
