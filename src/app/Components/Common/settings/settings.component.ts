import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SnackbarService } from 'src/app/Services/snackbar.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  
  selectedLanguage: string;

  constructor(
    private snackbarService: SnackbarService,
    snackbar: MatSnackBar,
  ) { 
    snackbarService.setSnackbar(snackbar);
  }

  ngOnInit() {
  }
}
