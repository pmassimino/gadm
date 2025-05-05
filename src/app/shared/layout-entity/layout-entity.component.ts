import { Component, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { NavigationService } from '../services';
import { Subscription } from 'rxjs';
import { Empresa } from '../../modules/global/models/model';

@Component({
  selector: 'app-layout-entity',
  templateUrl: './layout-entity.component.html',
  styleUrls: ['./layout-entity.component.css']
})
export class LayoutEntityComponent implements OnInit {
  @ViewChild('contenedor', { read: ViewContainerRef }) contenedor!: ViewContainerRef;

  tabs: Array<{ titulo: string; componenteRef: any }> = []; //= [{ titulo: 'Productos' ,null}];
  tabActivaIndex: number = 0;

  toggled = false;
  subscription: Subscription = new Subscription();


  constructor(public navigationService: NavigationService) {
    this.tabs.push({ titulo: 'Productos', componenteRef: null });
  }
  agregarTab<T>(titulo: string, componente: any, data?: Partial<T>) {   

    this.tabs.push({ titulo:titulo , componenteRef:componente });
    this.contenedor.createComponent(componente);
    this.seleccionarTab(this.tabs.length - 1);
  }

  seleccionarTab(index: number) {
    this.tabActivaIndex = index;   
    const tab = this.tabs[index];
    if (tab.componenteRef) {
      //this.contenedor.insert(tab.componenteRef.hostView);
      //this.contenedor.clear();              
      this.contenedor.insert(tab.componenteRef.hostView);
      this.contenedor
    }   
  }

  cerrarTab(index: number) {
    const tab = this.tabs[index];
    //tab.componenteRef.destroy();
    this.tabs.splice(index, 1);
    if (this.tabActivaIndex === index) {
      this.tabActivaIndex = 0; // Vuelve al tab principal si cierras el actual
    }
    this.contenedor.clear()
    this.seleccionarTab(this.tabActivaIndex);
  }
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
