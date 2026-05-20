import { Component, inject } from '@angular/core';
import { Movimentacao } from '../../interfaces/movimentacao.interface';
import { MovimentacaoService } from '../../service/movimentacao.service';
import { ButtonModule } from "primeng/button";
import { CommonModule } from '@angular/common';
import { TableModule } from "primeng/table";
import { MessageModule } from 'primeng/message';
import { CardPageComponent } from "../components/card-page/card-page.component";
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';



@Component({
  selector: 'app-relatorio-movimentacoes',
  imports: [ButtonModule, CommonModule, TableModule, MessageModule, CardPageComponent, TooltipModule, FormsModule, InputTextModule, CommonModule],
  templateUrl: './relatorio-movimentacoes.component.html',
  styleUrl: './relatorio-movimentacoes.component.scss'
})
export class RelatorioMovimentacoesComponent {

   private movimentacaoService = inject(MovimentacaoService);

  movimentacoes:
    Movimentacao[] = [];
    movimentacoesOriginais: Movimentacao[] = [];

    //filtros
  filtroMotorista = '';
  filtroPlaca = '';
  filtroModelo = '';
  filtroDataRetirada = '';
  filtroDataDevolucao = '';

  showFiltrosAvancados = false

  FiltrosAvancados(){
    this.showFiltrosAvancados = !this.showFiltrosAvancados
  }

  ngOnInit(): void {

   this.movimentacaoService
  .listar()
  .subscribe(resposta => {

    this.movimentacoes = resposta;

    this.movimentacoesOriginais = resposta;
  });
  }

  finalizar(
    movimentacao:
      Movimentacao
  ) {

    if (!movimentacao.id) {
      return;
    }

    this.movimentacaoService
      .finalizarMovimentacao(
        movimentacao.id
      );
  }

  filtrar() {

  this.movimentacoes =
    this.movimentacoesOriginais.filter(mov => {

      const motorista =
        mov.motoristaNome
          ?.toLowerCase()
          .includes(
            this.filtroMotorista
              .toLowerCase()
          );

      const placa =
        mov.placa
          ?.toLowerCase()
          .includes(
            this.filtroPlaca
              .toLowerCase()
          );

      const modelo =
        mov.modelo
          ?.toLowerCase()
          .includes(
            this.filtroModelo
              .toLowerCase()
          );

      const dataRetirada =
        !this.filtroDataRetirada ||

        mov.dataRetirada
          ?.includes(
            this.filtroDataRetirada
          );

      const dataDevolucao =
        !this.filtroDataDevolucao ||

        mov.dataDevolucao
          ?.includes(
            this.filtroDataDevolucao
          );

      return (
        motorista &&
        placa &&
        modelo &&
        dataRetirada &&
        dataDevolucao
      );
    });
}

limparFiltros() {

  this.filtroMotorista = '';

  this.filtroPlaca = '';

  this.filtroModelo = '';

  this.filtroDataRetirada = '';

  this.filtroDataDevolucao = '';

  this.movimentacoes =
    this.movimentacoesOriginais;
}

}
