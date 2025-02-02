class Displayer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      sessionTime: "25:00",
      timerRun: false,
      isInSession: true,
      isInBreak: false,
    }
  }

  startTimer = () => {

    console.log("startTimer called")
    if (this.state.timerRun){
      return
    }

    const initialSessionTime = this.timeFormaterSecsToString(this.state.sessionLength * 60);
    
    console.log("Parent BEFORE timerRun:", this.state.timerRun);
    this.setState ({
      sessionTime: initialSessionTime, // Set sessionTime correctly
      timerRun:true,
      isInSession: true,
      isInBreak: false,
    }, () => {
      console.log("Parent AFTER timerRun:", this.state.timerRun);
      this.countdown()
    })
  }

  resumeTimer = () => {
    console.log("resumeTimer called");
  
    if (this.state.timerRun) {
      return; // If already running, don't restart
    }
  
    this.setState({ timerRun: true }, () => {
      this.countdown(); // Just continue decrementing the existing time
    });
  };

  countdown = () => {
    let secsTime = this.timeFormaterStringToSecs(this.state.sessionTime);
  
    if (secsTime > 0 && this.state.timerRun) {
      this.handleTick(secsTime);
    } else if (secsTime === 0) {
      this.handleSessionEnd();
    } else {
      console.log("Countdown stopped.");
      this.parentStateHandler("timerRun", false);
    }
  };

  handleTick = (secsTime) => {
    if (!this.state.timerRun) {
      console.log("Timer paused, no more ticks.");
      return; // Stop further ticks when the timer is paused
    }

    this.timer = setTimeout(() => {
      this.setState((prevState) => {
        let updatedSecs = this.timeFormaterStringToSecs(prevState.sessionTime) - 1;
        if (updatedSecs < 0) updatedSecs = 0; // Prevent negative time
        const newSessionTime = this.timeFormaterSecsToString(updatedSecs);

        if (updatedSecs < 5) {
          console.log("secs to finish: ", updatedSecs)
          console.log("(tick log) state BEFORE sessionTime: ", this.state.sessionTime)
        }

        if (!this.state.timerRun) {
          console.log("Timer paused, no more ticks.");
          return; // Stop further ticks when the timer is paused
        }
        
        this.parentStateHandler("sessionTime", newSessionTime, () => {
          if (updatedSecs < 5) {
            console.log("(tick log) state AFTER sessionTime: ", this.state.sessionTime)
          }
        })
      });
  
      this.countdown();
    }, 1000);
  };
    
  handleSessionEnd = () => {

    console.log("(session end log) state AFTER sessionTime: ", this.state.sessionTime)

    setTimeout(() => {
      console.log("Session ended. Switching to break/session.");
      this.playBeep();
    
      this.setState((prevState) => ({
        isInSession: !prevState.isInSession,
        isInBreak: !prevState.isInBreak,
        
      }), () => {
        const nextDuration = this.state.isInSession ? this.state.sessionLength : this.state.breakLength;
        this.setState({
          sessionTime: this.timeFormaterSecsToString(nextDuration * 60),
        }, () => {
          console.log("Starting new round.");
          this.countdown();
        });
      });
    }, 100)
  };
    
  playBeep = () => {
    console.log("Timer reached 00:00, playing beep...");
    const audio = document.getElementById("beep");
    if (audio) {
      audio.currentTime = 0; // Reset in case it was already playing
      setTimeout(() => {
        audio.play().catch(error => console.error("Audio play error:", error));
      }, 100);
    }
  };

  timeFormaterStringToSecs = (stringTime) => {
    // ισως να μην θέλει this.state.sessionTime και να βάλω κατι γενικό για να την καλεί
    const time = stringTime.split(":")
    // αυτό έκανε λάθος πρόσθεση ως string πχ "50" + 240 = 50240
    // const secsTime = time[1] + (time[0] * 60)
    const mins = parseInt(time[0])
    const secs = parseInt(time[1])
    const secsTime = (mins * 60) + secs
    return secsTime
  }

  timeFormaterSecsToString = (secsTime) => {
    const mins = Math.floor(secsTime / 60)
    const secs = secsTime % 60
    let stringTime = ""
    if (mins > 9){
      stringTime += mins
    } else {
      stringTime += "0" + mins
    }
    stringTime += ":"
    if (secs > 9){
      stringTime += secs
    } else {
      stringTime += "0" + secs
    }
    return stringTime
  }

  //αυτο έχει να κάνει με την αυτοματη αλλαγή απο τις ρυθμήσεις στο συνολικό χρόνο
  componentDidUpdate(prevProps, prevState) {
    if (prevState.sessionLength !== this.state.sessionLength){
      const stringTime = this.timeFormaterSecsToString(this.state.sessionLength * 60)
      this.parentStateHandler("sessionTime", stringTime)
    }
  }

  parentStateHandler = (property, value, callback = () => {}) => {
    this.setState ({
      [property] : value
    }, callback)
  }

  render() {
    return (
      <div className="container col-10">
        <h1 className="text-light text-center">25+5 Clock</h1>
        <div className="row text-light d-flex justify-content-center">
          <div className="col-4">
            <BreakLength
              breakLength={this.state.breakLength}
              parentStateHandler={this.parentStateHandler}
            />
          </div>
          <div className="col-4">
            <SessionLength 
              sessionLength={this.state.sessionLength}
              parentStateHandler={this.parentStateHandler}
            />
          </div>
        </div>
        <div>
          <Session 
            sessionLength={this.state.sessionLength}
            breakLength={this.state.breakLength}
            sessionTime={this.state.sessionTime}
            timerRun={this.state.timerRun}
            parentStateHandler={this.parentStateHandler}
            startTimer={this.startTimer}
            timeFormaterSecsToString={this.timeFormaterSecsToString}
            timeFormaterStringToSecs={this.timeFormaterStringToSecs}
            isInSession={this.state.isInSession}
            resumeTimer={this.resumeTimer}
          />
        </div>

        {/* Audio element for alarm */}
        <audio id="beep" src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg"></audio>


      </div>
    )
  }
}

