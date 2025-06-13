import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { EmpresaService } from '../global/services/empresa.service';

@Component({
  selector: 'app-login',
  standalone:false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public username: string;
  public password: string;
  public error: string;

  constructor(private auth: AuthService, private router: Router) 
  { 
    auth.logout();
  }

  public submit() {
    this.auth.login(this.username, this.password)
      .pipe(first())
      .subscribe(res=>
        this.login(),
        err => this.error = err.error.Nombre
      );

  }
  login():void
  {
    if (this.isMobileOrTablet()) {
      this.router.navigate(['/mobile']); // Redirige a /mobile en móvil/tablet
    } else {
      this.router.navigate(['']); // Redirige a la ruta por defecto en desktop
    }
  }
   private isMobileOrTablet(): boolean {
    // Detección por User Agent
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Detección por tamaño de pantalla (opcional)
    const isSmallScreen = window.innerWidth < 768;
    
    return isMobile || isSmallScreen;
  }
}