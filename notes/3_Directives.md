# Directives

- Two types:
  - Attribute : Only changes properties of the DOM element it is used on. Ex. ngClass, ngStyle
  - Structural : change structure of DOM around element. DOM elements get added/removed. The entire view container is affected. They have a * in front of them. Ex. ngIf, ngFor
- Cannot have more than one structural directive on a single element.

## Interesting Sidenote

- *ngIf is actually a shorthand for the attribute property being bound to an enclosing ng-template.
- Short version:
```html
<div *ngIf="condition">Content to render when condition is true.</div>
```
- Expanded version:
```html
<ng-template [ngIf]="condition"><div>Content to render when condition is
true.</div></ng-template>
```
- you can also have an optional then and else blocks:
```html
<div *ngIf="boolCondition; then thenBlock else elseBlock">Content</div>
<ng-template #thenBlock>Rendered after Content if boolCondition is true.</ng-template>
<ng-template #elseBlock>Rendered in place of Content if boolCondition is false.</ng-template>
```

## 1. Custom Attribute Directives

- Defined with the @Directive decorator.
- Template of the element that the attribute directive is defined on is injected into the directive.
- it is injected as an ElementRef object in the constructor.
```ts
import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
    selector: '[appBasicHighlight]'
})
export class BasicHighlightDirective implements OnInit {
    constructor(private elementRef: ElementRef) {}

    ngOnInit() {
        this.elementRef.nativeElement.style.backgroundColor = 'green';
    }
}
```

- Also need to add the directive to a module's declarations to use it.
- Usage:
```html
<p appBasicHighlight>Styled with basic-highlight-directive</p>
```
- No need to send any value as there is no input.
- No need to add `[]` as the selector signifies that it should just be an attribute of the element to be selected.
- the `[]` are not part of the directive's name. They're part of the selector instead.

## 2. Using Renderer for more enhanced Attribute Directives

- Accessing elements directly is not a good practice.
- Angular can render templates without a DOM in service workers and other advanced use cases. In such cases, the properties would not be available.
- We can use the Renderer instead, which is also injected into the directive.
- The Renderer has a setStyle property, which can be used to set a style property on an element:
```ts
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
```
- [More about the renderer](https://angular.io/api/core/Renderer2 "Angular API on Renderer2")
