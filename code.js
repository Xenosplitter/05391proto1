dpi_x = document.getElementById('testdiv').offsetWidth;
console.log(dpi_x);

DPIofYourDeviceScreen = dpi_x; //you will need to measure or look up the DPI or PPI of your device/browser to make sure you get the right scale!!
createCanvasOfInputArea = DPIofYourDeviceScreen*1; //aka, 1.0 inches square!

let totalTrialNum = 2; //the total number of phrases to be tested - set this low for testing. Might be ~10 for the real bakeoff!
let currTrialNum = 0; // the current trial number (indexes leto trials array above)
let startTime = 0; // time starts when the first letter is entered
let finishTime = 0; // records the time of when the final trial ends
let lastTime = 0; //the timestamp of when the last trial was completed
let lettersEnteredTotal = 0; //a running total of the number of letters the user has entered (need this for final WPM computation)
let lettersExpectedTotal = 0; //a running total of the number of letters expected (correct phrases)
let errorsTotal = 0; //a running total of the number of errors (when hitting next)
let currentPhrase = ""; //the current target phrase
let currentTyped = ""; //what the user has typed so far

//Variables for my silly implementation. You can delete this:
var currentLetter = 'a';
var currentScreen = 0;

const scaleFactor = DPIofYourDeviceScreen/110;

//You can add stuff in here. This is just a basic implementation.
function setup()
{
  frameRate(75);
  textSize(12*scaleFactor);
  createCanvas(800,800); //Sets the createCanvas of the app. You should modify this to your device's native createCanvas. Many phones today are 1080 wide by 1920 tall.
  noStroke(); //my code doesn't use any strokes.

  phrases = shuffle(phrases);
}

