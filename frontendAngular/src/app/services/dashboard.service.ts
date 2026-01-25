// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root',
// })
// export class Dashboard {
  
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DashboardService {

  private readonly API_URL = 'http://localhost:5000/api/insights';

  constructor(private http: HttpClient) {}

  // getInsights(): Observable<any[]> {
  //   return this.http.get<any[]>(this.API_URL);
  // }

  getInsights(page: number, limit: number, filters: any) {
  return this.http.get<{
    data: any[];
    totalCount: number;
  }>(
    this.API_URL,
    {
      params: {
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      }
    }
  );
}

getFilters() {
  return this.http.get<any>(
    `${this.API_URL}/filters`
  );
}


}
