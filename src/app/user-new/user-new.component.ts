import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ApiResponse } from '../api-response';

import { UtilService } from '../util.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-new',
  templateUrl: './user-new.component.html',
  styleUrls: ['./user-new.component.css']
})
export class UserNewComponent implements OnInit {
  errorResponse: ApiResponse;
  form: FormGroup;
  formErrors = {
    'username':'',
    'name':'',
    'email':'',
    'password':'',
    'passwordConfirmation':'',
  };
  formErrorMessages = {
    'username': {
      'required': 'Username is required!',
      'pattern': 'Should be 4-12 characters!',
    },
    'name': {
      'required': 'Name is required!',
      'pattern': 'Should be 4-12 characters!',
    },
    'email': {
      'pattern': 'Should be a vaild email address!',
    },
    'password': {
      'required': 'Password is required!',
      'pattern': 'Should be minimum 8 characters of alphabet and number combination!',
    },
    'passwordConfirmation': {
      'required': 'Password Confirmation is required!',
      'match': 'Password Confirmation does not matched!',
    },
  };
  buildForm(): void {
    this.form = this.formBuilder.group({
      username:["", [Validators.required, Validators.pattern(/^.{4,12}$/)]],
      name:["", [Validators.required, Validators.pattern(/^.{4,12}$/)]],
      email:["", [Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      password:["", [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/)]],
      passwordConfirmation:["", [Validators.required]],
    }, {
      validator: this.customValidation,
    });

    this.form.valueChanges.subscribe(data => {
      this.utilService.updateFormErrors(this.form, this.formErrors, this.formErrorMessages);
    });
  };

  customValidation(group: FormGroup) {
    var password = group.get('password');
    var passwordConfirmation = group.get('passwordConfirmation');
    if(password.dirty && passwordConfirmation.dirty && password.value != passwordConfirmation.value){
        passwordConfirmation.setErrors({'match': true});
    }
  }

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private utilService: UtilService,
    private userService: UserService,
  ) {
    this.buildForm();
  }

  ngOnInit() {
  }

  submit() {
    this.utilService.makeFormDirtyAndUpdateErrors(this.form, this.formErrors, this.formErrorMessages);
    if(this.form.valid){
      this.userService.create(this.form.value)
      .then(data =>{
        this.router.navigate(['/']);
      })
      .catch(response =>{
        this.errorResponse = response;
        this.utilService.handleFormSubmitError(this.errorResponse, this.form, this.formErrors);
      });
    }
  }

}
