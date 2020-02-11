import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SnackbarService } from 'src/app/Services/snackbar.service';
import { TranslateHelper } from 'src/app/Utils/TranslateHelper';
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
    public translateHelper: TranslateHelper
  ) { 
    snackbarService.setSnackbar(snackbar);
  }

  ngOnInit() {
    this.selectedLanguage = this.translateHelper.getCurrentLanguage();
  }

  onLanguagelChange(languageKey: string) {
    let currentLanguage = this.translateHelper.getCurrentLanguage();
    if (currentLanguage == languageKey)
      return;
    
    this.selectedLanguage = currentLanguage;
    this.translateHelper.switchToLanguage(languageKey);
    this.snackbarService.showSuccessMessage();
  }

}
