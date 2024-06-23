import { Component, OnInit } from '@angular/core'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatIcon } from '@angular/material/icon'
import { WeatherService } from '../weather/weather.service'
import { debounceTime, filter, tap } from 'rxjs'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Component({
  selector: 'app-city-search',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,

  ],
  templateUrl: './city-search.component.html',
  styleUrl: './city-search.component.css'
})
export class CitySearchComponent implements OnInit{
   public search: FormControl = new FormControl('', [Validators.minLength(2)]);

   constructor(
     private weatherService: WeatherService,
   ) {
   }

    ngOnInit(): void {
      this.search.valueChanges.pipe(
        takeUntilDestroyed(),
        filter(()=> this.search.valid),
        tap((searchValue: string) => this.doSearch(searchValue)),
        debounceTime(1000)
      ).subscribe(
        (searchValue: string) => {
          if (!this.search.invalid){
            if (searchValue){
              const userInput = searchValue.split(',').map(s => s.trim());
              this.weatherService.updateCurrentWeather(
                userInput[0],
                userInput.length > 1 ? userInput[1] : undefined
              );
            }
          }
        }
      );
    }

  doSearch(searchValue: string) {
    const userInput = searchValue.split(',').map(s => s.trim())
    const searchText = userInput[0]
    const country = userInput.length > 1 ? userInput[1] : undefined
    this.weatherService.updateCurrentWeather(searchText, country)
  }

}
