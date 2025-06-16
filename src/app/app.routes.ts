import { Routes } from '@angular/router';
import { EventListComponent } from './pages/event-list/event-list.component';
import { EventFormComponent } from './pages/event-form/event-form.component';

export const routes: Routes = [
  { path: '', component: EventListComponent },
  { path: 'create', component: EventFormComponent },
  { path: 'events/:id/edit', component: EventFormComponent }

];
