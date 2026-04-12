import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Laakkeet, Laake } from '../laake';

interface LaakeUI extends Laake {
  status: 'default' | 'ok' | 'puute';
  expOpen: boolean;
}

const currentYear = new Date().getFullYear();

@Component({
  selector: 'app-laake-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './laake-list.html',
  styleUrl: './laake-list.scss'
})
export class LaakeListComponent implements OnInit {
  private laakeService = inject(Laakkeet);
  private cdr = inject(ChangeDetectorRef)

  location = 'home';
  editMode = false;
  laakkeet: LaakeUI[] = [];

  groups = ['asema', 'sairaala'];

  expYears = Array.from({ length: 8 }, (_, i) => currentYear + i);
  ngOnInit() {
    this.laakeService.getLaakkeet(this.location).subscribe(data => {
      this.laakkeet = data.map(l => ({
        ...l,
        status: l.status ?? 'default',
        expOpen: false
      }));
      this.cdr.detectChanges();
    });

    window.addEventListener('beforeunload', () => this.save());
  }

  getGroup(group: string) {
    return this.laakkeet.filter(l => l.mista === group);
  }

  toggleStatus(laake: LaakeUI, val: 'ok' | 'puute') {
    laake.status = laake.status === val ? 'default' : val;
    this.save();
  }

  toggleExpOpen(laake: LaakeUI) {
    if (laake.expOpen) {
      // closing the picker
      this.save();
    }
    laake.expOpen = !laake.expOpen;
  }

  clearExp(laake: LaakeUI) {
    laake.expMonth = '';
    laake.expYear = '';
    laake.expOpen = false;
    this.save();
  }

  isExpired(expMonth: string, expYear: string): boolean {
    if (!expMonth || !expYear) return false;
    const now = new Date();
    return new Date(parseInt(expYear), parseInt(expMonth) - 1, 1) < new Date(now.getFullYear(), now.getMonth(), 1);
  }
  toggleEdit() {
    if (this.editMode) {
      this.save();
    }
    this.editMode = !this.editMode;
  }

  resetAll() {
    this.laakkeet.forEach(l => {
      l.status = 'default';
      l.expMonth = '';
      l.expYear = '';
      l.expOpen = false;
    });
  }

  removeDrug(laake: LaakeUI) {
    this.laakkeet = this.laakkeet.filter(l => l !== laake);
  }

  save() {
    if (!this.laakkeet.length) return;
    const toSave = this.laakkeet.map(({ expOpen, ...rest }: any) => rest);
    this.laakeService.saveLaakkeet(this.location, toSave).subscribe({
      next: () => console.log('saved'),
      error: (err) => console.log('save error', err)
    });
  }
}
