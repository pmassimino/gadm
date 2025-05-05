import { Component } from '@angular/core';
import { SharedModule } from "../../../../shared/shared.module";
import { RouteInfo } from '../../../../shared/sidebar/sidebar.component';

@Component({
    selector: 'app-ventas-setting-list',    
    templateUrl: './ventas-setting-list.component.html',
    styleUrl: './ventas-setting-list.component.css',    
})
export class VentasSettingListComponent {
  routes: RouteInfo[] = [ 
    { path: '/ventas/puntoemision/list',         title: 'Puntos de Emision',             icon:'nc-diamond',    class: '' },
    { path: '/comun/numeradordocumento/list',         title: 'Numeradores Documentos',             icon:'nc-diamond',    class: '' }, 
    { path: '/ventas/configfactura/list',         title: 'Configuracion Factura',             icon:'nc-diamond',    class: '' } 
  ];
  

}
