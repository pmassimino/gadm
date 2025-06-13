import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Empresa } from '../../global/models/model';
import { AuthService } from '../../../core/services/auth.service';
import { SessionService } from '../../comun/services/session.service';
import { EmpresaService } from '../../global/services/empresa.service';

@Component({
  selector: 'app-mobile-dashboard',
  templateUrl: './mobile-dashboard.component.html',
  styleUrls: ['./mobile-dashboard.component.css']
})
export class MobileDashboardComponent implements OnInit {
  empresa:Empresa;
  username :string;
  menuItems = [
    { 
      title: 'Inicio', 
      icon: 'home', 
      route: '/mobile',
      color: '#4285F4' // Azul
    },
    { 
      title: 'Ventas', 
      icon: 'shopping_cart', 
      route: '/mobile/pedido',
      color: '#34A853' // Verde
    },
    { 
      title: 'Clientes', 
      icon: 'people', 
      route: '/mobile/clientes',
      color: '#EA4335' // Rojo
    },
    { 
      title: 'Pedidos', 
      icon: 'assessment', 
      route: '/mobile/pedidos',
      color: '#FBBC05' // Amarillo
    },
    { 
      title: 'Stock', 
      icon: 'inventory', 
      route: '/mobile/stock',
      color: '#673AB7' // Morado
    },
    { 
      title: 'Articulos', 
      icon: 'store', 
      route: '/mobile/articulos',
      color: '#673AB7' // Morado
    },
    { 
      title: 'Configuración', 
      icon: 'settings', 
      route: '/settings',
      color: '#607D8B' // Gris
    }
  ];

  featuredCards = [
    {
      title: 'Ventas Hoy',
      value: '$2,450',
      icon: 'attach_money',
      trend: 'up',
      change: '12%'
    },
    {
      title: 'Nuevos Clientes',
      value: '14',
      icon: 'person_add',
      trend: 'up',
      change: '8%'
    },
    {
      title: 'Productos',
      value: '128',
      icon: 'store',
      trend: 'steady'
    }
  ];
  constructor(private authService:AuthService,private sessionService:SessionService,private empresaService:EmpresaService) {
      
  }
  ngOnInit(){      
        this.empresaService.currentValue().subscribe(res=>this.empresa = res);
        this.username = this.authService.currentAccount().Nombre; 
    }
}