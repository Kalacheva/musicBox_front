import {Component, Inject, OnInit} from '@angular/core';
import {environment} from "../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  private readonly REQUEST_URL_GENRES = `${environment.serverUrl}/genre`;
  private readonly REQUEST_URL_ARTISTS = `${environment.serverUrl}/artist`;
  private readonly REQUEST_URL_ALBUMS = `${environment.serverUrl}/album`;
  public readonly REQUEST_URL_SONGS = `${environment.serverUrl}/song`;
  genres:any;
  artists:any;
  albums:any;
  songs:any;
  isEditMode = false;
  idArtist:number;
  idGenre:number;

  constructor(private http:HttpClient, public dialog: MatDialog){}

  ngOnInit(): void {
    this.http.get(this.REQUEST_URL_GENRES)
      .subscribe((response)=>{
        this.genres=response;
      })
  }
  //работает только при условии если айдиЖанра совпадает с индексом вкладки +1 (см.вызов)
  getArtists(idGenre:number){
    this.http.get(this.REQUEST_URL_ARTISTS+'/byGenre/'+idGenre)
      .subscribe((response)=>{
        this.artists=response;
        this.idGenre=idGenre;
        console.log(response);
      })
  }

  getAlbums(idArtist: number) {
    this.http.get(this.REQUEST_URL_ALBUMS+'/byArtist/'+idArtist)
      .subscribe((response)=>{
        this.albums=response;
        this.idArtist=idArtist;
        console.log(response);
      })
  }

  getSongs(idAlbum: number) {
    this.http.get(this.REQUEST_URL_SONGS+'/byAlbum/'+idAlbum)
      .subscribe((response)=>{
        this.songs=response;
        console.log('???'+response);///??????
      })
  }

  openDialog(idAlbum: number): void {
    this.getSongs(idAlbum);
    console.log('!!!'+this.songs);
    this.dialog.open(SongsDialog, {
      width: '300px',
      maxHeight: '500px',
      data: {
        songs: this.songs,
        isEditMode:this.isEditMode,
        idAlbum:idAlbum
      }
    });
  }

  deleteAlbum(idAlbum: number) {
    this.http.delete(this.REQUEST_URL_ALBUMS+'/'+idAlbum)
      .subscribe(()=>{
        this.getAlbums(this.idArtist);
      });
    console.log('delete album with id='+idAlbum);
  }

  saveAlbum(nameAlbum: string) {
    let params = new HttpParams()
      .append("nameAlbum",nameAlbum)
      .append("idArtist", String(this.idArtist));
    this.http.post(this.REQUEST_URL_ALBUMS,null,{params: params})
      .subscribe(()=>{
        this.getAlbums(this.idArtist);
      });
    console.log('add album '+nameAlbum+' in artist with id='+this.idArtist);
  }

  deleteArtist(idArtist: number) {
    this.http.delete(this.REQUEST_URL_ARTISTS+'/'+idArtist)
      .subscribe(()=>{
        this.getArtists(this.idGenre);
      });
    console.log('delete artist with id='+idArtist);
  }

  saveArtist(nameArtist: string) {
    let params = new HttpParams()
      .append("nameArtist",nameArtist)
      .append("idGenre", String(this.idGenre));
    this.http.post(this.REQUEST_URL_ARTISTS,null,{params: params})
      .subscribe(()=>{
        this.getArtists(this.idGenre);
      });
    console.log('add artist '+nameArtist+' in genre with id='+this.idGenre);
  }
}

@Component({
  selector: 'app-songs-dialog',
  templateUrl: './app.songs.dialog.html',
  styleUrls: ['./app.component.css']
})
export class SongsDialog {
  public readonly REQUEST_URL_SONGS = `${environment.serverUrl}/song`;

  constructor(private http:HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  deleteSong(idSong: number) {
    this.http.delete(this.REQUEST_URL_SONGS+'/'+idSong).subscribe();
    console.log('delete song with id='+idSong);
  }

  saveSong(nameSong: string) {
    let params = new HttpParams()
      .append("nameSong",nameSong)
      .append("idAlbum", String(this.data.idAlbum));
    this.http.post(this.REQUEST_URL_SONGS,null,{params: params}).subscribe();
    console.log('add song '+nameSong+' in album with id='+this.data.idAlbum);
  }
}

export interface DialogData {
  songs: string[];
  isEditMode:boolean;
  idAlbum:number;
}
