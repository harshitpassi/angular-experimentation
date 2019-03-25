import { Directive, Renderer2, OnInit, ElementRef } from '@angular/core';

@Directive({
  selector: '[appBetterHighlight]'
})
export class BetterHighlightDirective implements OnInit {

  constructor(private renderer: Renderer2, private element: ElementRef) { }

  ngOnInit() {
    this.renderer.setStyle(this.element.nativeElement, 'background-color', 'blue');
  }

}
