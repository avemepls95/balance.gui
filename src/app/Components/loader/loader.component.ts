import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  isLoading: Boolean = false;

  constructor(private loaderService: LoaderService, private cdRef: ChangeDetectorRef) {
    this.loaderService.isLoading.subscribe(x => {
      this.isLoading = x;
      this.cdRef.detectChanges()
    });
   }

  ngOnInit() {
  }

}
