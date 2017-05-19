/* page.js -- home
Author: Erik Mudrak - Spring 2017 - Clustercast
Description: Implements home page of web app
*/

// Imports:
import React from 'react';
import { browserHistory } from 'react-router';
import styles from "./style.css";
import MediaQuery from 'react-responsive';

import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import DropdownMenu from 'material-ui/DropdownMenu';
import MenuItem from 'material-ui/MenuItem';
import ProgressLabel from 'react-progress-label';

export default class Home extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      cityValue: 1,
      demand: 70,
      isOpen: true,
    };
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
            <div className={styles.middleContainer}>
              <Weather />
              <div className={styles.demandLabel}>Our demand is:</div>
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
              <Date />
            </div>
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

class Weather extends React.Component {
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
      <div className={styles.weather}>
        <div className={styles.weatherIcon}></div>
        <div className={styles.tempLabel}>{this.state.temp}°F</div>
        <div className={styles.weatherLabel}>{this.state.weatherStatus}</div>
      </div>
    );
  }
}

class Date extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLastDay: false,
      day: 'Tuesday',
      time: '4:12PM',
    }
  }

  render() {
    return (
      <div className={styles.date}>
        <div className={styles.dayLabel}>{this.state.day}</div><br/>
        <div className={styles.timeLabel}>{this.state.time}</div>
        <div className={styles.dateIcon}></div>
      </div>
    );
  }
}