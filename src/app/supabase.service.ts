import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  // Get all clients
  async getClients() {
    const { data, error } = await this.supabase
      .from('clients')
      .select('*')
      .order('name', { ascending: true });
    return { data, error };
  }

  // Get a single client by ID
  async getClient(id: string) {
    const { data, error } = await this.supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  }

  // Add a new client
  async addClient(client: any) {
    const { data, error } = await this.supabase
      .from('clients')
      .insert([client]);
    return { data, error };
  }

  // Update a client
  async updateClient(id: string, updates: any) {
    const { data, error } = await this.supabase
      .from('clients')
      .update(updates)
      .eq('id', id);
    return { data, error };
  }

  // Delete a client
  async deleteClient(id: string) {
    const { data, error } = await this.supabase
      .from('clients')
      .delete()
      .eq('id', id);
    return { data, error };
  }
}
