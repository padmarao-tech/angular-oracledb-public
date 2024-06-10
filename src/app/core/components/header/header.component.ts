import { Component, HostListener, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button';
import { EventEmitter } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { combineLatest, filter, map } from 'rxjs';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { RoleService } from '../../services/role.service';
import { DataService } from '../../services/data.service';
import { Menu, User } from '../../../shared/models';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu'

@Component({
  selector: 'header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    // Materials
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Output()
  side = new EventEmitter<boolean>();

  showMenu: boolean;
  @Output()
  menu = new EventEmitter<Menu[]>;
  header_options$ = combineLatest([
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)),
    this.rs.menus$,
    this.ds.curr_user$,
  ]).pipe(
    map(([e, menu, user]: [NavigationEnd, Menu[], User]) => {
      const options = {
        title: 'Payroll',
        subtitle: 'Payment Payroll',
        loginUrl: null,
        show_user_menu: true,
        user: user,
        menu: menu
      };

      if (
        e.url === "/" ||
        e.url.startsWith('/index') ||
        e.url.startsWith('/login')
      ) {
        options.show_user_menu = false;
      } else {
        options.show_user_menu = true;
        // this.side.emit(true);
      }

      options.subtitle = '';

      if(user){
      }
      return options;
    })
  );

  constructor(
    private router: Router,
    private rs: RoleService,
    private ds: DataService
  ){}

  showMyProfile(){

  }

  showChangePassword(){}
}
