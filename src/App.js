import './App.css';
import React from 'react';

const AUDIO = 'https://sampleswap.org/samples-ghost/SOUND%20EFFECTS%20and%20NOISES/Bleeps%20Blips%20Blonks%20Blarts%20and%20Zaps/463[kb]beep-beep-bopbop-bop-bop.wav.mp3'

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      minLeft: '25',
      secLeft: '00',
      startStop: false,
      timerLabel: 'Session'
    };
    this.reset = this.reset.bind(this);
    this.breakDecrement = this.breakDecrement.bind(this);
    this.breakIncrement = this.breakIncrement.bind(this);
    this.sessionDecrement = this.sessionDecrement.bind(this);
    this.sessionIncrement = this.sessionIncrement.bind(this);
    this.startStop = this.startStop.bind(this);
    this.updateTimer = this.updateTimer.bind(this);
    this.changeTimer = this.changeTimer.bind(this);
    this.beep = this.beep.bind(this);
    this.timer = 0;
  }
  reset(){
    document.getElementById('beep').pause();
    clearInterval(this.timer);
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      minLeft: '25',
      secLeft: '00',
      startStop: false,
      timerLabel: 'Session'
    });
  }
  breakDecrement(){
    this.setState(() => {
      let currentValue = this.state.breakLength;
      let newValue = currentValue <= 1 ? 1 : currentValue - 1;
      return {breakLength: newValue};
    });
  }
  breakIncrement(){
    this.setState(() => {
      let currentValue = this.state.breakLength;
      let newValue = currentValue >= 60 ? 60 : currentValue + 1;
      return {breakLength: newValue};
    });
  }
  sessionDecrement(){
    this.setState(() => {
      let currentValue = this.state.sessionLength;
      let newValue = currentValue <= 1 ? 1 : currentValue - 1;
      if(!this.state.startStop){
        return {
          sessionLength: newValue,
          minLeft: newValue,
          secLeft: 0
        };
      } else {
        return {sessionLength: newValue};
      }
    });
  }
  sessionIncrement(){
    this.setState(() => {
      let currentValue = this.state.sessionLength;
      let newValue = currentValue >= 60 ? 60 : currentValue + 1;
      if(!this.state.startStop){
        return {
          sessionLength: newValue,
          minLeft: newValue,
          secLeft: 0
        };
      } else {
        return {sessionLength: newValue};
      }
    });
  }
  startStop(){
    this.setState(prevState => {
      return {startStop: !prevState.startStop,};
    }, () => {
      if(this.state.startStop){
        this.timer = setInterval(this.updateTimer, 1000);
      } else {
        clearInterval(this.timer);
      }
    });
  }
  updateTimer(){
    if(this.state.startStop){
      this.setState(prevState => {
        if(prevState.secLeft === '00'){
          if(prevState.minLeft ==='00'){
            this.beep();
            this.changeTimer();
          } else {
            return{
              minLeft: ('0' + (Number(prevState.minLeft) - 1)).slice(-2),
              secLeft: '59'
            };
          }
        } else {
          return {secLeft: ('0' + (Number(prevState.secLeft) - 1)).slice(-2)};
        }
      });
    }
  }
  changeTimer(){
    if(this.state.timerLabel == 'Session'){
      this.setState({
        timerLabel: 'Break',
        minLeft: this.state.breakLength.toString(),
        secLeft: '00'
      });
    } else{
      this.setState({
        timerLabel: 'Session',
        minLeft: this.state.sessionLength.toString(),
        secLeft: '00'
      });
    }
  }
  beep(){
    let beep = document.getElementById('beep');
    beep.play();
  }
  render() {
    return (
      <div className="App">
        <p id='break-label'>Break Length</p>
        <p id='session-label'>Session Length</p>
        <button id='break-decrement' onClick={this.breakDecrement}></button>
        <button id='session-decrement' onClick={this.sessionDecrement}></button>
        <button id='break-increment' onClick={this.breakIncrement}></button>
        <button id='session-increment' onClick={this.sessionIncrement}></button>
        <div id='break-length'>{this.state.breakLength}</div>
        <div id='session-length'>{this.state.sessionLength}</div>
        <div id='timer-label'>{this.state.timerLabel}</div>
        <div id='time-left'>{this.state.minLeft}:{this.state.secLeft}</div>
        <button id='start_stop' onClick={this.startStop}/>
        <button id='reset' onClick={this.reset}/>
        <audio id='beep' src={AUDIO}/>
      </div>
    );
  }
}

export default App;
