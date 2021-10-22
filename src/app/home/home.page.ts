import { Component } from '@angular/core';
import { PhotoService } from '../photo.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  private data : any = [];
  private lista_imagens : any[];

  constructor(public fotoService: PhotoService) {}

  ngOnInit() {
    this.data = this.fotoService.getImages();
    this.lista_imagens = [];
    this.data.forEach(data => {
      const lista = data as Array<any>;
      lista.forEach(img => {
        let nome = img.data.nome;
        let url = img.data.downloadURL;
        this.lista_imagens.push({nome: nome, url: url});
      });
    })
  }

  uploadFile(event : FileList){
    this.fotoService.uploadToStorage(event);
  }

}