//You can modify stuff in here. This is just a basic implementation.
function draw()
{
  background(255); //clear background

  //check to see if the user finished. You can't change the score computation.
  if (finishTime!=0)
  {
    fill(0);
    textAlign(CENTER);
    text("Trials complete!",400,200); //output
    text("Total time taken: " + (finishTime - startTime),400,200+20*scaleFactor); //output
    text("Total letters entered: " + lettersEnteredTotal,400,200+40*scaleFactor); //output
    text("Total letters expected: " + lettersExpectedTotal,400,200+60*scaleFactor); //output
    text("Total errors entered: " + errorsTotal,400,200+80*scaleFactor); //output
    let wpm = (lettersEnteredTotal/5.0)/((finishTime - startTime)/60000); //FYI - 60K is number of milliseconds in minute
    text("Raw WPM: " + wpm,400,200+100*scaleFactor); //output
    let freebieErrors = lettersExpectedTotal*.05; //no penalty if errors are under 5% of chars
    text("Freebie errors: " + nf(freebieErrors,1,3),400,200+120*scaleFactor); //output
    let penalty = max(errorsTotal-freebieErrors, 0) * .5;
    text("Penalty: " + penalty,400,200+140*scaleFactor);
    text("WPM w/ penalty: " + (wpm-penalty),400,200+160*scaleFactor); //yes, minus, because higher WPM is better

    return;
  }


  //draw 1" watch area
  fill(100);
  rect(width/2-createCanvasOfInputArea/2, height/2-createCanvasOfInputArea/2, createCanvasOfInputArea, createCanvasOfInputArea); //input area should be 1" by 1"

  //check to see if the user hasn't started yet
  if (startTime==0 & !mouseIsPressed)
  {
    fill(128);
    textAlign(CENTER);
    text("Click to start time!", 280, 150); //display this message until the user clicks!
  }

  if (startTime==0 & mouseIsPressed)
  {
    nextTrial(); //start the trials!
  }

  //if start time does not equal zero, it means we must be in the trials
  if (startTime!=0)
  {
    //you can very slightly adjust the position of the target/entered phrases and next button
    textAlign(LEFT); //align the text left
    fill(128);
    text("Phrase " + (currTrialNum+1) + " of " + totalTrialNum, 70, 50); //draw the trial count
    fill(128);
    text("Target:   " + currentPhrase, 70, 100); //draw the target string
    text("Entered:  " + currentTyped + "|", 70, 140); //draw what the user has entered thus far 
    //draw very basic next button
    if (currentTyped == currentPhrase)
    {
      fill(0, 255, 0);
    }
    else
    {
      fill(127, 0, 0);
    }
    rect(600, 600, 200, 200); //draw next button
    fill(255);
    text("NEXT > ", 650, 650); //draw next label

    fill(255);
    switch (currentScreen) {
      case 0:
        text('a',     width/2-createCanvasOfInputArea/3 - 8, height/2-createCanvasOfInputArea/3 + 8);
        text('b',     width/2 - 8,                           height/2-createCanvasOfInputArea/3 + 8);
        text('c',     width/2+createCanvasOfInputArea/3 - 8, height/2-createCanvasOfInputArea/3 + 8);
        text('left',  width/2-createCanvasOfInputArea/3 - 8, height/2 + 8);
        text('right', width/2+createCanvasOfInputArea/3 - 8, height/2 + 8);
        text('d',     width/2-createCanvasOfInputArea/3 - 8, height/2+createCanvasOfInputArea/3 + 8);
        text('e',     width/2+createCanvasOfInputArea/3 - 8, height/2+createCanvasOfInputArea/3 + 8);
        break;
      case 1:
        text('f',     width/2-createCanvasOfInputArea/3 - 8, height/2-createCanvasOfInputArea/3 + 8);
        text('g',     width/2 - 8,                           height/2-createCanvasOfInputArea/3 + 8);
        text('h',     width/2+createCanvasOfInputArea/3 - 8, height/2-createCanvasOfInputArea/3 + 8);
        text('left',  width/2-createCanvasOfInputArea/3 - 8, height/2 + 8);
        text('right', width/2+createCanvasOfInputArea/3 - 8, height/2 + 8);
        text('i',     width/2-createCanvasOfInputArea/3 - 8, height/2+createCanvasOfInputArea/3 + 8);
        text('j',     width/2,                               height/2+createCanvasOfInputArea/3 + 8);
        text('k',     width/2+createCanvasOfInputArea/3 - 8, height/2+createCanvasOfInputArea/3 + 8);
        break;
      case 2:
        text('l',     width/2-createCanvasOfInputArea/3 - 8, height/2-createCanvasOfInputArea/3 + 8);
        text('m',     width/2 - 8,                           height/2-createCanvasOfInputArea/3 + 8);
        text('n',     width/2+createCanvasOfInputArea/3 - 8, height/2-createCanvasOfInputArea/3 + 8);
        text('left',  width/2-createCanvasOfInputArea/3 - 8, height/2 + 8);
        text('right', width/2+createCanvasOfInputArea/3 - 8, height/2 + 8);
        text('o',     width/2-createCanvasOfInputArea/3 - 8, height/2+createCanvasOfInputArea/3 + 8);
        text('p',     width/2 - 8,                           height/2+createCanvasOfInputArea/3 + 8);
        text('q',     width/2+createCanvasOfInputArea/3 - 8, height/2+createCanvasOfInputArea/3 + 8);
        break;
      case 3:
        text('r',     width/2-createCanvasOfInputArea/3 - 8, height/2-createCanvasOfInputArea/3 + 8);
        text('s',     width/2 - 8,                           height/2-createCanvasOfInputArea/3 + 8);
        text('t',     width/2+createCanvasOfInputArea/3 - 8, height/2-createCanvasOfInputArea/3 + 8);
        text('left',  width/2-createCanvasOfInputArea/3 - 8, height/2 + 8);
        text('right', width/2+createCanvasOfInputArea/3 - 8, height/2 + 8);
        text('u',     width/2-createCanvasOfInputArea/3 - 8, height/2+createCanvasOfInputArea/3 + 8);
        text('v',     width/2 - 8,                           height/2+createCanvasOfInputArea/3 + 8);
        text('w',     width/2+createCanvasOfInputArea/3 - 8, height/2+createCanvasOfInputArea/3 + 8);
        break;
      case 4:
        text('x',     width/2-createCanvasOfInputArea/3 - 8, height/2-createCanvasOfInputArea/3 + 8);
        text('y',     width/2 - 8,                           height/2-createCanvasOfInputArea/3 + 8);
        text('z',     width/2+createCanvasOfInputArea/3 - 8, height/2-createCanvasOfInputArea/3 + 8);
        text('left',  width/2-createCanvasOfInputArea/3 - 8, height/2 + 8);
        text('right', width/2+createCanvasOfInputArea/3 - 8, height/2 + 8);
        text('_',     width/2-createCanvasOfInputArea/3 - 8, height/2+createCanvasOfInputArea/3 + 8);
        text('<<',    width/2+createCanvasOfInputArea/3 - 8, height/2+createCanvasOfInputArea/3 + 8);
        break;
    }
  }
}

