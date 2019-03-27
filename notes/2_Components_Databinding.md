# Advanced Components and Databinding

## 1. Custom Property Binding
- We use custom property binding to pass data from parent -> child
- By default, any property of a component is only accessible inside that component in Angular:
  ```ts
  export class ServerElementComponent implements OnInit {
  element: {type: string, name: string, content: string};

  constructor() { }

  ngOnInit() {
  }

  }
  ```
  ```html
  <app-server-element *ngFor="let serverElement of serverElements" [element]="serverElement"></app-server-element>
  ```
- This will give an error stating that `element` is not a known property of `app-server-element`.
- We have to explicitly tell angular which properties we want to expose to parent components.
- `@Input()` decorator tells Angular that a property can be bound to by parent components.
  ```ts
  export class ServerElementComponent implements OnInit {
    @Input() element: {type: string, name: string, content: string};
  }
  ```
- We can also assign aliases to input properties if we want to reference them by another name in parent components.
- To do that, we need to send an argument to `@Input('<string containing propert alias>')`
```html
<app-server-element *ngFor="let serverElement of serverElements" [srvElement]="serverElement"></app-server-element>
```
```ts
@Input('srvElement') element: {type: string, name: string, content: string};
```

## 2. Custom Event Binding
- Used to pass data/events from child -> parent.
- events are created as properties on the child component, with the @Output decorator.
- they need to be of type `EventEmitter` imported from `@angular/core`.
- `EventEmitter` is a generic type, which needs the type of event data to be emitted.
```ts
  @Output() serverCreated = new EventEmitter<{serverName: string, serverContent: string}>();
  @Output() blueprintCreated = new EventEmitter<{serverName: string, serverContent: string}>();
  newServerName = '';
  newServerContent = '';

  onAddServer() {
    this.serverCreated.emit({serverName: this.newServerName, serverContent: this.newServerContent});
  }

  onAddBlueprint() {
    this.blueprintCreated.emit({serverName: this.newServerName, serverContent: this.newServerContent});
  }

```
```html
  <button class="btn btn-primary" (click)="onAddServer()">Add Server</button>
  <button class="btn btn-primary" (click)="onAddBlueprint()">Add Server Blueprint</button>
```
```html
  <app-cockpit (serverCreated)="onServerAdded($event)" (blueprintCreated)="onBlueprintAdded($event)"></app-cockpit>
```
```ts
  onServerAdded(serverData: {serverName: string, serverContent: string}) {
    this.serverElements.push({
      type: 'server',
      name: serverData.serverName,
      content: serverData.serverContent
    });
  }

  onBlueprintAdded(serverData: {serverName: string, serverContent: string}) {
    this.serverElements.push({
      type: 'blueprint',
      name: serverData.serverName,
      content: serverData.serverContent
    });
  }
```
- Similar to `@Input('<alias>')`, we can define an alias for our emitted events as well `@Output('<alias>')`

## 3. View Encapsulation
- Angular enforces that each component's CSS file only applies to the component itself, not even to its child components.
- Angular does this by applying a unique attribute to all the DOM elements of a component. It also adds the same attribute to all the style selectors of your component CSS file
- This emulates the implementation of a shadow DOM, since all browsers don't support it yet.
- To override this default behaviour, we can add an `encapsulation` property to the `@Component` decorator of a component.
- `ViewEncapsulation` has 3 properties: Native, Emulated and None.
  - None: no View Encapsulation. No unique attributes are applied, and any changes in the Component CSS are applied globally.
  - Emulated: default behaviour.
  - Native: Uses shadow DOM. Same in functionality to Emulated, but wouldn't work in browsers that don't support shadow DOM yet.
```ts
import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-server-element',
  templateUrl: './server-element.component.html',
  styleUrls: ['./server-element.component.css'],
  encapsulation: ViewEncapsulation.None
})
```

