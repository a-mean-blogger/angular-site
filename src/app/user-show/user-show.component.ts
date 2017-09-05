import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from '../user';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-user-show',
  templateUrl: './user-show.component.html',
  styleUrls: ['./user-show.component.css']
})
export class UserShowComponent implements OnInit {
  user: User;

  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
  ) {
    this.user = this.route.snapshot.data['user'];
  }

  ngOnInit() {
  }

}
