import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseHttpService } from './base-http.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseHttpService{
  constructor (protected override http: HttpClient) { 
    super(http, '/api/user')
   }
}