## 4. Using Local References in Templates
- Local references can be placed on any HTML element in the template.
- They hold the value of the entire element and all of its properties.
- We can use them only in the template, not in the component TS.
```html
  <input type="text" class="form-control" #serverNameInput>
  <button class="btn btn-primary" (click)="onAddServer(serverNameInput)">Add Server</button>
```

```ts
  onAddServer(nameInput: HTMLInputElement) {
    this.serverCreated.emit({serverName: nameInput.value, serverContent: this.newServerContent});
  }
```

## 5. @ViewChild
- To access template elements without passing them explicitly to typescript code.
- `@ViewChild` decorator returns an `ElementRef` with the reference to an element that can be used to get its value.
- It takes a selector for the element as an input. This selector can be a local reference or instance of an Angular component.
```html
<input type="text" class="form-control" #serverContentInput>
```
```ts
@ViewChild('serverContentInput') serverContentInput: ElementRef;
onAddServer(nameInput: HTMLInputElement) {
    this.serverCreated.emit({
      serverName: nameInput.value,
      serverContent: this.serverContentInput.nativeElement.value
    });
  }
```

## 6. ng-content
- anything placed between opening and closing tags of a component is lost by default.
- you can use the `<ng-content></ng-content>` directive to serve as a hook to mark where you want content insterted inside your component.
Parent file:
```html
 <app-server-element *ngFor="let serverElement of serverElements" [element]="serverElement">
        <p #paragraphContent>
            <strong *ngIf="serverElement.type === 'server'" style="color: red">{{ serverElement.content }}</strong>
            <em *ngIf="serverElement.type === 'blueprint'">{{ serverElement.content }}</em>
        </p>
  </app-server-element>
```
Child file:
```html
<div class="row">
    <div class="col-xs-12">
        <div class="panel panel-default">
            <div class="panel-heading">{{ element.name }}</div>
            <div class="panel-body">
                <ng-content></ng-content>
            </div>
        </div>
    </div>
</div>
```
- Really useful for when you want to send complex HTML templates from one component to the next.
- To access projected content in the child component, we can use the `@ContentChild` decorator.
Child Component:
```ts
@ContentChild('paragraphContent') paragraph: ElementRef;
```
Same in parent component:
```ts
@ViewChild('paragraphContent') paragraph: ElementRef;
```

## 7. Component Lifecycle
- As soon as Angular finds the seletor for a component, it is added to the DOM.
- Angular goes through certain phases through the lifecycle of a component, and gives us hooks like `ngOnInit()` to execute some code once it goes through one of the phases.
  - ngOnChanges : executed at the start, and subsequently whenever a bound *input* property changes. It is the only lifecycle hook that receives arguments. It receives the `changes: SimpleChanges` argument. This argument has the current and previous values of all the bound input properties. If an object is changed, but the reference remains the same i.e. only the value of a property is changed in an object, ngOnChanges is not fired.
  - ngOnInit : executed after ngOnChanges, once the component has been initialized. Not necessarily added to the DOM yet, but the object was created so properties can be accessed. Runs after the constructor.
  - ngDoCheck : runs whenever change detection runs. Change detection determines whether something has changed in a component, and whether template needs to be updated. ngDoCheck runs whenever change detection runs a check, regardless of whether something has changed or not. Change detection has certain events when it runs, like button clicks, events or resolution of promises. Also, change detection runs one extra time in dev mode, right in the beginning.
  - ngAfterContentInit : called when ng-content has been projected into the view.
  - ngAfterContentChecked : called whenever projected content has been checked.
  - ngAfterViewInit : when component's and child's view has been initialized.
  - ngAfterViewChecked : whenever view has been checked.
  - ngOnDestroy : Whenever component is about to be destroyed.
- Template elements through @ContentChild can only be accessed after the `ngAfterContentInit()` lifecycle hook.  
- Template elements through @ViewChild can only be accessed after the `ngAfterViewInit()` lifecycle hook.
  
