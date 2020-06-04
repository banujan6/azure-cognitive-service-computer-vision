import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild('uploadFile', { static: true }) uploadFile: ElementRef;

  title = 'azure-vision';
  imageRawString: string = null;
  isAnalysing = false;
  image = {
    fixedWidth: 700,
    ratio: 0
  }
  objects = [];

  constructor(private http: HttpClient){}

  openImageBrowseDialog() {
    this.uploadFile.nativeElement.click();
  }

  readImage(imageInput) {

    if (imageInput.files.length === 0) {
      return;
    }

    this.isAnalysing = true;
    this.objects = [];

    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      this.imageRawString = event.target.result;
    });

    reader.readAsDataURL(file);
    this.analyseImage(file);
  }

  analyseImage(imageBinary) {
    
    this.http.post(environment["Api-EndPoint"], imageBinary, { 
      headers: {
        'Ocp-Apim-Subscription-Key': environment["Ocp-Apim-Subscription-Key"],
        'Content-Type': 'application/octet-stream'
      }
    }).subscribe( res => {
      this.image.ratio = res['metadata']['width'] / this.image.fixedWidth;
      this.objects = res['objects'];
      this.isAnalysing = false;
    })


  }

}
