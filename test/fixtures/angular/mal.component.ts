/* Fixture con errores a proposito. */
import { Component } from '@angular/core';

@Component({
  selector: 'mal-selector',
  template: '<p>hola</p>',
})
export class MalComponente {
  ngOnInit() {}
}
