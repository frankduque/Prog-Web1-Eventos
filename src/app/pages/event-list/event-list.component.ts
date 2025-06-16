import { Component, OnInit } from '@angular/core';
import {NgForOf, NgIf } from '@angular/common';
import {MatButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-event-list',
  imports: [
    NgForOf,
    NgIf,
    MatButton,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css'
})
export class EventListComponent implements OnInit { // Implemente OnInit
  eventos: Event[] = []; // Inicialize como um array vazio
  isLoading = true; // Para controlar o estado de carregamento
  error: string | null = null; // Para armazenar mensagens de erro

  constructor(private eventService: EventService) { } // Injete o serviço

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents(): void {
    this.isLoading = true;
    this.error = null;
    this.eventService.getEvents().subscribe({
      next: (data) => {
        this.eventos = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar eventos:', err);
        this.error = 'Não foi possível carregar os eventos. Tente novamente mais tarde.';
        this.isLoading = false;
      }
    });
  }

  deleteEvent(id: number | undefined): void {
    if (id === undefined) {
      console.warn('Tentativa de deletar evento sem ID.');
      return;
    }

    // SweetAlert2 para confirmação de exclusão
    Swal.fire({
      title: 'Tem certeza?',
      text: "Você não poderá reverter esta ação!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) { // Se o usuário confirmar
        this.eventService.deleteEvent(id).subscribe({
          next: () => {
            console.log(`Evento com ID ${id} excluído com sucesso.`);
            this.eventos = this.eventos.filter(evento => evento.id !== id); // Remove o evento da lista local
            Swal.fire(
              'Excluído!',
              'O evento foi excluído com sucesso.',
              'success'
            );
          },
          error: (err) => {
            console.error(`Erro ao excluir evento com ID ${id}:`, err);
            Swal.fire({
              icon: 'error',
              title: 'Erro!',
              text: `Não foi possível excluir o evento: ${err.message || err.error || 'Erro desconhecido'}`,
            });
          }
        });
      }
    });
  }
}
