import { Injectable } from '@angular/core';
import { CompanyForm } from './companyForm';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { CompanyData } from './companyData';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
const BACKEND_URL = environment.apiUrl + '/mentions/';
@Injectable({
  providedIn: 'root',
})
export class CompanyDataService {
  constructor(private http: HttpClient) {}

  private dataSource = new BehaviorSubject<CompanyData>({
    price: [],
    mentions: [],
    dates: [],
  });
  companyData = this.dataSource.asObservable();

  updateData(companyData: CompanyData) {
    this.dataSource.next(companyData[0]);
  }

  getData(companyForm): Observable<CompanyData> {
    const queryParams = `monthly/${companyForm.company}`;
    console.log('Getting Data: ', BACKEND_URL + queryParams);
    return this.http.get<CompanyData>(BACKEND_URL + queryParams).pipe(
      tap((_) => console.log('fetched data')),
      catchError(
        this.handleError<CompanyData>('getHeroes', {
          price: [],
          mentions: [],
          dates: [],
        })
      )
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
