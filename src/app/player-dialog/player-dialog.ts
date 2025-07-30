import { NgClass } from '@angular/common';
import { Component, model, signal, Input, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'player-dialog',
  imports: [MatFormField, MatFormFieldModule, MatLabel, FormsModule, MatInputModule, NgClass],
  templateUrl: './player-dialog.html',
  styleUrl: './player-dialog.scss'
})
export class PlayerDialog {
  name = model('');
  target!: HTMLElement;
  inputValue = signal('');
  
  constructor(private dialogRef: MatDialogRef<PlayerDialog>) { }

  submit(event: Event) {
    if (this.name()) {
      this.target = event.target as HTMLElement;
      const classListCopy = [...this.target.classList];
      let myObject = {
        classListCopy: classListCopy,
        playerName: this.name()
      }
      this.dialogRef.close(myObject);
    }
  }
}