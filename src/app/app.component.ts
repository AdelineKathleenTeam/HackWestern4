import { Component } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title : string = 'this app';
  code : string = 'CAON0512'; //default is Ottawa
  keyword : string = 'Ottawa';
  weatherApi = null;

  ngOnInit() {
    //init properties
    this.title = 'this app!';
    this.weatherApi = axios.create({
      baseURL : 'https://hackathon.pic.pelmorex.com/api'
    });
    this.sendWeatherRequest();
  }

  receiveWeatherResponse(response){
    this.code = response.data.code;
    console.log('Receieved weather data for: ' + response.data.adLocation + '!\n');
    console.log(response);
  }

  sendWeatherRequest(/*location : string*/){
    //TODO: check that location is a valid keyword
    var self = this;
    console.log('Requested weather data for: ' + 'Ottawa' + '...');
    this.weatherApi.get('/search/string', {
      params: {
        keyword: 'Ottawa'
        //response type is json by default
      }
    }).then(function(response){
      self.receiveWeatherResponse(response);
    });
  }
}
