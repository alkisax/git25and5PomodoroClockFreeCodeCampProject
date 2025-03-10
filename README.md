
# `startTimer` Method

The `startTimer` method initializes and starts the timer for the session or break. It ensures the timer is not already running before starting and sets the initial session time based on the current session length.

## Code
```javascript
startTimer = () => {
  console.log("startTimer called");
  if (this.state.timerRun) {
    return; // Exit if the timer is already running
  }

  const initialSessionTime = this.timeFormaterSecsToString(this.state.sessionLength * 60);

  console.log("Parent BEFORE timerRun:", this.state.timerRun);
  this.setState({
    sessionTime: initialSessionTime, // Set sessionTime correctly
    timerRun: true, // Indicate the timer is running
    isInSession: true, // Set the state to session mode
    isInBreak: false, // Ensure break mode is not active
  }, () => {
    console.log("Parent AFTER timerRun:", this.state.timerRun);
    this.countdown(); // Start the countdown process
  });
};
```

## Key Steps

1. **Check if Timer is Already Running**:
   - If the timer is already running (`this.state.timerRun` is `true`), the method exits early to avoid restarting the timer.
   ```javascript
   if (this.state.timerRun) {
     return;
   }
   ```

2. **Format Initial Session Time**:
   - The session length (in minutes) is converted to seconds and then formatted into a string (e.g., `"25:00"`) using the `timeFormaterSecsToString` method.
   ```javascript
   const initialSessionTime = this.timeFormaterSecsToString(this.state.sessionLength * 60);
   ```

3. **Update State and Start Countdown**:
   - The state is updated with the initial session time, and `timerRun` is set to `true` to indicate the timer is running.
   - The `countdown` method is called to start the countdown process.
   ```javascript
   this.setState({
     sessionTime: initialSessionTime,
     timerRun: true,
     isInSession: true,
     isInBreak: false,
   }, () => {
     this.countdown();
   });
   ```

## Debugging Logs
- The method includes `console.log` statements to track the state before and after starting the timer, aiding in debugging and understanding the flow.
```javascript
console.log("Parent BEFORE timerRun:", this.state.timerRun);
console.log("Parent AFTER timerRun:", this.state.timerRun);
```

## Purpose
- This method ensures the timer starts correctly with the appropriate initial time and prevents duplicate starts if the timer is already running.


# `resumeTimer` Method

The `resumeTimer` method resumes the timer if it has been paused. It ensures the timer is not already running before resuming and continues the countdown from the current session time.

## Code
```javascript
resumeTimer = () => {
  console.log("resumeTimer called");

  if (this.state.timerRun) {
    return; // Exit if the timer is already running
  }

  this.setState({ timerRun: true }, () => {
    this.countdown(); // Continue decrementing the existing time
  });
};
```

## Key Steps

1. **Check if Timer is Already Running**:
   - If the timer is already running (`this.state.timerRun` is `true`), the method exits early to avoid restarting the timer.
   ```javascript
   if (this.state.timerRun) {
     return;
   }
   ```

2. **Resume the Timer**:
   - The state is updated to set `timerRun` to `true`, indicating the timer is now running.
   - The `countdown` method is called to continue decrementing the existing session time.
   ```javascript
   this.setState({ timerRun: true }, () => {
     this.countdown();
   });
   ```

## Debugging Logs
- The method includes a `console.log` statement to track when the `resumeTimer` method is called, aiding in debugging and understanding the flow.
```javascript
console.log("resumeTimer called");
```

## Purpose
- This method ensures the timer resumes correctly from where it was paused, without restarting or resetting the session time.

# `countdown` Method

The `countdown` method manages the countdown logic for the timer. It checks the current session time, decrements it if the timer is running, and handles the end of the session or break.

## Code
```javascript
countdown = () => {
  let secsTime = this.timeFormaterStringToSecs(this.state.sessionTime);

  if (secsTime > 0 && this.state.timerRun) {
    this.handleTick(secsTime); // Decrement the time by one second
  } else if (secsTime === 0) {
    this.handleSessionEnd(); // Handle the end of the session or break
  } else {
    console.log("Countdown stopped.");
    this.parentStateHandler("timerRun", false); // Stop the timer
  }
};
```

