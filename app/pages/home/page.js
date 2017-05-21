/* page.js -- home
Author: Erik Mudrak - Spring 2017 - Clustercast
Description: Implements home page of web app
*/

// Imports:
import React from 'react';
import { browserHistory } from 'react-router';
import styles from "./style.css";
import MediaQuery from 'react-responsive';
import DarkSkyApi from 'dark-sky-api';

import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import DropdownMenu from 'material-ui/DropdownMenu';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import DayIcon from 'material-ui/svg-icons/action/today';
import BikeIcon from 'material-ui/svg-icons/action/motorcycle';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';

import BurgerIcon from './single.png';
// import BurgerSVG from './burger.svg';

// const BurgerSVG = require('./burger.svg');

import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';

import {RadialBarChart, RadialBar, Legend, Bar, BarChart} from 'recharts';

const days = [
  {key: 0, name: 'Sunday', demand: 0},
  {key: 1, name: 'Monday', demand: 0},
  {key: 2, name: 'Tuesday', demand: 0},
  {key: 3, name: 'Wednesday', demand: 0},
  {key: 4, name: 'Thursday', demand: 0},
  {key: 5, name: 'Friday', demand: 0},
  {key: 6, name: 'Saturday', demand: 0},
];

const data = [
      {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
      {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
      {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
      {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
      {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
      {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
      {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
];

// Dark Sky API configuration for weather data: 
DarkSkyApi.apiKey = '6d0fac966fa45fd88bcb2234eb03d191';

// Locations
const downtownIndy = {
  latitude: 39.7776023, 
  longitude: -86.1555877
};

const bloomington = {
  latitude: 39.1709369, 
  longitude: -86.500373
};

const BurgerBar = React.createClass ({
  render () {
    return (
      <BarChart width={550} height={300} data={data}>
         <Bar dataKey='uv' fill='#8884d8' shape={<Icon />}/>
         <XAxis className={styles.xAxis} dataKey="name" />
         <YAxis />
       </BarChart>
    );
  }
})

/* ----------------------- HOME - MAIN COMPONENT ------------------------ */

export default class Home extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      cityValue: 1,
      isOpen: true,
      mainData: days,
      forecast: "empty",
      selectedDayIndex: 3,
      isRaining: false,
      isSnowing: false,
      isNiceWeather: false,
      temp: 70,
      weatherStatus: 'Sunny',
      isLastDay: false,
      week: "",
    };
  }

  // getWeek:
  /// Re-arranges data so that the current day is the first element in the week
  getWeek = (week) => {
    var d = new Date();
    let today = d.getDay();

    let dayIndex = 0;
    for (var i=0; i<week.length; i++) {
      if (week[i].key == today) dayIndex = i;
    }

    let newWeek = [];
    for (var i=dayIndex; i<week.length; i++) { newWeek.push(week[i]); }
    for (var j=0; j<dayIndex; j++) { newWeek.push(week[j]); }
    this.setState({mainData: newWeek});
  }


  // isLastDay:
  /// Determines if today is the last day of the month by checking if tomorrow is the the first day
  isLastDay = () => {
    var today = new Date();
    var tomorrow = new Date();

    tomorrow.setDate(today.getDate()+1);
    if (tomorrow.getDate() == 1) return true;
    else return false;
  }

  // getPrecip:
  /// Probability and type of precipitation are used to determine if snowing or raining
  getPrecip = (index, forecast) => {
    // DarkSky includes the previous day first in forecasts, increment to get the correct day
    index++;
    console.log("Day: " + index);
    let currentForecast = forecast.data[index];
    console.log(currentForecast);
    let prob = currentForecast.precipProbability;
    if (prob >= 0.25 && currentForecast.precipType == "rain") return "rain";
    else if (prob >= 0.25 && currentForecast.precipType == "snow") return "snow";
  } 

  // isNiceWeather
  /// Determines if it's a nice day based on precip. probability and the
  isNiceWeather = (index, forecast) => {
    // DarkSky includes the previous day first in forecasts, increment to get the correct day
    index++;
    let currentForecast = forecast.data[index];
    if (currentForecast.precipProbability < 0.25 && currentForecast.temperatureMin > 40) return 1;
    else return 0;
  }

  // getDemand:
  /// Calculates the demand for Clustertruck based on date and weather
  getDemand = (data, forecast) => {

    for (var i=0; i<data.length; i++) {
      let currentDay = data[i];
      // Adjust demand based on day of week, with corresp. keys
      if (currentDay.key == 0) currentDay.demand = 3; 
      if (currentDay.key == 1) currentDay.demand = 1;
      if (currentDay.key == 2) currentDay.demand = 2;
      if (currentDay.key == 3) currentDay.demand = 3;
      if (currentDay.key == 4) currentDay.demand = 4;
      if (currentDay.key == 5) currentDay.demand = 5;
      if (currentDay.key == 6) currentDay.demand = 3;
      
      // Adjust demand based on weather conditions
      if (this.getPrecip(i, forecast) == "rain") currentDay.demand += 4;
      if(this.getPrecip(i, forecast) == "snow") currentDay.demand += 5;
      if(this.isNiceWeather(i, forecast)) currentDay.demand -= 2;

      if(this.state.isLastDayOfMonth) currentDay.demand += 5;
      data[i] = currentDay;
    }
    this.setState({mainData: data});
  }

  // getForecast:
  /// Call Dark Sky API to get forecasted week
  /// Passes data straight to getDemand, setState was giving me hell
  getWeather = () => {
    DarkSkyApi.loadForecast(downtownIndy)
      .then( (result) => { console.log(result.daily); this.getDemand(this.state.mainData, result.daily); });
  }

  componentWillMount = () => {
    this.getWeek(this.state.mainData);
    this.getWeather();
  }

  handleDropdown = (event, index, value) => this.setState({cityValue: value}); 

  render() {
      return (
          <div className={styles.container}>
            <MenuBar city={this.state.cityValue} handleDropdown={this.handleDropdown}/>
            <div className={styles.header}>CLUSTERCAST</div>  
            <div className={styles.demandLabel}>Foresee your feast.</div>
            <AreaChart 
              className={styles.chart}
              width={800} 
              height={400} 
              data={this.state.mainData}
            >
              <defs>
                  <linearGradient id="colorCluster" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="25%" stopColor="#f25f23" stopOpacity={1}/>
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0.1}/>
                  </linearGradient>
              </defs>
              <XAxis className={styles.xAxis} dataKey="name" />
              <YAxis domain={[-1, 15]} />
              <Tooltip/>
              <Area type='monotone' dataKey='demand' stroke='red' fill='url(#colorCluster)' dot={true} activeDot={{r: 8}}/>
            </AreaChart>


          </div>
      );
  }
}

class MenuBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.menuBar}>
      <img className={styles.logo} src="../../assets/logo.png" />
      <DropdownMenu 
        className={styles.citySelector} 
        value={this.props.city} 
        onChange={this.props.handleDropdown}
        labelStyle={{color: 'white', fontSize: '1.5em'}}
        underlineStyle={{borderColor: '#f25f23'}}
        menuItemStyle={{fontSize: '1.25em'}}
        selectedMenuItemStyle={{color: '#f25f23'}}
        >
        <MenuItem value={1} primaryText="Downtown Indy" />
        <MenuItem value={2} primaryText="Bloomington" />
      </DropdownMenu>
      </div>
    );
  }
}

class DemandStatus extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.progressLabel}>
        <ProgressLabel 
           className={styles.progressLabel}
           progress={this.state.demand}
           startDegree={180}
           progressWidth={60}
           trackWidth={60}
           cornersWidth={30}
           size={400}
           fillColor="black"
           trackColor="lightgray"
           progressColor="##f25f23"
         >
          <text x="200" y="225" className={styles.demandLevelLabel}>{this.getDemandLevel()}</text>
        </ProgressLabel>
      </div>
    );
  }
}

