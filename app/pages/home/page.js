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
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';

import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';

import {RadialBarChart, RadialBar, Legend} from 'recharts';

// Dark Sky API configuration for weather data: 
DarkSkyApi.apiKey = '6d0fac966fa45fd88bcb2234eb03d191';

const downtownIndy = {
  latitude: 39.7776023, 
  longitude: -86.1555877
};

const bloomington = {
  latitude: 39.1709369, 
  longitude: -86.500373
};

// Current weather:
// DarkSkyApi.loadCurrent(downtownIndy)
//   .then(result => console.log(result));

// Forecasted week:
// DarkSkyApi.extendHourly(true);
// DarkSkyApi.loadForecast(downtownIndy)
//   .then(result => console.log(result));


DarkSkyApi.loadItAll('minutely,alerts,flags', downtownIndy) // just return daily and hourly
  .then(result => console.log(result));

  DarkSkyApi.extendHourly(true);

const days = [
  {key: 0, name: 'Sunday'},
  {key: 1, name: 'Monday'},
  {key: 2, name: 'Tuesday'},
  {key: 3, name: 'Wednesday'},
  {key: 4, name: 'Thursday'},
  {key: 5, name: 'Friday'},
  {key: 6, name: 'Saturday'},
];

const monToThursData = [
      {time: '8:00 AM', demand: 0},
      {time: '9:00 AM', demand: 0},
      {time: '10:00 AM', demand: 0},
      {time: '11:00 AM', demand: 0},
      {time: '12:00 PM', demand: 0},
      {time: '1:00 PM', demand: 0},
      {time: '2:00 PM', demand: 0},      
      {time: '3:00 PM', demand: 0},
      {time: '4:00 PM', demand: 0},
      {time: '5:00 PM', demand: 0},
      {time: '6:00 PM', demand: 0},
      {time: '7:00 PM', demand: 0},
      {time: '8:00 PM', demand: 0},
      {time: '9:00 PM', demand: 0},
      {time: '10:00 PM', demand: 0},
];

const fridayData = [
      {time: '8:00 AM', demand: 0},
      {time: '9:00 AM', demand: 0},
      {time: '10:00 AM', demand: 0},
      {time: '11:00 AM', demand: 0},
      {time: '12:00 PM', demand: 0},
      {time: '1:00 PM', demand: 0},
      {time: '2:00 PM', demand: 0},      
      {time: '3:00 PM', demand: 0},
      {time: '4:00 PM', demand: 0},
      {time: '5:00 PM', demand: 0},
      {time: '6:00 PM', demand: 0},
      {time: '7:00 PM', demand: 0},
      {time: '8:00 PM', demand: 0},
      {time: '9:00 PM', demand: 0},
      {time: '10:00 PM', demand: 0},
      {time: '11:00 PM', demand: 0},
];

const saturdayData = [
      {time: '9:00 AM', demand: 0},
      {time: '10:00 AM', demand: 0},
      {time: '11:00 AM', demand: 0},
      {time: '12:00 PM', demand: 0},
      {time: '1:00 PM', demand: 0},
      {time: '2:00 PM', demand: 0},      
      {time: '3:00 PM', demand: 0},
      {time: '4:00 PM', demand: 0},
      {time: '5:00 PM', demand: 0},
      {time: '6:00 PM', demand: 0},
      {time: '7:00 PM', demand: 0},
      {time: '8:00 PM', demand: 0},
      {time: '9:00 PM', demand: 0},
      {time: '10:00 PM', demand: 0},
      {time: '11:00 PM', demand: 0},
];

const sundayData = [
      {time: '9:00 AM', demand: 0},
      {time: '10:00 AM', demand: 0},
      {time: '11:00 AM', demand: 0},
      {time: '12:00 PM', demand: 0},
      {time: '1:00 PM', demand: 0},
      {time: '2:00 PM', demand: 0},      
      {time: '3:00 PM', demand: 0},
      {time: '4:00 PM', demand: 0},
      {time: '5:00 PM', demand: 0},
      {time: '6:00 PM', demand: 0},
      {time: '7:00 PM', demand: 0},
      {time: '8:00 PM', demand: 0},
      {time: '9:00 PM', demand: 0},
];

