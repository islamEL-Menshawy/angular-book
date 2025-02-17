import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, first, Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { environment } from '../../environments/environment'
import { ICurrentWeather } from '../interfaces'

interface ICurrentWeatherData {
  weather: [
    {
      description: string
      icon: string
    },
  ]
  main: {
    temp: number
  }
  sys: {
    country: string
  }
  dt: number
  name: string
}

// export interface IWeatherService {
//   getCurrentWeather(city: string, country: string): Observable<ICurrentWeather>;
//   updateCurrentWeather(city: string, country: string): void;
//   getCurrentWeatherByCoords(coords: GeolocationCoordinates): Observable<ICurrentWeather>;
//   readonly currentWeather$: BehaviorSubject<ICurrentWeather>;
// }

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  constructor(private httpClient: HttpClient) {}


  currentWeather$: BehaviorSubject<ICurrentWeather>
    =
    new BehaviorSubject<ICurrentWeather>({
      city: '--',
      country: '--',
      date: Date.now(),
      image: '',
      temperature: 0,
      description: '',
    });


  getCurrentWeather(
    search: string | number,
    country: string | undefined): Observable<ICurrentWeather> {
    let uriParams = new HttpParams();
      if (typeof(search) === 'string') {
        uriParams = uriParams.set('q', country ? `${search},${country}` : search);
      }else {
        uriParams = uriParams.set('zip', search);
      }
        uriParams = uriParams.set('appid', environment.appId);

    return this.getCurrentWeatherHelper(uriParams);
  }

  updateCurrentWeather(search: string | number,
                       country: string | undefined): void {
    this.getCurrentWeather(search, country).pipe(first()).subscribe(data => {
      this.currentWeather$.next(data)
    })
  }


  private getCurrentWeatherHelper(uriParams: HttpParams):
    Observable<ICurrentWeather> {
    uriParams = uriParams.set('appid', environment.appId);

    return this.httpClient
      .get<ICurrentWeatherData>(
        `${environment.baseUrl}api.openweathermap.org/data/2.5/weather`,
        { params: uriParams }
      )
      .pipe(map(
        data => this.transformToICurrentWeather(data)))
  }

  getCurrentWeatherByCoords(coords: GeolocationCoordinates): Observable<ICurrentWeather>{
    let uriParams = new HttpParams()
      .set('lat', coords.latitude.toString())
      .set('lon', coords.longitude.toString());
    return this.getCurrentWeatherHelper(uriParams);

  }

  private transformToICurrentWeather(data: ICurrentWeatherData): ICurrentWeather {
    return {
      city: data.name,
      country: data.sys.country,
      date: data.dt * 1000,
      image: `http://openweathermap.org/img/w/${data.weather[0].icon}.png`,
      temperature: this.convertKelvinToFahrenheit(data.main.temp),
      description: data.weather[0].description,
    }
  }

  private convertKelvinToFahrenheit(kelvin: number): number {
    return (kelvin * 9) / 5 - 459.67
  }
}
