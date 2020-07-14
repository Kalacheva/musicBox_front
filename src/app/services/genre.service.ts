import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Injectable} from "@angular/core";

@Injectable()
export class GenreService{
  private readonly REQUEST_URL = `${environment.serverUrl}/genre`;

  response:any;
  genres:Genre[];
  constructor(private http:HttpClient){}

  getAllGenres(){
    this.http.get(this.REQUEST_URL)
      .subscribe((response)=>{
        this.response=response;
        console.log(this.response);
    })
  }
}
interface Genre{
  id:number,
  name:string
}