export default class Home extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      cityValue: 1,
      demand: 70,
      isOpen: true,
      selectedData: monToThursData,
      selectedDayIndex: 3,
      selectedDay: 'Wednesday',
      isRaining: false,
      isSnowing: false,
      isNiceWeather: false,
      temp: 70,
      weatherStatus: 'Sunny',
      isLastDay: false,
    };
  }

  getDayName = () => {
    var currentDate = new Date();
    console.log("Date is:" + currentDate);
    var currentDay = currentDate.getDay();
    this.setState({selectedDayIndex: currentDay});
    for (var i=0; i<days.length; i++) {
      if (days[i].key == currentDay) this.setState({selectedDay: days[i].name});
    }
  }

  // getDefaultData = (index) => {
  //   if (index == 0) return sundayData;
  //   if (index > 0 && index < 5) return monToThursData;
  //   if (index == 5) return fridayData;
  //   if (index == 6) return saturdayData;
  // }

  select = (index) => this.setState({selectedDayIndex: index});

  isRaining = (index) => {
    // Call Darksky API 
  } 

  getDemand = (data, index) => {

    for (var i=0; i<data.length; i++) {
      // Adjust demand based on day of week, with corresp. indices
      if (index == 0) data[i].demand = 3;
      if (index == 1) data[i].demand = 1;
      if (index == 2) data[i].demand = 2;
      if (index == 3) data[i].demand = 3;
      if (index == 4) data[i].demand = 4;
      if (index == 5) data[i].demand = 5;
      if (index == 6) data[i].demand = 3;
      
      // Adjust demand based on weather conditions
      if(this.state.isRaining) data[i].demand += 4;
      if(this.state.isSnowing) data[i].demand += 5;
      if(this.state.isNiceWeather) data[i].demand -= 2;

      if(this.state.isLastDayOfMonth) data[i].demand += 5;

      this.setState({selectedData: data});
    }
  }

  componentWillMount = () => {
    // this.getDayName();
    this.getDemand(this.state.selectedData, this.state.selectedDayIndex);
  }

  handleDropdown = (event, index, value) => this.setState({cityValue: value}); 

  // Calculates 3 discrete levels of demand: low, mid, high
  getDemandLevel = () => {
    if (this.state.demand < 33) return "Low";
    if (this.state.demand >= 33 && this.state.demand < 66) return "Mid";
    if (this.state.demand >= 66) return "High";
  }

  render() {
      return (
          <div className={styles.container}>
            <MenuBar city={this.state.cityValue} handleDropdown={this.handleDropdown}/>
            <div className={styles.header}>CLUSTERCAST</div>  
            <div className={styles.demandLabel}>How busy are we?</div>
            <Forecast />
            <AreaChart 
              className={styles.chart}
              width={800} 
              height={400} 
              data={this.state.selectedData}
            >
              <defs>
                  <linearGradient id="colorCluster" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="25%" stopColor="#c32520" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                  </linearGradient>
              </defs>
              <XAxis className={styles.xAxis} dataKey="time" />
              <YAxis/>
              <CartesianGrid strokeDasharray="3 3"/>
              <Tooltip/>
              <Area type='monotone' dataKey='demand' stroke='red' fill='url(#colorCluster)' dot={true} />
            </AreaChart>

            <Paper className={styles.daySelectorContainer}>
              <BottomNavigation selectedIndex={this.state.selectedDayIndex}>
                <BottomNavigationItem 
                  label="Sunday"
                  icon={<DayIcon />}
                  onTouchTap={() => {this.select(0); this.getDemand(sundayData, 0)}}
                />
                <BottomNavigationItem 
                  label="Monday"
                  icon={<DayIcon />}
                  onTouchTap={() => {this.select(1); this.getDemand(monToThursData, 1)}}
                />
                <BottomNavigationItem 
                  label="Tuesday"
                  icon={<DayIcon />}
                  onTouchTap={() => {this.select(2); this.getDemand(monToThursData, 2)}}
                />
                <BottomNavigationItem 
                  label="Wednesday"
                  icon={<DayIcon />}
                  onTouchTap={() => {this.select(3); this.getDemand(monToThursData, 3)}}
                />
                <BottomNavigationItem 
                  label="Thursday"
                  icon={<DayIcon />}
                  onTouchTap={() => {this.select(4); this.getDemand(monToThursData, 4)}}
                />
                <BottomNavigationItem 
                  label="Friday"
                  icon={<DayIcon />}
                  onTouchTap={() => {this.select(5); this.getDemand(fridayData, 5)}}
                />
                <BottomNavigationItem 
                  label="Saturday"
                  icon={<DayIcon />}
                  onTouchTap={() => {this.select(6); this.getDemand(saturdayData, 6)}}
                />
              </BottomNavigation>
            </Paper>
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
        underlineStyle={{borderColor: 'red'}}
        menuItemStyle={{fontSize: '1.25em'}}
        selectedMenuItemStyle={{color: 'red'}}
        >
        <MenuItem value={1} primaryText="Downtown Indy" />
        <MenuItem value={2} primaryText="Bloomington" />
      </DropdownMenu>
      </div>
    );
  }
}

class Forecast extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isNiceWeather: true,
      isRaining: false,
      isSnowing: false,
      temp: 68,
      weatherStatus: 'Sunny',
    };
  }

  render() {
    return (
      <div className={styles.forecastContainer}>
        {/* <div className={styles.forecast}>

        </div>
        <HourMarks />
        <HourLabels /> */}
      </div>
    );
  }
}

class HourMarks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <div className={styles.hourMarkContainer}>
        <span className={styles.hourMark}></span>
        <span className={styles.hourMark}></span>
        <span className={styles.hourMark}></span>
        <span className={styles.hourMark}></span>
        <span className={styles.hourMark}></span>
        <span className={styles.hourMark}></span>
        <span className={styles.hourMark}></span>
        <span className={styles.hourMark}></span>
        <span className={styles.hourMark}></span>
        <span className={styles.hourMark}></span>
        <span className={styles.hourMark}></span>
        <span className={styles.hourMark}></span>
      </div>
    );
  }
}

class HourLabels extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <div className={styles.hourLabelContainer}>
        <span className={styles.hourLabel}></span>
        <span className={styles.hourLabel}></span>
        <span className={styles.hourLabel}></span>
        <span className={styles.hourLabel}></span>
        <span className={styles.hourLabel}></span>
        <span className={styles.hourLabel}></span>
        <span className={styles.hourLabel}></span>
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

      <PieChart
        className={styles.chart} 
        data={[
          { value: 10, key: 1, color: '#E38627' },
          { value: 15, key: 2, color: '#C13C37' },
          { value: 20, key: 3, color: '#6A2135' },
        ]}
      />
        <ProgressLabel 
           className={styles.progressLabel}
           progress={this.state.demand}
           startDegree={180}
           progressWidth={60}
           trackWidth={60}
           cornersWidth={30}
           size={400}
           fillColor="black"
           trackColor="#ff9090"
           progressColor="#c32520"
         >
          <text x="200" y="225" className={styles.demandLevelLabel}>{this.getDemandLevel()}</text>
        </ProgressLabel>
      </div>
    );
  }
}

