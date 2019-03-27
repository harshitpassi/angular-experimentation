# Directives

- Two types:
  - Attribute : Only changes properties of the DOM element it is used on. Ex. ngClass, ngStyle
  - Structural : change structure of DOM around element. DOM elements get added/removed. The entire view container is affected. They have a * in front of them. Ex. ngIf, ngFor
- Cannot have more than one structural directive on a single element.

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

## 3. Interactive directives using HostListener to listen to Host Events

- `@HostListener` directive can be used to specify functions to be executed when an event is fired in the host element.
- It takes the name of event as the input. `Event` data is received as an argument to the function specified.
- it can also listen to custom events triggered on the element.
```ts
  @HostListener('mouseenter') mouseover(eventData: Event) {
    this.renderer.setStyle(this.element.nativeElement, 'background-color', 'blue');
    this.renderer.setStyle(this.element.nativeElement, 'color', 'white');
  }

  @HostListener('mouseleave') mouseleave(eventData: Event) {
    this.renderer.setStyle(this.element.nativeElement, 'background-color', 'transparent');
    this.renderer.setStyle(this.element.nativeElement, 'color', 'black');
  }
```

## 4. Binding to Host Properties with HostBinding

- `@HostBinding` can be used to directly bind to host element properties.
- It takes the exact property you need to bind to as input.
```ts
@HostBinding('style.backgroundColor') backgroundColor = 'transparent';

@HostListener('mouseenter') mouseover(eventData: Event) {
    this.backgroundColor = 'blue';
    this.renderer.setStyle(this.element.nativeElement, 'color', 'white');
}
```

## 5. Binding to directive properties

- We can have normal `@Input` properties and `@Output` events in directives and bind to them.
```ts
import { Directive, Renderer2, OnInit, ElementRef, HostListener, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[appBetterHighlight]'
})
export class BetterHighlightDirective implements OnInit {
  @Input() defaultColor = 'transparent';
  @Input() highlightColor = 'blue';
  @HostBinding('style.backgroundColor') backgroundColor;

  constructor(private renderer: Renderer2, private element: ElementRef) { }

  ngOnInit() {
    // this.renderer.setStyle(this.element.nativeElement, 'background-color', 'blue');
    this.backgroundColor = this.defaultColor;
  }

  @HostListener('mouseenter') mouseover(eventData: Event) {
    // this.renderer.setStyle(this.element.nativeElement, 'background-color', 'blue');
    this.backgroundColor = this.highlightColor;
    this.renderer.setStyle(this.element.nativeElement, 'color', 'white');
  }

  @HostListener('mouseleave') mouseleave(eventData: Event) {
    // this.renderer.setStyle(this.element.nativeElement, 'background-color', 'transparent');
    this.backgroundColor = this.defaultColor;
    this.renderer.setStyle(this.element.nativeElement, 'color', 'black');
  }

}
```

```html
<p appBetterHighlight [defaultColor]="'yellow'" [highlightColor]="'red'">Styled with better-highlight directive</p>
```

- While binding values to the properties of an element (`<p>` in this case), Angular first checks the properties of any custom directives on the element, before going to the native properties of the element.
- Generally, when there is only one main property to bind to, it is given the alias of the directive name itself. In this case, you can directly reference the directive and the property with one binding on the element.
- by default, the directive name is not enclosed in `[]`, that only happens when you have to bind to a property with the same name as that of the directive's selector.
```ts
@Input('appBetterHighlight') highlightColor = 'blue';
```
```html
<p [appBetterHighlight]="'red'" [defaultColor]="'yellow'">Styled with better-highlight directive</p>
```
- We can also remove the square brackets if we only want to pass a string value to the property
  - `[property]="'string value'"` is the same as `property="string value"`. `[]` allow you to evaluate the JS expression in the `""`.
```html
<p [appBetterHighlight]="'red'" defaultColor="yellow">Styled with better-highlight directive</p>
```

## 6. Structural Directives

- Stuctural directives begin with `*`. Behind the scenes they are transformed.

### Interesting Sidenote

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


- As in the Sidenote above, `*ngIf` gets broken down into an `<ng-template>` with an `ngIf` directive and property binding.
- `<ng-template>` is an element which is not rendered, but defines a template for Angular to use once it determines that it needs to be rendered.

## 7. Building custom structural directives

- Built as a normal directive. Only in its usage, whenever Angular sees a `*`, it encloses the element with `<ng-template></ng-template>` tags and applies an attribute directive over it.
- The below directive is an opposite of the ngIf directive. Only renders when a condition is false:
```ts
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appUnless]'
})
export class UnlessDirective {
  @Input('appUnless') set unless(condition: boolean) {
    if (!condition) {
      this.vcRef.createEmbeddedView(this.templateRef);
    } else {
      this.vcRef.clear();
    }
  }

  constructor(private templateRef: TemplateRef<any>, private vcRef: ViewContainerRef) { }

}
```
- the set keyword is used to initialize a setter in typescript. It is a shorthand that creates a property with the name of the method you pass in front of it, and executes the method whenever the property changes. The method receives the new value.
- `TemplateRef<any>` is a generic which receives a reference to the template on which this directive is applied.
- `ViewContainerRef` is a reference to the position in the view where the template is to be embedded.
```html
<div *appUnless="onlyOdd">
    <li class="list-group-item" *ngFor="let number of numbers">
        <p [ngClass]="{odd: number % 2 !== 0}" [ngStyle]="{'backgroundColor': number % 2 === 0 ? 'yellow' : 'transparent' }">{{number}}</p>
    </li>
</div>
```

## 8. ngSwitch

- Structural directive that works mostly like a normal switch statement.

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  numbers = [1, 2, 3, 4, 5];
  oddNumbers = this.numbers.filter(item => item % 2 !== 0);
  onlyOdd = false;
  value = 10;
}
```

```html
<div [ngSwitch]="value" >
    <p *ngSwitchCase="5" >Value is 5</p>
    <p *ngSwitchCase="10">Value is 10</p>
    <p *ngSwitchCase="100">Value is 100</p>
    <p *ngSwitchDefault>Value is Default</p>
</div>
```
