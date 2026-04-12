import { Component, OnInit, Output, EventEmitter, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-location-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './location-modal.html',
  styleUrl: './location-modal.scss'
})
export class LocationModalComponent implements OnInit {
  @Output() locationSelected = new EventEmitter<string>();

  private cdr = inject(ChangeDetectorRef);


  private http = inject(HttpClient);
  private firebaseUrl = environment.firebaseUrl;

  lastLocation: string | null = null;
  locations: string[] = [];
  selectedLocation = '';
  newLocation = '';

  ngOnInit() {
    this.lastLocation = localStorage.getItem('lastLocation');
    this.loadLocations();
  }

  loadLocations() {
    this.http.get<string[]>(`${this.firebaseUrl}/sijainnit.json`).subscribe({
      next: data => {
        this.locations = data ?? [];
        if (!this.selectedLocation && this.locations.length > 0) {
          this.selectedLocation = this.locations[0];
        }
        this.cdr.detectChanges();
      },
      error: () => this.locations = []
    });
  }

  select(location: string) {
    localStorage.setItem('lastLocation', location);
    this.locationSelected.emit(location);
  }

  addLocation() {
    const trimmed = this.newLocation.trim();
    if (!trimmed) return;

    const exists = this.locations.some(
      l => l.toLowerCase() === trimmed.toLowerCase()
    );

    if (exists) {
      alert(`Sijainti "${trimmed}" on jo olemassa`);
      return;
    }

    const confirmed = confirm(`Lisätäänkö uusi sijainti "${trimmed}"?`);
    if (!confirmed) return;

    const updated = [...this.locations, trimmed];
    this.http.put(`${this.firebaseUrl}/sijainnit.json`, updated).subscribe({
      next: () => {
        this.locations = updated;
        this.newLocation = '';
        this.select(trimmed);
      }
    });
  }
}
