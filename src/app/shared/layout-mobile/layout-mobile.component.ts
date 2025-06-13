import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../services';
import { Subscription } from 'rxjs';
import { Empresa } from '../../modules/global/models/model';

@Component({
  selector: 'app-layout-mobile',
  standalone:false,
  templateUrl: './layout-mobile.component.html',
  styleUrls: ['./layout-mobile.component.css']
})
export class LayoutMobileComponent implements OnInit {
  toggled = false;
  subscription: Subscription = new Subscription();

  appName = 'Mi App';
  menuVisible = false;

  menuItems = [
    { name: 'Inicio', icon: 'home', route: '/mobile/' },
    { name: 'Perfil', icon: 'person', route: '/profile' },
    { name: 'Ajustes', icon: 'settings', route: '/settings' },
    { name: 'Noticias', icon: 'newspaper', route: '/news' },
    // Agrega más items según necesites
  ];

  footerItems = [
    { icon: 'home', route: '/mobile/' },
    { icon: 'search', route: '/search' },
    { icon: 'notifications', route: '/notifications' },
    { icon: 'logout', route: '/login' }
  ];

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }
  constructor(public navigationService: NavigationService) { }

  ngOnInit(): void {
    this.subscription.add(
      this.navigationService.sideNavVisible$().subscribe(isVisible => {
        this.toggled = !isVisible;
      })
    );

  }


  onToggle() {
    this.navigationService.toggleSideNav();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


}
