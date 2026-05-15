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


@Component({
  selector: 'app-veiculos',
  imports: [
    CardModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    CommonModule,
    MessageModule
    
  ],
  templateUrl: './veiculos.component.html',
  styleUrl: './veiculos.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class VeiculosComponent {
  public veiculoService = inject(VeiculosService);
  veiculos: Veiculo[] = [];

  ngOnInit(): void {

  this.veiculoService
    .listar()
    .subscribe(resposta => {

      this.veiculos = resposta;

      console.log(this.veiculos);
    });
}



   constructor(private confirmationService: ConfirmationService, private messageService: MessageService) {}

    // confirm(carros: Carro) {
    //     this.confirmationService.confirm({
    //         header: 'Confirmação',
    //         message: `Ao confirmar você ficará responsável pelo ${carros.modelo}`,
    //         icon: 'pi pi-exclamation-circle',
    //         rejectButtonProps: {
    //             label: 'Cancelar',
    //             icon: 'pi pi-times',
    //             outlined: true,
    //             size: 'small',
    //             severity: 'danger'
    //         },
    //         acceptButtonProps: {
    //             label: 'Selecionar',
    //             icon: 'pi pi-check',
    //             size: 'small'
    //         },
    //         accept: () => {
    //             this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
    //             console.log('Carro selecionado:', carros);
    //         },
    //         reject: () => {
    //             this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    //         }
    //     });
    // }


}