class BreakLength extends React.Component {
  constructor(props) {
    super(props)
  }
  incrementBreak = () => {
    if (this.props.breakLength < 60){
      this.props.parentStateHandler("breakLength", this.props.breakLength + 1)
    }
  }
  decrementBreak = () => {
    if (this.props.breakLength > 1){
      this.props.parentStateHandler("breakLength", this.props.breakLength - 1)
    }
  }
  render() {
    return (
      <div className="d-flex justify-content-center flex-column align-items-center">
        <h5 id="break-label">Break Length</h5>
        <span className="d-flex align-items-center">
          <i id="break-increment" className="fas fa-arrow-up " 
            style={{ cursor: 'pointer' }} 
            onClick={this.incrementBreak}></i>
          <p id="break-length" className="p-2 m-0 mx-2" >
            {this.props.breakLength}
          </p>
          <i id="break-decrement" className="fas fa-arrow-down" 
            style={{ cursor: 'pointer' }} 
            onClick={this.decrementBreak}></i>
        </span>
      </div>
    )
  }
}

class SessionLength extends React.Component {
  constructor(props) {
    super(props)
  }
  incrementSessionLength = () => {
    if (this.props.sessionLength < 60){
      this.props.parentStateHandler("sessionLength", this.props.sessionLength + 1)
    }
  }
  decrementSessionLength = () => {
    if (this.props.sessionLength > 1){
      this.props.parentStateHandler("sessionLength", this.props.sessionLength - 1)
    }
  }
  render() {
    return (
      <div className="d-flex justify-content-center flex-column align-items-center">
        <h5>Session Length</h5>
        <span className="d-flex align-items-center">
          <i id="session-increment" className="fas fa-arrow-up " style={{ cursor: 'pointer' }} onClick={this.incrementSessionLength}></i>
          <p  id="session-label" className="p-2 m-0 mx-2">
            {this.props.sessionLength}
          </p>
          <i id="session-decrement" className="fas fa-arrow-down" style={{ cursor: 'pointer' }} onClick={this.decrementSessionLength}></i>
        </span>
      </div>
    )
  }
}

class Session extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    // Determine the timer label based on the isInSession state
    const timerLabel = this.props.isInSession ? "Session" : "Break";

    return (
      <div>
        <div className="d-flex justify-content-center align-items-center">
          <div className="container border border-danger-subtle border-radius-15 text-light text-center">
            <h3 id="timer-label">{timerLabel}</h3>
            <p  id="session-length" className="fs-1 font-weight-bold">
            {this.props.sessionLength}               
            </p>
            <p id="time-left" className="fs-1 font-weight-bold">
              {this.props.sessionTime}
            </p>
          </div>
        </div>

        {/* Play, Pause, and Restart Buttons */}
        <div className="container d-flex justify-content-center align-items-center">
          <div className="row">
            <Buttons 
              sessionLength={this.props.sessionLength}
              breakLength={this.props.breakLength}
              sessionTime={this.props.sessionTime}
              timerRun={this.props.timerRun}
              parentStateHandler={this.props.parentStateHandler}
              startTimer={this.props.startTimer}
              timeFormaterSecsToString={this.props.timeFormaterSecsToString}
              timeFormaterStringToSecs={this.props.timeFormaterStringToSecs}
              resumeTimer={this.props.resumeTimer}
            />
          </div>
        </div>
      </div>      
    )
  }
}

