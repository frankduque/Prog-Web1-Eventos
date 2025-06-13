import { Component } from '@angular/core';
import {NgForOf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-event-list',
  imports: [
    NgForOf,
    MatButton,
    RouterLink
  ],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css'
})
export class EventListComponent {
  eventos = [
    {
      nome: 'Festival de Música',
      descricao: 'Evento musical com bandas locais',
      local: 'Parque Central',
      dataInicio: '2025-05-10',
      dataFim: '2025-05-12',
      publicoAlvoAdulto: true
    },
    {
      nome: 'Feira de Tecnologia',
      descricao: 'Exposição de startups e inovação',
      local: 'Centro de Convenções',
      dataInicio: '2025-06-01',
      dataFim: '2025-06-03',
      publicoAlvoAdulto: false
    }
  ];
}
