
import { Component } from '@angular/core';

@Component({
  selector: 'app-bi',
  standalone: true,
  template: `
    <div class="bi-container">
      <iframe
        title="TransitFlow"
        width="100%"
        height="700"
        src="https://app.powerbi.com/reportEmbed?reportId=f2def986-f9a8-4e31-b1af-d8ba2e98f3bf&autoAuth=true&ctid=604f1a96-cbe8-43f8-abbf-f8eaf5d85730"
        frameborder="0"
        allowFullScreen="true">
      </iframe>
    </div>
  `
})
export class BiComponent {}