class Buttons extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isPaused: false
    }
  }
  playHandler = () => {
    console.log("play pressed");
    console.log("isPaused: ",this.state.isPaused)
  
    if (this.state.isPaused) {
      // Resume the timer if it's paused
      this.pauseHandler()
    } else {
      if (this.props.timerRun) {
        // Pause the timer if it's running
        console.log("pause handler called from start handler")
        console.log("this.props.timerRun",this.props.timerRun)
        console.log("this.state.isPaused",this.state.isPaused)
        this.pauseHandler()
      } else {
        // Start the timer if it's not running
        console.log("BEFORE this.props.timerRun",this.props.timerRun)
        this.props.startTimer();
        console.log("AFTER this.props.timerRun",this.props.timerRun)
      }
    }
  };  

  /*
    my logic
      in start timer i format the stringTime to seconds and then the inner method is called
      it checks if there is time >=0 and if timerun is true and then decrements time by one and updates the state
              secsTime -= 1
              let stringTime = this.timeFormaterSecsToString(secsTime)
              this.parentStateHandler("sessionTime", stringTime)
      if not it sets timerun to false so as to stop the loop (even if there is still time)
      in the end it recursivly calls it self with countdown to work as a loop

      when the pause button is pressed
      it sets inner state to ispaused to true and sets parent state to timerun false

      this should stop the loop of the parent
          this.props.parentStateHandler("timerRun", false)
      whne play is pressed again it should call parent startTimer and SHOULD (or not?) continue from where the state was already when paused
    if (!this.state.isPaused) {
      this.props.startTimer()
    }
  */
  pauseHandler = () => {
    console.log("Pause/Resume pressed");

    // Stop the countdown immediately
    clearTimeout(this.timer);
  
    this.setState(
      (prevState) => ({ isPaused: !prevState.isPaused }), // Toggle pause state
      () => {
        this.props.parentStateHandler("timerRun", !this.state.isPaused); // Resume or pause based on state
        if (!this.state.isPaused) {
          this.props.resumeTimer(); // Resume if unpaused
        }
      }
    );
  };

  restartHandler = () => {
    console.log("restart pressed")

    // Stop the sound
    const audio = document.getElementById("beep");
    if (audio) {
      audio.pause();
      audio.currentTime = 0; // Reset sound
    }

    // Clear any running timers
    clearTimeout(this.timer);

    this.props.parentStateHandler("sessionLength", 25)
    this.props.parentStateHandler("breakLength", 5)
    this.props.parentStateHandler("timerRun", false)
    this.props.parentStateHandler("isInSession", true);
    this.props.parentStateHandler("isInBreak", false);
  // Use a callback to ensure state is updated before resetting sessionTime
  setTimeout(() => {
    const stringTime = this.props.timeFormaterSecsToString(25 * 60);
    this.props.parentStateHandler("sessionTime", stringTime);
  }, 0);
  }

  render() {
    return (
      <div>
        <button 
        id="start_stop"
        className="btn btn-success m-2 col-3" 
        style={{ fontSize: '1rem' }} 
        onClick={this.playHandler}>
        <i className="fas fa-play"></i> Play
      </button>

      <button 
        className=" col-3 btn btn-warning m-2" 
        style={{ fontSize: '1rem' }} 
        onClick={this.pauseHandler}>
        <i className="fas fa-pause"></i> Pause
      </button>

      <button 
        id="reset"
        className=" col-3 btn btn-danger m-2" 
        style={{ fontSize: '1rem' }} 
        onClick={this.restartHandler}>
        <i className="fas fa-redo"></i> Restart
      </button>
      </div>
    )
  }
}

ReactDOM.render(
  <div>
    <Displayer />
  </div>,
  document.getElementById("clock")
)

class BoilerPlate extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }
  handleChange = (event) => {

  }
  render() {
    return (
      <div>

      </div>
    )
  }
}