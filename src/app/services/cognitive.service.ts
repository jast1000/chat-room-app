import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CognitiveService {

  constructor(
    private http: HttpClient
  ) { }

  analyzeImage(image: any) {
    const url = `${ environment.cognitiveAPI }/vision/v2.0/analyze?visualFeatures=Adult,Brands,Categories,Tags,Faces&details=Celebrities&language=es`;
    const headers = {
      "Ocp-Apim-Subscription-Key": environment.cognitiveApiKey,
      "Content-Type": "application/octet-stream"
    }
    const file = new File([image], "image.jpeg", { type: "image/jpeg", lastModified: Date.now() });
    return this.http.post(url, file, { headers }).toPromise();
  }

}
