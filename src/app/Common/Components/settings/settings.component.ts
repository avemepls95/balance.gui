import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from '../../Services/snackbar.service';

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
