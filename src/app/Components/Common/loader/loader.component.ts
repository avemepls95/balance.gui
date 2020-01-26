import { Component, OnInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { LoaderService } from 'src/app/Services/loader.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit, AfterViewChecked {

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

  ngAfterViewChecked() {
    var spinner = document.getElementsByClassName('spinner')[0] as HTMLElement;
    if (isNullOrUndefined(spinner))
      return;

    spinner.style.left = (window.innerWidth / 2 - 50) + 'px';
    spinner.style.top = (window.innerHeight / 2 - 50) + 'px';
  }

}
