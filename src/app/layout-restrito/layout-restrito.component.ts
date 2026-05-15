import { Component, inject } from '@angular/core';
import { TopbarComponent } from "../layouts/topbar/topbar.component";
import { SidebarComponent } from "../layouts/sidebar/sidebar.component";
import { FooterComponent } from "../layouts/footer/footer.component";
import { AppComponent } from "../app.component";
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from "primeng/button";
import { AuthService } from '../service/auth.service';
import { Auth, authState, onAuthStateChanged } from '@angular/fire/auth';
import { MotoristasService } from '../service/motoristas.service';
import { of, switchMap } from 'rxjs';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { Tooltip, TooltipModule } from "primeng/tooltip";


@Component({
  selector: 'app-layout-restrito',
  imports: [ RouterOutlet, CommonModule, ButtonModule, RouterLink, RouterLinkActive, AvatarModule, AvatarGroupModule, TooltipModule],
  templateUrl: './layout-restrito.component.html',
  styleUrl: './layout-restrito.component.scss'
})
export class LayoutRestritoComponent {
  private authService = inject(AuthService);

private router = inject(Router);
private auth = inject(Auth);

private motoristaService = inject(MotoristasService);

usuario: any;
  sidebarOpen = false;
   open: boolean = false;
   

  ngOnInit(): void {

  onAuthStateChanged(this.auth, (usuarioLogado) => {

    if (usuarioLogado) {

      this.motoristaService
        .buscarPorUid(usuarioLogado.uid)
        .subscribe(resposta => {
          

          this.usuario = resposta;

          console.log(this.usuario);
        });
    }
  });
}

getIniciais(nome: string | undefined , sobrenome: string | undefined): string {

   const inicialNome = nome ? nome[0] : '';

  const inicialSobrenome = sobrenome
    ? sobrenome[0]
    : '';

  return (
    inicialNome + inicialSobrenome
  ).toUpperCase();
}

  toggleSidebar() {
    this.open = !this.open;
  }

  

  // onToggle() {
  //   this.toggleSidebar.emit();
  // }

  logout() {

  this.authService
    .logout()
    .then(() => {

      this.router.navigate(['/login']);
    })
    .catch(error => {

      console.error(error);
    });
}

}
