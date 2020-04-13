import { Component, OnInit, Input } from '@angular/core';
import { Dish } from '../shared/dish';
import { DISHES } from '../shared/dishes';
import { DishdetailComponent } from '../dishdetail/dishdetail.component';
import { DishService } from '../services/dish.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

 


export class MenuComponent implements OnInit {

  
  
  dishes: Dish[] = DISHES;
  selectedDish: Dish;

  constructor(private dishService: DishService) { }
  

  onSelect(dish: Dish) {
    this.selectedDish = dish;
  }


  ngOnInit(): void {
    this.dishes = this.dishService.getDishes();
  }


}
