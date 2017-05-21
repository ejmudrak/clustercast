/* page.js -- home
Author: Erik Mudrak - Spring 2017 - Clustercast
Description: Implements home page of web app
*/

// Main Imports:
import React from 'react';
import { browserHistory } from 'react-router';
import styles from "./style.css";
import MediaQuery from 'react-responsive';
import DarkSkyApi from 'dark-sky-api';
import ProgressLabel from 'react-progress-label'

// Material UI Component imports:
import RaisedButton from 'material-ui/RaisedButton';
import DropdownMenu from 'material-ui/DropdownMenu';
import MenuItem from 'material-ui/MenuItem';

// Icon imports:
import BurgerIcon from './single.png';

// Recharts imports:
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine} from 'recharts';

const days = [
  {key: 0, name: 'Sun', demand: 0, label: ""},
  {key: 1, name: 'Mon', demand: 0, label: ""},
  {key: 2, name: 'Tues', demand: 0, label: ""},
  {key: 3, name: 'Wed', demand: 0, label: ""},
  {key: 4, name: 'Thurs', demand: 0, label: ""},
  {key: 5, name: 'Fri', demand: 0, label: ""},
  {key: 6, name: 'Sat', demand: 0, label: ""},
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

/* ----------------------- HOME - MAIN COMPONENT ------------------------ */

export default class Home extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      cityValue: 1,
      isOpen: true,
      mainData: days,
      forecast: "",
      selectedDayIndex: 3,
      location: downtownIndy,
      locLink: 'https://downtown-indy.clustertruck.com/menu',
    };
  }

  /* ------------ CLASS FUNCTIONS ---------- */


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

  // getForecast:
  /// Call Dark Sky API to get forecasted week
  /// Passes data straight to getDemand, setState was giving me hell
  getWeather = (location) => {
    DarkSkyApi.loadForecast(location)
      .then( (result) => { console.log(result.daily); this.getDemand(this.state.mainData, result.daily); });
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
    let currentForecast = forecast.data[index];
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

  // demandConverter:
  /// Takes integer values of demand and converts them into discrete labels
  demandConverter = (data) => {
    for (var i=0; i<data.length; i++) {
      if (data[i].demand <= 15 && data[i].demand > 11) data[i].label = "Very Busy";
      if (data[i].demand <= 11 && data[i].demand > 7) data[i].label = "Pretty Busy";
      if (data[i].demand <= 7 && data[i].demand > 3) data[i].label = "A Little Busy";
      if (data[i].demand <= 3) data[i].label = "Not Busy";
    }
    // console.log(data);
    this.setState({mainData: data});
  }

  // handleDropdown:
  /// Changes selected city of dropdown menu in menu bar
  handleDropdown = (event, index, value) => { 
      let location = "";
      let locLink = "";
      location = value == 1 ? downtownIndy : bloomington;
      locLink = value == 1 ? 'https://downtown-indy.clustertruck.com/menu' : 'https://btown.clustertruck.com/menu';
      console.log(location);
      this.getWeather(location);
      this.setState({cityValue: value, location: location, locLink: locLink}); 
  }


  /* ------------ REACT COMPONENT FUNCTIONS ---------- */


  componentWillMount = () => {
    this.getWeek(this.state.mainData);
    this.getWeather(this.state.location);
    // this.demandConverter(this.state.mainData);
  }

  componentDidMount = () => { this.demandConverter(this.state.mainData); }

  render() {
    const data = this.state.mainData;
      return (
          <div className={styles.container}>
            <MenuBar city={this.state.cityValue} handleDropdown={this.handleDropdown}/>
            <div className={styles.header}>CLUSTERCAST</div>  
            <div className={styles.demandLabel}>Foresee your feast</div>
            <div className={styles.detailsLabel}>It's never too early to plan your next order!<br/>Check out how busy our week looks.</div>
            <OrderButton locLink={this.state.locLink} location={this.state.cityValue} />
            <div className={styles.peakLabel}>Peak Busyness</div>
            <DemandChartResponsive data={data} />
            <DemandStatus data={data}/>

          </div>
      );
  }
}

