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
import { VeiculosService } from '../../service/veiculos.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from "primeng/toast";
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Auth } from '@angular/fire/auth';
import { MotoristasService } from '../../service/motoristas.service';
import { DialogModule } from "primeng/dialog";
import { FileUploadModule } from "primeng/fileupload";



@Component({
  selector: 'app-relatorio-movimentacoes',
  imports: [ButtonModule, CommonModule, TableModule, MessageModule, CardPageComponent, TooltipModule, FormsModule, InputTextModule, CommonModule, ToastModule, ConfirmDialogModule, DialogModule, FileUploadModule],
  templateUrl: './relatorio-movimentacoes.component.html',
  styleUrl: './relatorio-movimentacoes.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class RelatorioMovimentacoesComponent {

  private movimentacaoService = inject(MovimentacaoService);
  private veiculoService = inject(VeiculosService);
  private messageService = inject(MessageService)
  private confirmationService =  inject(ConfirmationService);
  private auth = inject(Auth);
  private motoristaService = inject(MotoristasService);

  movimentacoes: Movimentacao[] = [];
  movimentacoesOriginais: Movimentacao[] = [];
  usuario: any;

  modalObservacao = false;

  // observacaoSelecionada = '';
  movimentacaoSelecionada?: Movimentacao;

    //filtros
  filtroMotorista = '';
  filtroPlaca = '';
  filtroModelo = '';
  filtroDataRetirada = '';
  filtroDataDevolucao = '';

  //devolução
  modalDevolucao = false;
  imagemPainelDevolucao?: File;
  previewDevolucao = '';
  observacaoDevolucao = '';

  showFiltrosAvancados = false

  abrirObservacao(mov: Movimentacao) {

  this.movimentacaoSelecionada = mov;

  this.modalObservacao = true;
}

  FiltrosAvancados(){
    this.showFiltrosAvancados = !this.showFiltrosAvancados
  }

  ngOnInit(): void {

  const usuarioLogado = this.auth.currentUser;

  if (!usuarioLogado) return;

  this.motoristaService
    .buscarPorUid(usuarioLogado.uid)
    .subscribe(usuario => {

      this.usuario = usuario;

      this.movimentacaoService
        .listar()
        .subscribe(resposta => {

          let movimentacoesFiltradas = resposta;

          // SE FOR MOTORISTA
          if (this.usuario.role === 'Motorista') {

            movimentacoesFiltradas = resposta.filter(mov =>

              mov.motoristaId === this.usuario.id
            );
          }

          // ORDENAR MAIS RECENTES
          movimentacoesFiltradas.sort((a, b) => {

            return new Date(b.dataRetirada).getTime()
              - new Date(a.dataRetirada).getTime();
          });

          this.movimentacoes = movimentacoesFiltradas;

          this.movimentacoesOriginais =
            movimentacoesFiltradas;
        });
    });
}

 finalizar(movimentacao: Movimentacao) {

  if (!movimentacao.id || !movimentacao.veiculoId) {
    return;
  }

  this.movimentacaoService.finalizarMovimentacao(movimentacao.id)

    .then(() => {

      return this.veiculoService
        .atualizar(
          movimentacao.veiculoId,
          {
            status: 'Ativo'
          }
        );
    })

    .then(() => {

      this.messageService.add({

        severity: 'success',

        summary: 'Veículo devolvido',

        detail:
          'Veículo disponível novamente'
      });
    })

    .catch(error => {

      console.error(error);
    });
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

confirmarDevolucao(event: Event, mov: Movimentacao) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Ao devolver o veículo ficará disponível para outro motorista',
            header: 'Confirmação',
            closable: true,
            closeOnEscape: true,
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'danger',
                outlined: true,
            },
            acceptButtonProps: {
                label: 'Devolver',
                severity: 'info'
            },
            accept: () => {
                 this.movimentacaoSelecionada = mov;

                this.modalDevolucao = true;
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'You have rejected',
                    life: 3000,
                });
            },
        });
    }

    onSelectImagemDevolucao(event: any) {

  const file =
    event.files[0];

  if (file) {

    this.imagemPainelDevolucao = file;

    this.previewDevolucao =
      URL.createObjectURL(file);
  }
}
confirmarDevolucaoFinal() {

  if (
    !this.movimentacaoSelecionada ||
    !this.imagemPainelDevolucao
  ) {

    this.messageService.add({

      severity: 'error',

      summary: 'Imagem obrigatória',

      detail:
        'Adicione a foto do painel'
    });

    return;
  }

  this.movimentacaoService

    .uploadImagem(
      this.imagemPainelDevolucao
    )

    .then((urlImagem) => {

      return this.movimentacaoService
        .atualizar(
          this.movimentacaoSelecionada!.id!,
          {

            status: 'Finalizado',

            dataDevolucao:
              new Date().toISOString(),

            imagemPainelDevolucao:
              urlImagem,

            observacaoDevolucao:
              this.observacaoDevolucao
          }
        );
    })

    .then(() => {

      return this.veiculoService
        .atualizar(
          this.movimentacaoSelecionada!
            .veiculoId!,
          {
            status: 'Ativo'
          }
        );
    })

    .then(() => {

      this.messageService.add({

        severity: 'success',

        summary:
          'Veículo devolvido'
      });

      this.modalDevolucao = false;
    });
}

}
