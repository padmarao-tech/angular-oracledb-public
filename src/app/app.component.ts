import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav'
import { HeaderComponent } from './core/components/header/header.component';
import { FooterComponent } from './core/components/footer/footer.component';
import { Menu } from './shared/models';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { SidenavComponent } from './core/components/sidenav/sidenav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    // Materials
    MatSidenavModule,
    MatExpansionModule,
    // components
    HeaderComponent,
    FooterComponent,
    SidenavComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  @ViewChild('matDrawer') matDrawer : MatDrawer;
  title = 'payroll';
  menu: Menu[];

  triggerSide(){
    this.matDrawer.toggle();
  }

  getMenu(event){
    this.menu = event;
  }
}
