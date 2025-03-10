# Pomodoro Timer App Overview

**Live Demo:** [Experience the Pomodoro Timer App](https://alkisax.github.io/git25and5PomodoroClockFreeCodeCampProject/):  
https://alkisax.github.io/git25and5PomodoroClockFreeCodeCampProject/

**readme file**  https://github.com/alkisax/git25and5PomodoroClockFreeCodeCampProject/blob/main/README.md

**Source Code:** [GitHub Repository](https://github.com/alkisax/git25and5PomodoroClockFreeCodeCampProject): https://github.com/alkisax/git25and5PomodoroClockFreeCodeCampProject

## Introduction

The Pomodoro Timer app was developed in January 2025 as part of the FreeCodeCamp React curriculum. This  tool implements the popular Pomodoro Technique, alternating between focused work sessions (traditionally 25 minutes) and refreshing breaks (5 minutes) to maximize productivity while preventing burnout.
**note**: This README was auto-created in large part using generative AI, with careful checking and supervision by the app creator

## Key Features

### Time Management
The app provides customizable work and break sessions, allowing users to tailor the Pomodoro Technique to their personal productivity patterns and concentration spans.

### Session Control
Users can start, pause, and reset their work sessions with intuitive controls. The timer automatically transitions between work and break modes to maintain your productivity flow.

### Audio Notifications
The app plays an audio alert when each session ends, ensuring you never miss a transition between work and break time without having to constantly check the clock.

### Responsive Design
Built with Bootstrap, the application offers a clean, responsive interface that works seamlessly across desktop and mobile devices.

## How It Works

1. **Session Configuration:** Set your preferred work session and break durations.
2. **Start Timer:** Begin your focused work session with a single click.
3. **Automatic Transitions:** When your work session completes, the app automatically initiates your break timer.
4. **Audio Alerts:** Receive audio notifications when it's time to switch between work and break modes.
5. **Session Tracking:** The app clearly displays your current mode (work or break) and remaining time.

## Technologies Used

- **React:** Provides the component-based architecture and state management
- **Bootstrap:** Ensures a responsive, visually appealing interface
- **JavaScript:** Powers the timer logic and session management
- **HTML5/CSS3:** Delivers a modern, accessible user experience

# Pomodoro Timer

A simple React-based Pomodoro timer application that helps you manage your work and break sessions. The app uses the classic 25-minute work session followed by a 5-minute break, which you can customize according to your preferences.

## Features

- **Session Timer**: Start, pause, and reset a 25-minute work session.
- **Break Timer**: Start a 5-minute break after each work session.
- **Customizable Length**: Adjust the session and break lengths.
- **Audio Alerts**: Plays a sound when the session or break ends.
- **Responsive Design**: Built with Bootstrap for a clean, responsive layout.

## Tech Stack

- React.js
- Bootstrap
- JavaScript
- HTML5
- CSS3

## Components and Methods

### 1. Displayer Component

This is the main component of the application, managing all states and controlling the timer.

#### constructor(props)

```javascript
constructor(props) {
  super(props);
  this.state = {
    breakLength: 5,
    sessionLength: 25,
    sessionTime: "25:00",
    timerRun: false,
    isInSession: true,
    isInBreak: false,
  };
}
```

**Purpose**: Initializes the state of the app. The default session length is 25 minutes, and the default break length is 5 minutes.

**State Variables**:
- `breakLength`: Length of the break session in minutes.
- `sessionLength`: Length of the work session in minutes.
- `sessionTime`: The remaining time in the current session.
- `timerRun`: Whether the timer is currently running.
- `isInSession`: Whether the timer is in a work session.
- `isInBreak`: Whether the timer is in a break session.

#### startTimer

```javascript
startTimer = () => {
  if (this.state.timerRun) return;
  const initialSessionTime = this.timeFormaterSecsToString(this.state.sessionLength * 60);
  this.setState({
    sessionTime: initialSessionTime,
    timerRun: true,
    isInSession: true,
    isInBreak: false,
  }, () => {
    this.countdown();
  });
};
```

**Purpose**: Starts the timer for a new session.

**How it works**:
- It first checks if the timer is already running. If it is, it does nothing.
- Then it converts the session length (in minutes) to a string format (MM:SS) using `timeFormaterSecsToString`.
- Sets `timerRun` to true and starts the countdown.

#### resumeTimer

```javascript
resumeTimer = () => {
  if (this.state.timerRun) return;
  this.setState({ timerRun: true }, () => {
    this.countdown();
  });
};
```

**Purpose**: Resumes the timer if it was paused.

**How it works**:
- If the timer is not running, it sets `timerRun` to true and continues the countdown.

#### countdown

```javascript
countdown = () => {
  let secsTime = this.timeFormaterStringToSecs(this.state.sessionTime);
  if (secsTime > 0 && this.state.timerRun) {
    this.handleTick(secsTime);
  } else if (secsTime === 0) {
    this.handleSessionEnd();
  } else {
    this.setState({ timerRun: false });
  }
};
```

**Purpose**: Handles the countdown functionality.

**How it works**:
- It checks if there is remaining time (`secsTime > 0`) and if the timer is still running.
- If yes, it calls `handleTick` to decrement the time.
- If the time reaches zero, it calls `handleSessionEnd` to switch to a break or session.
- If the timer is paused, it stops the countdown.

#### handleTick

```javascript
handleTick = (secsTime) => {
  if (!this.state.timerRun) return;

  this.timer = setTimeout(() => {
    this.setState((prevState) => {
      let updatedSecs = this.timeFormaterStringToSecs(prevState.sessionTime) - 1;
      if (updatedSecs < 0) updatedSecs = 0;
      const newSessionTime = this.timeFormaterSecsToString(updatedSecs);
      this.setState({ sessionTime: newSessionTime });
    });

    this.countdown();
  }, 1000);
};
```

**Purpose**: Decrements the session time every second.

**How it works**:
- It updates the time by decrementing one second and converts it back to the MM:SS format.
- Then, it recursively calls `countdown` to keep updating the timer every second.

#### handleSessionEnd

```javascript
handleSessionEnd = () => {
  setTimeout(() => {
    this.playBeep();
    this.setState((prevState) => ({
      isInSession: !prevState.isInSession,
      isInBreak: !prevState.isInBreak,
    }), () => {
      const nextDuration = this.state.isInSession ? this.state.sessionLength : this.state.breakLength;
      this.setState({
        sessionTime: this.timeFormaterSecsToString(nextDuration * 60),
      }, () => {
        this.countdown();
      });
    });
  }, 100);
};
```

**Purpose**: Handles the end of a session (either work or break).

**How it works**:
- Plays a beep sound when the session ends.
- Switches between session and break states.
- Starts a new session or break, depending on the state.

#### playBeep

```javascript
playBeep = () => {
  const audio = document.getElementById("beep");
  if (audio) {
    audio.currentTime = 0;
    audio.play().catch(error => console.error("Audio play error:", error));
  }
};
```

**Purpose**: Plays a beep sound when the session ends.

**How it works**:
- It resets the audio to the beginning and plays it.

#### timeFormaterStringToSecs

```javascript
timeFormaterStringToSecs = (stringTime) => {
  const time = stringTime.split(":");
  const mins = parseInt(time[0]);
  const secs = parseInt(time[1]);
  return (mins * 60) + secs;
};
```

**Purpose**: Converts a MM:SS string to seconds.

**How it works**:
- Splits the string at `:` to extract minutes and seconds.
- Converts the time to seconds.

#### timeFormaterSecsToString

```javascript
timeFormaterSecsToString = (secsTime) => {
  const mins = Math.floor(secsTime / 60);
  const secs = secsTime % 60;
  return `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
};
```

**Purpose**: Converts seconds to a MM:SS string.

**How it works**:
- Converts the total seconds to minutes and seconds.
- Formats them into a MM:SS string.

#### componentDidUpdate

```javascript
componentDidUpdate(prevProps, prevState) {
  if (prevState.sessionLength !== this.state.sessionLength) {
    const stringTime = this.timeFormaterSecsToString(this.state.sessionLength * 60);
    this.setState({ sessionTime: stringTime });
  }
}
```

**Purpose**: Updates the session time when the session length is changed.

**How it works**:
- Checks if the `sessionLength` has changed.
- If it has, it converts the new session length into the string format and updates the `sessionTime` state.

### 2. render() Method

```javascript
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
  );
}
```

**Purpose**: Renders the user interface and organizes the components on the page.

**How it works**:
- It displays the app header (25+5 Clock).
- Renders the `BreakLength` and `SessionLength` components for adjusting the timer.
- Renders the `Session` component to display the current session time and controls.
- Adds an audio element for the beep sound at the end of each session.
