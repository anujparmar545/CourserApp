import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Dish } from '../shared/dish';
import { DISHES } from '../shared/dishes';

import { DishService } from '../services/dish.service';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';
import { DatePipe } from '@angular/common';
 
@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  providers: [DatePipe]
})


export class DishdetailComponent implements OnInit {

  @ViewChild('fform') commentFormDirective;

    dish: Dish;

    dishIds: string[];
    prev: string;
    next: string;
    myDate: Date;
    commentForm: FormGroup;
    comment: Comment;
    

    formErrors = {
      'author': '',
      'comment': '',
      
    };
  
    validationMessages = {
      'author': {
        'required':      'Author is required.',
        'minlength':     'Author must be at least 2 characters long.',
        'maxlength':     'Author cannot be more than 25 characters long.'
      },
      'comment': {
        'required':      'comment is required.',
        'minlength':     'comment must be at least 2 characters long.',
        'maxlength':     'comment cannot be more than 25 characters long.'
      },
    };

    constructor(private dishService: DishService,
      private route: ActivatedRoute,
      private location: Location,
      private fb: FormBuilder,
      private datePipe: DatePipe,
      @Inject('baseURL') private baseURL,
      
      ) { 
        this.createForm();
        
      }
  
     
    
  
    ngOnInit() {
      //const id = this.route.snapshot.params['id'];
     
      //this.dishService.getDish(id).subscribe(dish => this.dish = dish);

      this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
      this.route.params.pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
      .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });

    
    }
  
    setPrevNext(dishId: string) {
      const index = this.dishIds.indexOf(dishId);
      this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
      this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
    }

    goBack(): void {
      this.location.back();
    }

    createForm() {

      this.commentForm = this.fb.group({
        author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
        rating: [5, [Validators.required,] ],
        comment: ''
      });
  

      this.commentForm.valueChanges.subscribe(data => this.onValueChanged(data));
     this.onValueChanged(); // (re)set validation messages now
    }

    onValueChanged(data?: any) {
      if (!this.commentForm) { return; }
      const form = this.commentForm;
      for (const field in this.formErrors) {
        if (this.formErrors.hasOwnProperty(field)) {
          // clear previous error message (if any)
          this.formErrors[field] = '';
          const control = form.get(field);
          if (control && control.dirty && !control.valid) {
            const messages = this.validationMessages[field];
            for (const key in control.errors) {
              if (control.errors.hasOwnProperty(key)) {
                this.formErrors[field] += messages[key] + ' ';
              }
            }
          }
        }
      }
    }

    onSubmit() {
      this.comment = this.commentForm.value;
      console.log(this.commentForm.value);
      this.myDate=new Date();
      console.log(this.myDate);
      this.comment.date= this.datePipe.transform(this.myDate, 'MMM d, y');
      console.log(this.comment);

      for(let dish of DISHES){
        if(dish.name===this.dish.name){
          dish.comments.push(this.commentForm.value);
          console.log(dish);
        }
      }

      this.commentForm.reset({
        author: [''],
        rating: [5],
        comment: ''
      });
      
     

      this.commentFormDirective.resetForm();
      
    }
}
