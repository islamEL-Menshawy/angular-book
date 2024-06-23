import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common'
import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core'
import { FlexModule } from '@ngbracket/ngx-layout/flex'

import { ICurrentWeather } from '../interfaces'
import { WeatherService } from '../weather/weather.service'
import { Observable, Subscription } from 'rxjs'

@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.css'],
  standalone: true,
  imports: [FlexModule, DecimalPipe, DatePipe, AsyncPipe],
})
export class CurrentWeatherComponent implements OnInit, OnDestroy {
  current$: Observable<ICurrentWeather>
  constructor(private weatherService: WeatherService) {
    this.current$ = this.weatherService.currentWeather$;
  }


  // currentWeatherSubscription: Subscription;
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    // this.currentWeatherSubscription = this.weatherService.currentWeather$.subscribe(data => {
    //   this.current = data;
    // });
  }

  ngOnDestroy(): void {
    // this.currentWeatherSubscription.unsubscribe();
  }

  getOrdinal(date: number) {
    const n = new Date(date).getDate()
    return n > 0
      ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10]
      : ''
  }
}
