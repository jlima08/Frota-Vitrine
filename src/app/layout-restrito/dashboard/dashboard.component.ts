import { Component, inject } from '@angular/core';
import { CardPageComponent } from "../components/card-page/card-page.component";
import { Veiculo } from '../../interfaces/veiculo.interface';
import { VeiculosService } from '../../service/veiculos.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CardPageComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
   private veiculoService = inject(
  VeiculosService
);


veiculos: Veiculo[] = [];

 ngOnInit(): void {

  this.veiculoService
    .listar()
    .subscribe(resposta => {

      this.veiculos = resposta;
    });
  }

}
