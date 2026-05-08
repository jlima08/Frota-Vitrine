import { Component, inject, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
    public authService = inject(AuthService);
  open: boolean = false; // Propriedade para controlar a classe 'closed' do menu

  constructor() { }



}
