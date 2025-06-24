import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../supabase.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
})
export class ClientsComponent implements OnInit {
  clients: any[] = [];
  loading = false;

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    await this.fetchClients();
  }

  async fetchClients() {
    this.loading = true;
    const { data, error } = await this.supabase.getClients();
    if (data) this.clients = data;
    if (error) console.error('Error fetching clients:', error);
    this.loading = false;
  }
}
