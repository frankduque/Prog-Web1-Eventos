import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

// Módulos do Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.css'
})
export class EventFormComponent implements OnInit {
  eventForm!: FormGroup;
  isEditMode: boolean = false;
  eventId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.eventForm = this.fb.group({
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      local: ['', Validators.required],
      dataInicio: [null, Validators.required],
      dataFim: [null, Validators.required],
      publicoAlvoAdulto: [false, Validators.required]
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.eventId = +id;
        this.loadEventData(this.eventId);
      }
    });
  }

  /**
   * Carrega os dados de um evento existente para preencher o formulário em modo de edição.
   * @param id O ID do evento a ser carregado.
   */
  loadEventData(id: number): void {
    this.eventService.getById(id).subscribe({
      next: (event) => {
        const dataInicio = event.dataInicio ? new Date(event.dataInicio) : null;
        const dataFim = event.dataFim ? new Date(event.dataFim) : null;

        this.eventForm.patchValue({
          nome: event.nome,
          descricao: event.descricao,
          local: event.local,
          dataInicio: dataInicio,
          dataFim: dataFim,
          publicoAlvoAdulto: event.publicoAlvoAdulto
        });
      },
      error: (err) => {
        console.error('Erro ao carregar evento:', err);
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: `Não foi possível carregar o evento para edição: ${err.message || err.error || 'Erro desconhecido'}`,
        });
        this.router.navigate(['/']);
      }
    });
  }

  /**
   * Lida com o envio do formulário, chamando o método de criação ou atualização no serviço.
   */
  onSubmit(): void {
    if (this.eventForm.valid) {
      const formValues = this.eventForm.value;

      const eventToSave: Event = {
        id: this.eventId !== null ? this.eventId : undefined,
        nome: formValues.nome,
        descricao: formValues.descricao,
        local: formValues.local,
        dataInicio: (formValues.dataInicio as Date).toISOString().substring(0, 10),
        dataFim: (formValues.dataFim as Date).toISOString().substring(0, 10),
        publicoAlvoAdulto: formValues.publicoAlvoAdulto
      };

      if (this.isEditMode && this.eventId !== null) {
        this.eventService.update(this.eventId, eventToSave).subscribe({
          next: (event) => {
            console.log('Evento atualizado com sucesso:', event);
            Swal.fire({
              icon: 'success',
              title: 'Sucesso!',
              text: 'Evento atualizado com sucesso!',
              confirmButtonText: 'OK'
            }).then(() => {
              this.router.navigate(['/']);
            });
          },
          error: (err) => {
            console.error('Erro ao atualizar evento:', err);
            Swal.fire({
              icon: 'error',
              title: 'Erro!',
              text: `Erro ao atualizar evento: ${err.message || err.error || 'Erro desconhecido'}`,
            });
          }
        });
      } else {
        this.eventService.create(eventToSave).subscribe({
          next: (event) => {
            console.log('Evento criado com sucesso:', event);
            Swal.fire({
              icon: 'success',
              title: 'Sucesso!',
              text: 'Evento criado com sucesso!',
              confirmButtonText: 'OK'
            }).then(() => {
              this.router.navigate(['/']);
            });
          },
          error: (err) => {
            console.error('Erro ao criar evento:', err);
            Swal.fire({
              icon: 'error',
              title: 'Erro!',
              text: `Erro ao criar evento: ${err.message || err.error || 'Erro desconhecido'}`,
            });
          }
        });
      }
    } else {
      this.eventForm.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Atenção!',
        text: 'Por favor, preencha todos os campos obrigatórios.',
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

}
