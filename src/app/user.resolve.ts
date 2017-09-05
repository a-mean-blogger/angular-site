import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from './user.service';
import { User } from './user';

@Injectable()
export class UserResolve implements Resolve<User> {

  constructor(
    private userService: UserService,
  ) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.userService.show(route.params['username']);
  }
}