/* ----------------------- MENU BAR - CHILD COMPONENT ------------------------ */

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
        labelStyle={{color: 'white', fontSize: '1.25em'}}
        underlineStyle={{borderColor: '#f25f23'}}
        menuItemStyle={{fontSize: '1em'}}
        selectedMenuItemStyle={{color: '#f25f23'}}
        >
        <MenuItem value={1} primaryText="Downtown Indy" />
        <MenuItem value={2} primaryText="Bloomington" />
      </DropdownMenu>
      </div>
    );
  }
}

/* ----------------------- ORDER BUTTON - CHILD COMPONENT ------------------------ */

class OrderButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    let location = "";
    location = this.props.location == 1 ? "Indy Menu" : "Btown Menu";
    return (
      <div className={styles.orderContainer}>
        <RaisedButton 
          className={styles.orderButton} 
          label={location}
          labelColor='#fff' 
          backgroundColor='#f25f23' 
          href={this.props.locLink}/>
      </div>
    );
  }
}

/* ----------------------- DEMAND CHART RESPONSIVE - CHILD COMPONENT ------------------------ */

class DemandChartResponsive extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div>
        <MediaQuery query='(min-device-width: 815px)'>
          <DemandChart width={900} height={250} data={this.props.data}/>
        </MediaQuery>      
        <MediaQuery minDeviceWidth={675} maxDeviceWidth={815}>
          <DemandChart width={650} height={300} data={this.props.data}/>
        </MediaQuery>          
        <MediaQuery minDeviceWidth={530} maxDeviceWidth={674}>
          <DemandChart width={500} height={300} data={this.props.data}/>
        </MediaQuery>        
        <MediaQuery minDeviceWidth={370} maxDeviceWidth={529}>
          <DemandChart width={400} height={250} data={this.props.data}/>
        </MediaQuery>
        <MediaQuery maxDeviceWidth={369}>
          <DemandChart width={350} height={200} data={this.props.data}/>
        </MediaQuery>
      </div>
    );
  }
}
/* ----------------------- DEMAND CHART - CHILD L2 COMPONENT ------------------------ */

class DemandChart extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    const yAxisTicks = ['a','b','c','d'];
    const yAxisTicksInt = [0,5,10,15];
    return (
      <AreaChart 
        className={styles.chart}
        width={this.props.width} 
        height={this.props.height} 
        data={this.props.data}
      >
        <defs>
            <linearGradient id="colorCluster" x1="0" y1="0" x2="0" y2="1">
              <stop offset="25%" stopColor="#f25f23" stopOpacity={1}/>
              <stop offset="95%" stopColor="#ffffff" stopOpacity={0.1}/>
            </linearGradient>
        </defs>
        <XAxis type='category' className={styles.xAxis} dataKey="name" axisLine={false} />
        <YAxis hide={true} domain={[-1, 15]} ticks={yAxisTicksInt} axisLine={false} />
        <Tooltip/>
        <ReferenceLine label="Peak" y={11} alwaysShow={true} stroke='gray' />
        <Area type='monotone' dataKey='demand' stroke='red' fill='url(#colorCluster)' dot={true} activeDot={{r: 8}}/>
      </AreaChart>
    );
  }
}

/* ----------------------- DEMAND STATUS - CHILD COMPONENT ------------------------ */

class DemandStatus extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const data = this.props.data[0];
    const progressData = data.demand * 6.67;
    const demand = [
      {value: progressData},
    ];

    return (
      <div className={styles.demandContainer}>
         <img className={styles.burgerIcon} src={BurgerIcon} />
         <div className={styles.statusLabelContainer}>
           <div className={styles.statusDesc}>Currently we are</div>
           <div className={styles.statusLabel}>{data.label}</div>
        </div>
         {/* <ProgressLabel 
           className={styles.progressLabel}
           progress={progressData}
           startDegree={180}
           progressWidth={60}
           trackWidth={60}
           cornersWidth={30}
           size={400}
           fillColor="white"
           trackColor="lightgray"
           progressColor="#f25f23"
         >
          <text x="200" y="225" className={styles.demandLevelLabel}>{data.label}</text>
        </ProgressLabel> */}
      </div>
    );
  }
}