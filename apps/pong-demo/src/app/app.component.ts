import { CommonModule } from '@angular/common';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { createGame } from '@pong/pong-model';
import { GameStatistics, GameStatsAttribute, GameStatsRecord } from 'pong-model/src/lib/types';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Component({
  standalone: true,
  imports: [RouterModule, CommonModule],
  selector: 'pong-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'pong-demo';
  @ViewChild('canvas', { static: true, read: ElementRef }) canvasEl: ElementRef | undefined;
  stats$ = new  BehaviorSubject<GameStatistics>({ attributes: [], records: [] });

  constructor(private zone: NgZone) {}

  ngOnInit(): void {
      const canvas = this.canvasEl?.nativeElement;
      if (!canvas) {
        throw Error('canvas element not defined');
      }
      this.zone.runOutsideAngular(() => {
        const stats$ = createGame({
            canvas,
            statsUpdateInterval$: new BehaviorSubject(60)
          }).stats$;
        stats$.subscribe(s => this.zone.run(() => this.stats$.next(s)));
      });
  }

  getKeys(record: GameStatsRecord): Array<string> {
    return Object.keys(record);
  }

}
