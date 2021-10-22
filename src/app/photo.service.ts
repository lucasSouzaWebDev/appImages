import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

export interface FotoDados{
  nome: string;
  downloadURL: string;
}

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  tarefa: AngularFireUploadTask;
  uploadFileURL : Observable<string>;
  filename : string;

  constructor(
    private st : AngularFireStorage,
    private db : AngularFireDatabase
  ){

  }

  uploadToStorage(image: FileList){
    const file = image.item(0);
    this.filename = file.name;
    const path = `images/_${file.name}`;
    const fileRef = this.st.ref(path);
    this.tarefa = this.st.upload(path, file);
    this.tarefa.snapshotChanges().pipe(
      finalize(() => {
        this.uploadFileURL = fileRef.getDownloadURL();
        this.uploadFileURL.subscribe((response) => {
          this.uploadToDatabase({
            nome: file.name,
            downloadURL: response
          });
        });
      })
    ).subscribe();
  }

  uploadToDatabase(image : FotoDados){
    return this.db.database.ref('images/').push(image);
  }

  getImages(){
    return this.db.list('images/').snapshotChanges().pipe(
      map((action) => {
        return action.map((dados) => ({
         key: dados.payload.key,
         data: dados.payload.val()
        }))
      })
    );
  }
}