function didMouseClick(x, y, w, h) //simple function to do hit testing
{
  return (mouseX > x && mouseX<x+w && mouseY>y && mouseY<y+h); //check to see if it is in button bounds
}


//you can replace all of this logic.
function singleTap()
{
  console.log(startTime)
  if (millis()-startTime<=100) {
    return;
  }

  currentLetter = '';
  //-1,-1
  if (didMouseClick(width/2-createCanvasOfInputArea/2, height/2-createCanvasOfInputArea/2, createCanvasOfInputArea/3, createCanvasOfInputArea/3))
  {
    switch (currentScreen) {
      case 0:
        currentLetter = 'a';
        break;
      case 1:
        currentLetter = 'f';
        break;
      case 2:
        currentLetter = 'l';
        break;
      case 3:
        currentLetter = 'r';
        break;
      case 4:
        currentLetter = 'x';
        break;
    }
  }
  //0,-1
  if (didMouseClick(width/2-createCanvasOfInputArea/6, height/2-createCanvasOfInputArea/2, createCanvasOfInputArea/3, createCanvasOfInputArea/3))
  {
    switch (currentScreen) {
      case 0:
        currentLetter = 'b';
        break;
      case 1:
        currentLetter = 'g';
        break;
      case 2:
        currentLetter = 'm';
        break;
      case 3:
        currentLetter = 's';
        break;
      case 4:
        currentLetter = 'y';
        break;
    }
  }
  //1,-1
  if (didMouseClick(width/2+createCanvasOfInputArea/6, height/2-createCanvasOfInputArea/2, createCanvasOfInputArea/3, createCanvasOfInputArea/3))
  {
    switch (currentScreen) {
      case 0:
        currentLetter = 'c';
        break;
      case 1:
        currentLetter = 'h';
        break;
      case 2:
        currentLetter = 'n';
        break;
      case 3:
        currentLetter = 't';
        break;
      case 4:
        currentLetter = 'z';
        break;
    }
  }
  //-1,0
  if (didMouseClick(width/2-createCanvasOfInputArea/2, height/2-createCanvasOfInputArea/6, createCanvasOfInputArea/3, createCanvasOfInputArea/3))
  {
    currentLetter = 'left';
  }
  //1,0
  if (didMouseClick(width/2+createCanvasOfInputArea/6, height/2-createCanvasOfInputArea/6, createCanvasOfInputArea/3, createCanvasOfInputArea/3))
  {
    currentLetter = 'right';
  }
  //-1,1
  if (didMouseClick(width/2-createCanvasOfInputArea/2, height/2+createCanvasOfInputArea/6, createCanvasOfInputArea/3, createCanvasOfInputArea/3))
  {
    switch (currentScreen) {
      case 0:
        currentLetter = 'd';
        break;
      case 1:
        currentLetter = 'i';
        break;
      case 2:
        currentLetter = 'o';
        break;
      case 3:
        currentLetter = 'u';
        break;
      case 4:
        currentLetter = '_';
        break;
    }
  }
  //0,1
  if (didMouseClick(width/2-createCanvasOfInputArea/6, height/2+createCanvasOfInputArea/6, createCanvasOfInputArea/3, createCanvasOfInputArea/3))
  {
    switch (currentScreen) {
      case 0:
        currentLetter = '';
        break;
      case 1:
        currentLetter = 'j';
        break;
      case 2:
        currentLetter = 'p';
        break;
      case 3:
        currentLetter = 'v';
        break;
      case 4:
        currentLetter = '';
        break;
    }
  }
  //1,1
  if (didMouseClick(width/2+createCanvasOfInputArea/6, height/2+createCanvasOfInputArea/6, createCanvasOfInputArea/3, createCanvasOfInputArea/3))
  {
    switch (currentScreen) {
      case 0:
        currentLetter = 'e';
        break;
      case 1:
        currentLetter = 'k';
        break;
      case 2:
        currentLetter = 'q';
        break;
      case 3:
        currentLetter = 'w';
        break;
      case 4:
        currentLetter = '<<';
        break;
    }
  }

  if (currentLetter=='_') //if underscore, consider that a space bar
    currentTyped = currentTyped + " ";
  else if (currentLetter=='<<' & currentTyped.length>0) //if `, treat that as a delete command
    currentTyped = currentTyped.substring(0, currentTyped.length-1);
  else if (currentLetter == 'left')
    if (currentScreen == 0)
    {
      currentScreen = 4;
    }
    else
    {
      currentScreen = currentScreen - 1;
    }
  else if (currentLetter == 'right')
    currentScreen = (currentScreen + 1) % 5;
  else if (currentLetter!='<<') //if not any of the above cases, add the current letter to the typed string
    currentTyped = currentTyped + currentLetter;

  //You are allowed to have a next button outside the 1" area
  if (didMouseClick(600, 600, 200, 200)) //check if click is in next button
  {
    nextTrial(); //if so, advance to next trial
  }

}


