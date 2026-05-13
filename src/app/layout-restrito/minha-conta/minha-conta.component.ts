import { Component, inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { updatePassword } from 'firebase/auth';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { CardPageComponent } from "../components/card-page/card-page.component";
import { switchMap, of } from 'rxjs';
import { MotoristasService } from '../../service/motoristas.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-minha-conta',
  imports: [FormsModule, ButtonModule, InputTextModule, FloatLabelModule, CardPageComponent, CommonModule],
  templateUrl: './minha-conta.component.html',
  styleUrl: './minha-conta.component.scss'
})
export class MinhaContaComponent {
  private auth = inject(Auth);
  private motoristaService = inject(MotoristasService);

  novaSenha = '';

  confirmarSenha = '';
  usuario: any;

  ngOnInit(): void {

  authState(this.auth)
    .pipe(

      switchMap(usuarioLogado => {

        if (!usuarioLogado) {

          return of(null);
        }

        return this.motoristaService
          .buscarPorUid(usuarioLogado.uid);
      })
    )
    .subscribe(usuario => {

      this.usuario = usuario;

      console.log(usuario);
    });
}

  alterarSenha() {

    if (
      !this.novaSenha ||
      !this.confirmarSenha
    ) {

      alert('Preencha os campos');

      return;
    }

    if (
      this.novaSenha !== this.confirmarSenha
    ) {

      alert('As senhas não coincidem');

      return;
    }

    const usuario = this.auth.currentUser;

    if (!usuario) {

      alert('Usuário não autenticado');

      return;
    }

    updatePassword(
      usuario,
      this.novaSenha
    )
      .then(() => {

        alert('Senha alterada com sucesso');

        this.novaSenha = '';

        this.confirmarSenha = '';
      })
      .catch(error => {

        console.error(error);

        alert('Erro ao alterar senha');
      });
  }

}
