import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { Input } from '../input';

@Component({
  selector: 'app-input-form',
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.css']
})
export class InputFormComponent implements OnInit {
  keyword = new Input('');
  code : string = '';
  forcast : object = null; // data we get directly from the Weather Network API
  display = []; // data formatted to be displayed in the html
  weatherApi = null; // axios object used to send requests to Weather Network

  constructor() { }

  ngOnInit() {
    //init properties
    this.title = 'this app!';
    this.weatherApi = axios.create({
      baseURL : 'https://hackathon.pic.pelmorex.com/api'
    });
  }

  onSubmit(){
    this.sendCodeRequest();
  }

  sendCodeRequest(){
    //TODO: check that location is a valid keyword
    var self = this;
    this.weatherApi.get('/search/string', {
      params: {
    //    keyword: keyword.val.toLowerCase()
        keyword: 'ottawa'
      }
    }).then(function(response){
      //save the code
      self.code = response.data.code;
      self.sendWeatherRequest();
    });
  }

  sendWeatherRequest(){
    var self = this;
    this.weatherApi.get('/data/longterm', {
      params: {
        locationcode: self.code
      }
    }).then(function(response){
      self.forcast = response.data.data;
      self.formatForcast();
    });
  }

  formatForcast(){
    var f = this.forcast;
    //gather the data we need for the view
    for (var i = 0; i < f.length; i++){
      var data = '{' +
        '"date":"' + (f[i].time).substr(0,10) + '",' +
        '"rain":' + f[i].rain + ',' +
        '"snow":' + f[i].snow + ',' +
        '"day_FeelsLike":' + f[i].forecastArr[0].feelsLike + ',' +
        '"night_FeelsLike":' + f[i].forecastArr[1].feelsLike + ',' +
        '"day_WindGustSpeed":' + f[i].forecastArr[0].windGustSpeed + ',' +
        '"night_WindGustSpeed":' + f[i].forecastArr[1].windGustSpeed +
        '}';
        this.display.push(JSON.parse(data));
    }
    console.log(this.display);
  }

}