function nextTrial()
{
  if (currTrialNum >= totalTrialNum) //check to see if experiment is done
    return; //if so, just return

  if (startTime!=0 && finishTime==0) //in the middle of trials
  {
    console.log("==================");
    console.log("Phrase " + (currTrialNum+1) + " of " + totalTrialNum); //output
    console.log("Target phrase: " + currentPhrase); //output
    console.log("Phrase length: " + currentPhrase.length); //output
    console.log("User typed: " + currentTyped); //output
    console.log("User typed length: " + currentTyped.length); //output
    console.log("Number of errors: " + computeLevenshteinDistance(currentTyped.trim(), currentPhrase.trim())); //trim whitespace and compute errors
    console.log("Time taken on this trial: " + (millis()-lastTime)); //output
    console.log("Time taken since beginning: " + (millis()-startTime)); //output
    console.log("==================");
    lettersExpectedTotal+=currentPhrase.length;
    lettersEnteredTotal+=currentTyped.length;
    errorsTotal+=computeLevenshteinDistance(currentTyped.trim(), currentPhrase.trim());
  }

  //probably shouldn't need to modify any of this output / penalty code.
  if (currTrialNum == totalTrialNum-1) //check to see if experiment just finished
  {
    finishTime = millis();
    console.log("==================");
    console.log("Trials complete!"); //output
    console.log("Total time taken: " + (finishTime - startTime)); //output
    console.log("Total letters entered: " + lettersEnteredTotal); //output
    console.log("Total letters expected: " + lettersExpectedTotal); //output
    console.log("Total errors entered: " + errorsTotal); //output
    let wpm = (lettersEnteredTotal/5.0)/((finishTime - startTime)/60000); //FYI - 60K is number of milliseconds in minute
    console.log("Raw WPM: " + wpm); //output
    let freebieErrors = lettersExpectedTotal*.05; //no penalty if errors are under 5% of chars
    console.log("Freebie errors: " + nf(freebieErrors,1,3)); //output
    let penalty = max(errorsTotal-freebieErrors, 0) * .5;
    console.log("Penalty: " + penalty,0,3);
    console.log("WPM w/ penalty: " + (wpm-penalty)); //yes, minus, becuase higher WPM is better
    console.log("==================");
    currTrialNum++; //increment by one so this message only appears once when all trials are done
    return;
  }

  if (startTime==0) //first trial starting now
  {
    console.log("Trials beginning! Starting timer..."); //output we're done
    startTime = millis(); //start the timer!
  } 
  else
  {
    currTrialNum++; //increment trial number
  }

  lastTime = millis(); //record the time of when this trial ended
  currentTyped = ""; //clear what is currently typed preparing for next trial
  currentPhrase = phrases[currTrialNum]; // load the next phrase!
  //currentPhrase = "abc"; // uncomment this to override the test phrase (useful for debugging)
}




