import { Component, inject, signal } from '@angular/core';
import { CardPageComponent } from "../components/card-page/card-page.component";
import { VeiculosService } from '../../service/veiculos.service';
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { FloatLabelModule } from "primeng/floatlabel";
import { InputTextModule } from 'primeng/inputtext';
import { Veiculo } from '../../interfaces/veiculo.interface';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { ToastModule } from "primeng/toast";
import { CommonModule } from '@angular/common';
import { MessageModule } from 'primeng/message';
// import { v4 as uuid } from 'uuid';



@Component({
  selector: 'app-gerenciar-veiculos',
  imports: [CardPageComponent, TableModule, ButtonModule, FloatLabelModule, InputTextModule, FormsModule, SelectModule, ToastModule, CommonModule, MessageModule],
  templateUrl: './gerenciar-veiculos.component.html',
  styleUrl: './gerenciar-veiculos.component.scss',
  providers: [MessageService]
})
export class GerenciarVeiculosComponent {
 private veiculoService = inject(
  VeiculosService
);

veiculos: Veiculo[] = [];

loading = false;

cadastrarVeiculo = false;

editando = false;

veiculo: Veiculo = {
  modelo: '',
  ano: '',
  placa: '',
  cor: '',
  status: ''
};

statusVeiculo = [
  'Ativo',
  'Inativo'
]

ngOnInit(): void {

  this.veiculoService
    .listar()
    .subscribe(resposta => {

      this.veiculos = resposta;
    });
}

showCadastrarVeiculo() {

  this.cadastrarVeiculo =
    !this.cadastrarVeiculo;
}

constructor(private messageService: MessageService) {}

salvarVeiculo() {

  if (
    !this.veiculo.modelo ||
    !this.veiculo.ano ||
    !this.veiculo.placa ||
    !this.veiculo.cor
  ) {

    this.messageService.add({ severity: 'error', summary: 'Preencha todos os campos', detail: '', life: 3000 });

    return;
  }

  this.loading = true;

  // EDITAR

  if (
    this.editando &&
    this.veiculo.id
  ) {

    this.veiculoService
      .atualizar(
        this.veiculo.id,
        this.veiculo
      )
      .then(() => {

        this.messageService.add({ severity: 'info', summary: 'Veículo editado com sucesso', detail: '', life: 3000 });

        this.resetFormulario();
      });

    return;
  }

  // CADASTRAR

  // const id = uuid();

  this.veiculoService
    .cadastrar( this.veiculo)
    .then(() => {

      this.messageService.add({ severity: 'success', summary: 'Veículo cadastrado com sucesso', detail: '', life: 3000 });

      this.resetFormulario();
    })
    .catch(error => {

      console.error(error);

      this.loading = false;
    });
}

editarVeiculo(
  veiculo: Veiculo
) {

  this.editando = true;

  this.cadastrarVeiculo = true;

  this.veiculo = {
    ...veiculo
  };
}

excluirVeiculo(id?: string) {

  if (!id) return;

  this.veiculoService
    .deletar(id)
    .then(() => {

      this.messageService.add({ severity: 'warn', summary: 'Veículo EXCLUIDO com sucesso.', detail: '', life: 3000 });
    });
}

resetFormulario() {

  this.veiculo = {
    modelo: '',
    ano: '',
    placa: '',
    cor: '',
    status: ''
  };

  this.editando = false;

  this.cadastrarVeiculo = false;

  this.loading = false;
}


}
