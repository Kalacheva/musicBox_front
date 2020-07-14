import { Component, OnInit } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  private readonly REQUEST_URL = `${environment.serverUrl}/genre`;

  response:any;

  constructor(private http:HttpClient){}

  ngOnInit(): void {
    this.http.get(this.REQUEST_URL)
      .subscribe((response)=>{
        this.response=response;
        console.log(this.response);
      })
  }
}
