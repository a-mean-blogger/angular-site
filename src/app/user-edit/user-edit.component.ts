import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { User } from '../user';
import { ApiResponse } from '../api-response';

import { UtilService } from '../util.service';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  user: User;
  errorResponse: ApiResponse;
  form: FormGroup;
  formErrors = {
    'currentPassword':'',
    'username':'',
    'name':'',
    'email':'',
    'newPassword':'',
    'passwordConfirmation':'',
  };
  formErrorMessages = {
    'username': {
      'required': 'Username is required!',
      'pattern': 'Should be 4-12 characters!',
    },
    'currentPassword': {
      'required': 'Username is required!',
    },
    'name': {
      'required': 'Name is required!',
      'pattern': 'Should be 4-12 characters!',
    },
    'email': {
      'pattern': 'Should be a vaild email address!',
    },
    'newPassword': {
      'pattern': 'Should be minimum 8 characters of alphabet and number combination!',
    },
    'passwordConfirmation': {
      'match': 'Password Confirmation does not matched!',
    },
  };
  buildForm(): void {
    this.form = this.formBuilder.group({
      currentPassword:["", [Validators.required]],
      username:[this.user.username, [Validators.required, Validators.pattern(/^.{4,12}$/)]],
      name:[this.user.name, [Validators.required, Validators.pattern(/^.{4,12}$/)]],
      email:[this.user.email, [Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      newPassword:["", [Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/)]],
      passwordConfirmation:[""],
    }, {
      validator: this.customValidation,
    });

    this.form.valueChanges.subscribe(data => {
      this.utilService.updateFormErrors(this.form, this.formErrors, this.formErrorMessages);
    });
  };

  customValidation(group: FormGroup) {
    var password = group.get('newPassword');
    var passwordConfirmation = group.get('passwordConfirmation');
    if(password.dirty && passwordConfirmation.dirty && password.value != passwordConfirmation.value){
        passwordConfirmation.setErrors({'match': true});
    }
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private utilService: UtilService,
    private userService: UserService,
    public authService: AuthService,
  ) {
    this.user = this.route.snapshot.data['user'];
    this.buildForm();
  }

  ngOnInit() {
  }

  submit() {
    this.utilService.makeFormDirtyAndUpdateErrors(this.form, this.formErrors, this.formErrorMessages);
    if(this.form.valid){
      this.userService.update(this.user.username, this.form.value)
      .then(data =>{
        this.router.navigate(['/', 'users', this.user.username]);
      })
      .catch(response =>{
        this.errorResponse = response;
        this.utilService.handleFormSubmitError(this.errorResponse, this.form, this.formErrors);
      });
    }
  }

  delete() {
    var answer = confirm("Do you want to delete your account?");
    if(answer){
      this.userService.destroy(this.user.username)
      .then(data =>{
        this.authService.logout();
      })
      .catch(response =>{
        this.errorResponse = response;
        this.utilService.handleFormSubmitError(this.errorResponse, this.form, this.formErrors);
      });
    }
  }

}
