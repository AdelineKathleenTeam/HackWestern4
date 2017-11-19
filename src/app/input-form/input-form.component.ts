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
  toBringList = new Set();
  // display = []; // data formatted to be displayed in the html
  weatherApi = null; // axios object used to send requests to Weather Network

  constructor() { }

  ngOnInit() {
    //init properties
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
        keyword: self.keyword.val.toLowerCase() //TODO: find a safer way to do this!!!!!
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
      // self.formatForcast();
      self.generateList();
      self.showData();
    });
  }

  // formatForcast(){
  //   var f = this.forcast;
  //   //gather the data we need for the view
  //   for (var i = 0; i < f.length; i++){
  //     var data = '{' +
  //       '"date":"' + (f[i].time).substr(0,10) + '",' +
  //       '"rain":' + f[i].rain + ',' +
  //       '"snow":' + f[i].snow + ',' +
  //       '"day_FeelsLike":' + f[i].forecastArr[0].feelsLike + ',' +
  //       '"night_FeelsLike":' + f[i].forecastArr[1].feelsLike + ',' +
  //       '}';
  //       this.display.push(JSON.parse(data));
  //   }
  //   console.log(this.display);
  // }

  generateList(){
    var f = this.forcast;
    this.toBringList.clear(); //clear the to-bring list
    for (var i = 0; i < 5; i++){
      // is it raining?
      if (f[i].rain > 0.1){
        this.toBringList.add('Rain Boots');
        this.toBringList.add('Umbrella');
      }

      // is it snowing?
      if (f[i].snow > 0.1){
          this.toBringList.add('Boots');
      }

      var min = Math.min(f[i].forecastArr[0].feelsLike, f[i].forecastArr[1].feelsLike);
      var max = Math.max(f[i].forecastArr[0].feelsLike, f[i].forecastArr[1].feelsLike);
      if (min > 2 && max < 15){
        this.toBringList.add('Light Coat');
      } else if (max <= 2) {
        this.toBringList.add('Toque or Scarf');
        this.toBringList.add('Heavy Coat');
        this.toBringList.add('Boots');
      }

      //is it warm sunny?
      if (f[i].sun_hours >= 5 && min > 10) {
        this.toBringList.add('Sunscreen');
        this.toBringList.add('Hat');
      }
    }
  }

  showData(){
    var f = this.forcast;
    var emailList = '\n';
    var emailForcastList = '\n';
    var list = document.getElementById('to_bring_list');
    list.innerHTML = "";
    this.toBringList.forEach(function(val1, val2, set) {
      var node = document.createElement('li');
      node.appendChild(document.createTextNode(val1));
      list.appendChild(node);
      emailList += '- ' + val1 + '\n';
    });

    var forcastList = document.getElementById('forcast_list');
    forcastList.innerHTML = "";
    for (var i = 0; i < 5; i++){
      var li = document.createElement('li');
      var ul = document.createElement('ul');
      var li2 = document.createElement('li');
      var li3 = document.createElement('li');
      var card = document.getElementById('day_' + i);
      var cardTitle = document.createElement('h4');
      var cardSubtitle = document.createElement('h2');
      var cardText = document.createElement('p');
      var cardIcon = document.createElement('i');
      var cardIcon2 = document.createElement('i');
      card.innerHTML = "";
      cardIcon.className = "material-icons md-48";
      cardIcon2.className = "material-icons md-48";
      cardIcon.innerHTML = "invert_colors";
      cardIcon2.innerHTML = "";
      var s = f[i].forecastArr[1].feelsLike + '° / ' + f[i].forecastArr[0].feelsLike + '°';
      var t = '';
      if (f[i].snow > 0.1 && f[i].rain > 0.1){
        t += 'rain & snow';
        console.log('here');
        cardIcon.className += " text-primary";
        cardIcon2.className += " text-info";
        cardIcon2.innerHTML = "ac_unit";
      } else if (f[i].rain > 0.1){
        t += 'rain';
        cardIcon.className += " text-primary";
      } else if (f[i].snow > 0.1){
        t += 'snow';
        cardIcon.innerHTML = "ac_unit";
        cardIcon.className += " text-info";
      } else if (f[i].sun_hours < 4){
        t += 'cloudy';
        cardIcon.innerHTML = "cloud";
        cardIcon.className += " text-secondary";
      } else {
        t += 'clear day';
        cardIcon.innerHTML = "wb_sunny";
        cardIcon.className += " text-warning";
      }
      li2.appendChild(document.createTextNode(s));
      li3.appendChild(document.createTextNode(t));
      ul.appendChild(li2);
      ul.appendChild(li3);
      li.appendChild(document.createTextNode((f[i].time).substr(0,10)));
      li.appendChild(ul);
      forcastList.appendChild(li);
      emailForcastList += '- ' + (f[i].time).substr(0,10) + '\n';
      emailForcastList += '    * ' + s + '\n';
      emailForcastList += '    * ' + t + '\n';

      cardTitle.className = 'card-title text-muted';
      cardSubtitle.className = 'card-subtitle text-success';
      cardText.className = 'card-text text-center';
      cardTitle.innerHTML = (f[i].time).substr(0,10);
      cardSubtitle.innerHTML = s;

      cardText.appendChild(cardIcon);
      cardText.appendChild(cardIcon2);

      card.appendChild(cardTitle);
      card.appendChild(cardSubtitle);
      card.appendChild(cardText);
    }
    var forcastFormInput = document.getElementById('forcast_form_input');
    var toBringFormInput = document.getElementById('to_bring_form_input');
    forcastFormInput.innerHTML = emailForcastList;
    toBringFormInput.innerHTML =  emailList;

    var results = document.getElementById('results');
    results.style.display = 'block';
  }

}
