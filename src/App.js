import './App.css';
import React from 'react';
import beepAudio from './beep.mp3'


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
    let beep = document.getElementById('beep');
    beep.pause();
    beep.currentTime = 0;
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
      if(!this.state.startStop && this.state.timerLabel === 'Break'){
        return {
          breakLength: newValue,
          minLeft: ('0' + newValue).slice(-2),
          secLeft: '00'
        };
      } else {
        return {breakLength: newValue};
      }
    });
  }
  breakIncrement(){
    this.setState(() => {
      let currentValue = this.state.breakLength;
      let newValue = currentValue >= 60 ? 60 : currentValue + 1;
      if(!this.state.startStop && this.state.timerLabel === 'Break'){
        return {
          breakLength: newValue,
          minLeft: ('0' + newValue).slice(-2),
          secLeft: '00'
        };
      } else {
        return {breakLength: newValue};
      }
    });
  }
  sessionDecrement(){
    this.setState(() => {
      let currentValue = this.state.sessionLength;
      let newValue = currentValue <= 1 ? 1 : currentValue - 1;
      if(!this.state.startStop && this.state.timerLabel === 'Session'){
        return {
          sessionLength: newValue,
          minLeft: ('0' + newValue).slice(-2),
          secLeft: '00'
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
      if(!this.state.startStop && this.state.timerLabel === 'Session'){
        return {
          sessionLength: newValue,
          minLeft: ('0' + newValue).slice(-2),
          secLeft: '00'
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
        if(prevState.minLeft === '00' && prevState.secLeft === '01'){
          this.beep();
        }
        if(prevState.minLeft === '00' && prevState.secLeft === '00'){
          this.changeTimer();
        } else if(prevState.secLeft === '00'){
            return{
              minLeft: ('0' + (Number(prevState.minLeft) - 1)).slice(-2),
              secLeft: '59'
            };
        } else {
          return {secLeft: ('0' + (Number(prevState.secLeft) - 1)).slice(-2)};
        }
      });
    }
  }
  changeTimer(){
    if(this.state.timerLabel === 'Session'){
      this.setState({
        timerLabel: 'Break',
        minLeft: ('0' + this.state.breakLength).slice(-2),
        secLeft: '00'
      });
    } else{
      this.setState({
        timerLabel: 'Session',
        minLeft: ('0' + this.state.sessionLength).slice(-2),
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
      <div className="container text-center text-light py-4 w-75">
        <div className='display-4 pb-4 fw-bold'>25 + 5 Clock</div>
        <Display 
          breakDecrement = {this.breakDecrement}
          breakIncrement = {this.breakIncrement}
          sessionDecrement = {this.sessionDecrement}
          sessionIncrement = {this.sessionIncrement}
          breakLength = {this.state.breakLength}
          sessionLength = {this.state.sessionLength}
        />
        <Clock 
          minLeft = {this.state.minLeft}
          secLeft = {this.state.secLeft}
          timerLabel = {this.state.timerLabel}
        />
        <Controls 
          startStop = {this.startStop}
          reset = {this.reset}
        />
        <audio id='beep' src={beepAudio}/>
      </div>
    );
  }
}

class Display extends React.Component{
  render(){
    return (
      <div id='display' className='row'>
        <div className='col-6 pb-3'>
          <div id='break-label' className='pb-2 h3'>Break Length</div>
          <div className='row'>
            <a id='break-increment' className ='col-5 pt-2 text-reset' onClick={this.props.breakIncrement}>
              <i className='fa fa-2x fa-arrow-up float-end text-primary'/>
            </a>
            <div id='break-length' className='col-2 pt-1 h1 d-flex justify-content-center'>
              {this.props.breakLength}
            </div>
            <a id='break-decrement' className ='col-5 pt-2 text-reset' onClick={this.props.breakDecrement}>
              <i className='fa fa-2x fa-arrow-down float-start text-danger'/>
            </a>
          </div>
        </div>
        <div className='col-6 pb-3'>
          <div id='session-label' className='pb-2 h3'>Session Length</div>
          <div className='row'>
            <a id='session-increment' className ='col-5 pt-2 text-reset' onClick={this.props.sessionIncrement}>
              <i className='fa fa-2x fa-arrow-up float-end text-primary'/>
            </a>
            <div id='session-length' className='col-2 pt-1 h1 d-flex justify-content-center'>
              {this.props.sessionLength}
            </div>
            <a id='session-decrement' className ='col-5 pt-2 text-reset' onClick={this.props.sessionDecrement}>
              <i className='fa fa-2x fa-arrow-down float-start text-danger'/>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

class Clock extends React.Component{
  render(){
    return (
      <div id='clock' className='container w-50 border border-3 rounded-pill'>
        <div id='timer-label' className='display-6 py-2'>{this.props.timerLabel}</div>
        <div id='time-left' className='display-1 pb-3 fw-bolder'>{this.props.minLeft + ':' + this.props.secLeft}</div>
      </div>
    );
  }
}

class Controls extends React.Component{
  render(){
    return(
      <div id='controls' className='pt-4'>
        <a id='start_stop' className='m-3 text-reset' onClick={this.props.startStop}>
          <i className='fa fa-2x fa-play text-primary'/>
          <i className='fa fa-2x fa-pause text-primary'/>
        </a>
        <a id='reset' className='m-3 text-reset' onClick={this.props.reset}>
          <i className='fa fa-2x fa-refresh text-danger'/>
        </a>
      </div>
    );
  }
}

export default App;
