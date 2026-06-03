import { Component, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { VeiculosService } from '../../service/veiculos.service';
import { Veiculo } from '../../interfaces/veiculo.interface';
import { MessageModule } from 'primeng/message';
import { DialogModule } from "primeng/dialog";
import { MovimentacaoService } from '../../service/movimentacao.service';
import { Auth } from '@angular/fire/auth';
import { MotoristasService } from '../../service/motoristas.service';
import { Movimentacao } from '../../interfaces/movimentacao.interface';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';


@Component({
  selector: 'app-veiculos',
  imports: [
    CardModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    CommonModule,
    MessageModule,
    DialogModule,
    FormsModule,
    TextareaModule
  ],
  templateUrl: './veiculos.component.html',
  styleUrl: './veiculos.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class VeiculosComponent {
  private movimentacaoService = inject(MovimentacaoService);
  private auth = inject(Auth);
  private motoristaService = inject(MotoristasService);
  public veiculoService = inject(VeiculosService);

  dialogVisible = false;
  observacao = '';
  
  veiculoSelecionado?: Veiculo;
  veiculos: Veiculo[] = [];
  usuario: any;
   veiculo = this.veiculoSelecionado;
   imagemPainel?: File;

 ngOnInit(): void {

  this.veiculoService
    .listar()
    .subscribe(resposta => {

      this.veiculos = resposta;
    });

  const usuarioLogado =
    this.auth.currentUser;

  if (usuarioLogado) {

    this.motoristaService
      .buscarPorUid(usuarioLogado.uid)
      .subscribe(resposta => {

        this.usuario = resposta;
      });
  }
}

onFileSelect(event: any) {

  const file =
    event.target.files[0];

  if (file) {

    this.imagemPainel = file;
  }
}


  constructor(private confirmationService: ConfirmationService, private messageService: MessageService) { }

  abrirDialog(carro: Veiculo) {

    this.veiculoSelecionado = carro;

    this.dialogVisible = true;
  }

  confirmarSelecionado() {

  const usuario = this.usuario;

  if (
    !usuario ||
    !this.veiculoSelecionado
  ) {
    return;
  }

  if (!this.imagemPainel) {

    this.messageService.add({

      severity: 'error',

      summary: 'Imagem obrigatória',

      detail:
        'Adicione uma foto do painel'
    });

    return;
  }

  const veiculo =
    this.veiculoSelecionado;

  this.movimentacaoService

    .uploadImagem(this.imagemPainel)

    .then((imagemUrl) => {

      const movimentacao: Movimentacao = {

        motoristaId: usuario.id,

        motoristaNome:
          usuario.nome +
          ' ' +
          usuario.sobrenome,

        veiculoId:
          veiculo.id!,

        modelo:
          veiculo.modelo,

        placa:
          veiculo.placa,

        observacao:
          this.observacao,

        imagemPainel:
          imagemUrl,

        dataRetirada:
          new Date().toISOString(),

        dataDevolucao: '',

        status: 'Em uso'
      };

      return this.movimentacaoService
        .cadastrar(movimentacao);
    })

    .then(() => {

      return this.veiculoService
        .atualizar(
          veiculo.id!,
          {
            status: 'Em uso'
          }
        );
    })

    .then(() => {

      this.messageService.add({

        severity: 'success',

        summary:
          'Veículo selecionado',

        detail:
          'Movimentação registrada'
      });

      this.dialogVisible = false;

      this.observacao = '';

      this.imagemPainel = undefined;
    })

    .catch(error => {

      console.error(error);

      this.messageService.add({

        severity: 'error',

        summary: 'Erro',

        detail:
          'Erro ao registrar movimentação'
      });
    });
}

  confirmarCar(carros: Veiculo) {
    this.confirmationService.confirm({
      header: 'Confirmação',
      message: `Ao confirmar você ficará responsável pelo ${carros.modelo}`,
      icon: 'pi pi-exclamation-circle',
      rejectButtonProps: {
        label: 'Cancelar',
        icon: 'pi pi-times',
        outlined: true,
        size: 'small',
        severity: 'danger'
      },
      acceptButtonProps: {
        label: 'Selecionar',
        icon: 'pi pi-check',
        size: 'small'
      },
      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
        console.log('Carro selecionado:', carros);
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
  }


}
