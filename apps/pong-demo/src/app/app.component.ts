import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { createGame } from '@pong/pong-model';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'pong-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'pong-demo';
  @ViewChild('canvas', { static: true, read: ElementRef }) canvasEl: ElementRef | undefined;

  constructor(private zone: NgZone) {}

  ngOnInit(): void {
      const canvas = this.canvasEl?.nativeElement;
      if (!canvas) {
        throw Error('canvas element not defined');
      }
      this.zone.runOutsideAngular(() => {
        const result = createGame({
          effectFactories: undefined!,
          canvas
        });
      });
      
  }

}
