import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CardPageComponent } from '../components/card-page/card-page.component';
import { FloatLabel, FloatLabelModule } from 'primeng/floatlabel';
import { MotoristasService } from '../../service/motoristas.service';
import { Motorista } from '../../interfaces/motorista.interface';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { AuthService } from '../../service/auth.service';



@Component({
  selector: 'app-motorista',
  imports: [ButtonModule, TableModule, InputTextModule, FloatLabelModule, CardPageComponent, FormsModule, SelectModule],
  templateUrl: './motorista.component.html',
  styleUrl: './motorista.component.scss'
})
export class MotoristaComponent {

   private motoristaService = inject(MotoristasService); 
   private authService = inject(AuthService); 

   roles = [
  {
    label: 'Administrador',
    value: 'Administrador'
  },
  {
    label: 'Motorista',
    value: 'Motorista'
  }
];

    motoristas: Motorista[] = [];

  
  motorista: Motorista = {
  nome: '',
  sobrenome: '',
  celular: '',
  cargo: '',
  email: '',
  senha: '',
  role: 'Motorista'
};
  
  CadMotorista = false;
  loading: boolean = false;
  editando = false;

  ngOnInit(): void {

  this.motoristaService
    .listar()
    .subscribe(resposta => {

      this.motoristas = resposta;
    });
}

  load() {
        this.loading = true;

        setTimeout(() => {
            this.loading = false
        }, 2000);
  }
  showCadMotorista(){
    this.CadMotorista = !this.CadMotorista;
  }

  editarMotorista(motorista: Motorista) {

  this.editando = true;

  this.CadMotorista = true;

  this.motorista = {
    ...motorista
  };
}

  salvarMotorista() {

  if (
    !this.motorista.nome ||
    !this.motorista.sobrenome ||
    !this.motorista.celular ||
    !this.motorista.cargo ||
    !this.motorista.email ||
    !this.motorista.senha ||
    !this.motorista.role
  ) {
    alert('Preencha todos os campos');

    return;
  }

  this.loading = true;

  // EDITAR
  if (this.editando && this.motorista.id) {

    this.motoristaService
      .atualizar(this.motorista.id, this.motorista)
      .then(() => {

        alert('Motorista atualizado');

        this.resetFormulario();
      })
      .catch(error => {

        console.error(error);

        this.loading = false;
      });

    return;
  }

  // CADASTRAR
  this.authService
  .cadastrar(
    this.motorista.email,
    this.motorista.senha!
  )
  .then((credencial) => {

    const motoristaFirestore = {

      nome: this.motorista.nome,
      sobrenome: this.motorista.sobrenome,
      celular: this.motorista.celular,
      cargo: this.motorista.cargo,

      email: this.motorista.email,

      role: this.motorista.role,

      uid: credencial.user.uid
    };

    return this.motoristaService
      .cadastrar(
        credencial.user.uid,
        motoristaFirestore
      );
  })
  .then(() => {

    alert('Motorista cadastrado');

    this.resetFormulario();
  })
  .catch(error => {

    console.error(error);

    this.loading = false;
  });
}

resetFormulario() {

  this.motorista = {
    nome: '',
    sobrenome: '',
    celular: '',
    cargo: '',
    email: '',
    role: 'Motorista'
  };

  this.editando = false;

  this.CadMotorista = false;

  this.loading = false;
}

 buscarMotoristas() {
    this.loading = true;

    this.motoristaService
      .listar()
      .subscribe({
        next: (resposta) => {
          this.motoristas = resposta;

          this.loading = false;
        },

        error: (erro) => {
          console.error(erro);

          this.loading = false;
        }
      });
  }

  

}