## Key Steps

1. **Convert Session Time to Seconds**:
   - The current session time (in `"MM:SS"` format) is converted to seconds using the `timeFormaterStringToSecs` method.
   ```javascript
   let secsTime = this.timeFormaterStringToSecs(this.state.sessionTime);
   ```

2. **Check if Timer Should Continue**:
   - If there is time remaining (`secsTime > 0`) and the timer is running (`this.state.timerRun` is `true`), the `handleTick` method is called to decrement the time by one second.
   ```javascript
   if (secsTime > 0 && this.state.timerRun) {
     this.handleTick(secsTime);
   }
   ```

3. **Handle Session/Break End**:
   - If the session or break time reaches `0`, the `handleSessionEnd` method is called to switch between session and break modes.
   ```javascript
   else if (secsTime === 0) {
     this.handleSessionEnd();
   }
   ```

4. **Stop the Timer**:
   - If the timer is not running or there is no time left, the timer is stopped by setting `timerRun` to `false`.
   ```javascript
   else {
     console.log("Countdown stopped.");
     this.parentStateHandler("timerRun", false);
   }
   ```

## Debugging Logs
- The method includes a `console.log` statement to indicate when the countdown has stopped, aiding in debugging and understanding the flow.
```javascript
console.log("Countdown stopped.");
```

## Purpose
- This method ensures the timer decrements correctly, handles the transition between session and break modes, and stops the timer when necessary.

# `handleTick` Method

The `handleTick` method handles the decrementing of the timer by one second. It ensures the timer continues to run if it is not paused and updates the session time in the state.

## Code
```javascript
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
        console.log("secs to finish: ", updatedSecs);
        console.log("(tick log) state BEFORE sessionTime: ", this.state.sessionTime);
      }

      if (!this.state.timerRun) {
        console.log("Timer paused, no more ticks.");
        return; // Stop further ticks when the timer is paused
      }

      this.parentStateHandler("sessionTime", newSessionTime, () => {
        if (updatedSecs < 5) {
          console.log("(tick log) state AFTER sessionTime: ", this.state.sessionTime);
        }
      });
    });

    this.countdown(); // Continue the countdown
  }, 1000);
};
```

## Key Steps

1. **Check if Timer is Running**:
   - If the timer is paused (`this.state.timerRun` is `false`), the method exits early to stop further ticks.
   ```javascript
   if (!this.state.timerRun) {
     console.log("Timer paused, no more ticks.");
     return;
   }
   ```

2. **Decrement the Timer**:
   - The current session time is decremented by one second using `setTimeout`.
   - The updated time is formatted back into `"MM:SS"` format using the `timeFormaterSecsToString` method.
   ```javascript
   let updatedSecs = this.timeFormaterStringToSecs(prevState.sessionTime) - 1;
   if (updatedSecs < 0) updatedSecs = 0; // Prevent negative time
   const newSessionTime = this.timeFormaterSecsToString(updatedSecs);
   ```

3. **Update Session Time**:
   - The state is updated with the new session time using the `parentStateHandler` method.
   - If the remaining time is less than 5 seconds, debug logs are printed to track the state before and after the update.
   ```javascript
   this.parentStateHandler("sessionTime", newSessionTime, () => {
     if (updatedSecs < 5) {
       console.log("(tick log) state AFTER sessionTime: ", this.state.sessionTime);
     }
   });
   ```

4. **Continue the Countdown**:
   - The `countdown` method is called recursively to continue the countdown process.
   ```javascript
   this.countdown();
   ```

## Debugging Logs
- The method includes `console.log` statements to track the timer's behavior, especially when the remaining time is less than 5 seconds.
```javascript
console.log("secs to finish: ", updatedSecs);
console.log("(tick log) state BEFORE sessionTime: ", this.state.sessionTime);
console.log("(tick log) state AFTER sessionTime: ", this.state.sessionTime);
```

## Purpose
- This method ensures the timer decrements correctly by one second, updates the state with the new time, and continues the countdown process unless the timer is paused.

