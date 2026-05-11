import { Component, inject, signal } from '@angular/core';
import { FloatLabelModule } from "primeng/floatlabel";
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from "primeng/button";
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { FormsModule } from '@angular/forms';
import { ToastModule } from "primeng/toast";
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  imports: [FloatLabelModule, InputTextModule, ButtonModule, FormsModule, ToastModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers:[MessageService]
})
export class LoginComponent {

  // username = signal<string>('');
  // password = signal<string>('');
  errorMessage = signal<string | null>(null);

  private authService = inject(AuthService);
  private router = inject(Router);

  constructor(private messageService: MessageService) { }

   email = '';
  senha = '';

  entrar() {
    this.authService.login(this.email, this.senha)
      .then(() => {
        // alert('Login realizado');
         this.messageService.add({ severity: 'contrast', summary: 'Login realizado!', detail: 'Você será redirecionado para a areá restrita do sistema' });

         setTimeout(() => {
           this.router.navigate(['restrito/veiculos']);
         }, 2000);
      })
      .catch(error => {
        console.error(error);

        alert('Erro no login');
      });
  }

}
