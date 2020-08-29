import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'prepit-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(public auth: AuthService) { }

  ngOnInit(): void {
  }

}

@NgModule({
  declarations: [ NavbarComponent ],
  imports: [
    CommonModule
  ],
  exports: [ NavbarComponent ]
})
export class NavbarModule {}
