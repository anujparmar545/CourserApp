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

import { trigger, state, style, animate, transition } from '@angular/animations';
@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  providers: [DatePipe],
  animations: [
    trigger('visibility', [
        state('shown', style({
            transform: 'scale(1.0)',
            opacity: 1
        })),
        state('hidden', style({
            transform: 'scale(0.5)',
            opacity: 0
        })),
        transition('* => *', animate('0.5s ease-in-out'))
    ])
  ]
})


export class DishdetailComponent implements OnInit {

  @ViewChild('fform') commentFormDirective;

    dish: Dish;
    errMess: string;
    dishcopy: Dish;

    dishIds: string[];
    prev: string;
    next: string;
    myDate: Date;
    commentForm: FormGroup;
    comment: Comment;
    
    visibility = 'shown';

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
      @Inject('BaseURL') public baseURL,
      
      ) { 
        this.createForm();
        
      }
  
     
    
  
    ngOnInit() {
      //const id = this.route.snapshot.params['id'];
     
      //this.dishService.getDish(id).subscribe(dish => this.dish = dish);

      this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds,errmess => this.errMess = <any>errmess);
      
      this.route.params.pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
      .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); },
       errmess => this.errMess = <any>errmess );
          
       this.route.params.pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishService.getDish(params['id']); }))
       .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
         errmess => this.errMess = <any>errmess);
    
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
      this.comment.date= this.myDate.toDateString();
      console.log(this.comment);

      for(let dish of DISHES){
        if(dish.name===this.dish.name){
          dish.comments.push(this.commentForm.value);
          console.log(dish);
        }
      }

      this.dishcopy.comments.push(this.comment);
      this.dishService.putDish(this.dishcopy).subscribe(dish => {this.dish = dish; this.dishcopy = dish;},
      errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; });


      this.commentForm.reset({
        author: [''],
        rating: [5],
        comment: ''
      });
      
     

      this.commentFormDirective.resetForm();
      
    }
}
