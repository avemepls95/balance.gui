import { Directive, ElementRef, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[RemoveZero]'
})
export class RemoveZeroDirective {

  constructor(private el: ElementRef) { }

  @HostListener('click', ['$event'])
  onKeyDown(event: any) {
    if (event.target.value === '0')
      event.target.value = '';
  }
}
