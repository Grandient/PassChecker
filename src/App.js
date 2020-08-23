import React, {useState, useEffect} from 'react';
import zxcvbn from 'zxcvbn';
import './App.css';
import { Input, Message, Progress } from 'semantic-ui-react';
import {FaRegLightbulb} from 'react-icons/fa';
import 'semantic-ui-css/semantic.min.css';
import styled from 'styled-components';


function App() {
  let [password, setPassword] = useState("")
  let [lightMode, setLightMode] = useState(false);
  let [selected, setSelected] = useState("");
  let [showInfo, setShowInfo] = useState(false);
  let issues = zxcvbn(password);
  let bodyStyle = null;
  let textStyle = null;

  if(lightMode){
    textStyle = {color: "black"}
    addBodyClass("light")()
  } else {
    textStyle = {color: "white"}
    addBodyClass("dark")()
  }

  return (
    <div className="center">
      <div style={textStyle} className="title">HOW STRONG IS YOUR PASSWORD?</div>
      <Password lightMode={lightMode} style={textStyle} id="password" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="ENTER PASSWORD"/>
      <Score percent={issues.score}/>
      <Guess guesses={issues.guesses} hook={setLightMode} lightMode={lightMode}/>
      <Atlas lightMode={lightMode} hook={setSelected}/>
      <ListMessage lightMode={lightMode}>
        {issues.feedback.suggestions != "" && (selected == "" || selected == "Suggestion") ? issues.feedback.suggestions.map((issue, key) => (
          <Suggestion lightMode={lightMode} key={key} body={issue}/>
        )) : null}
        {issues.feedback.warning != "" && (selected == "" || selected == "Warning") ? <Warning lightMode={lightMode} body={issues.feedback.warning}/> : null}
        {(selected == "" || selected == "Time") ? 
          <Time lightMode={lightMode} verySlow={issues.crack_times_display.online_throttling_100_per_hour} 
              slow={issues.crack_times_display.online_no_throttling_10_per_second} 
              fast={issues.crack_times_display.offline_slow_hashing_1e4_per_second}
              veryFast={issues.crack_times_display.offline_fast_hashing_1e10_per_second}/> 
          : null}
        {(selected == "" || selected == "Pattern") ?
          <div className="times">
            {issues.sequence.map((pattern, key) => (
              <Pattern lightMode={lightMode} pattern={pattern} key={key}/>
            ))} 
          </div> 
          : null}
      </ListMessage>
    </div>
  );
}

export const Password = styled(Input)`
  input {
    color: ${props => props.lightMode ? "black !important" : "white !important"};
  }
`;

function Score(props){
  return (
    <Progress className="score" percent={((props.percent+1)/5)*100} indicating/>
  )
}

export function addBodyClass(className) {
  return () => useEffect(() => {
    document.body.classList.add(className);
    return () => { document.body.classList.remove(className); }
  });
}

export const GuessMessage = styled(Message)`
  text-align: center;
  width: 20vw;
  margin: 0 auto !important;
  margin-bottom: 2vh !important;
  background: ${props => props.lightMode ? props.color : 'rgba(255, 255, 255, 0.05) !important'};
  @media (max-width: 425px) {
    width: auto;
    margin-right: 5vw !important;
  }
`;

export const OptionMessage = styled(Message)`
  text-align: center;
  width: 7.5vw;
  margin: auto 0.2vw !important;
  margin-bottom: 2vh !important;
  background: ${props => props.lightMode ? props.color : 'rgba(255, 255, 255, 0.05) !important'};
  color: ${props => props.color == "white" ? "black" : "auto"};
  cursor: pointer;
  @media (max-width: 425px) {
    width: auto;
    margin-right: 5vw !important;
  }
`;

function Guess(props){
  return (
    <div className="options">
      <GuessMessage lightMode={props.lightMode} color="purple">FOUND IN {props.guesses} GUESSES!</GuessMessage>
      <Options lightMode={props.lightMode} hook={props.hook}/>
    </div>
  )
}

function Options(props){
    let style = null;
  if(!props.lightMode){
    style={boxShadow: "0 0 0 1px white inset, 0 0 0 0 transparent", color: "white"}
  }
  return (
    <div style={{display:"flex"}}>
      <OptionMessage lightMode={props.lightMode} color="teal" className="info">Info</OptionMessage>
      <OptionMessage lightMode={props.lightMode} onClick={() => props.hook(!props.lightMode)} className="info" style={style}><FaRegLightbulb/></OptionMessage>
    </div>
  )
}

function Time(props){
  return (
    <div className="times">
      <ListMessage lightMode={props.lightMode} color="blue" className="time">Very Slow: {props.verySlow} (100 Attempts per hour)</ListMessage>
      <ListMessage lightMode={props.lightMode} color="blue" className="time">Slow: {props.slow} (10 Attempts per second)</ListMessage>
      <ListMessage lightMode={props.lightMode} color="blue" className="time">Fast: {props.fast} (1000 Attempts per second)</ListMessage>
      <ListMessage lightMode={props.lightMode} color="blue" className="time">Very Fast: {props.veryFast} (1 Billion Attempts per second)</ListMessage>
    </div>
  )
}

function Warning(props){
  return (
    <SuggestionMessage lightMode={props.lightMode} color="red" className="warning">
      {props.body}
    </SuggestionMessage>
  )
}

export const AtlasMessage = styled(Message)`
  width: 6vw;
  margin: 0 2vw !important;  
  background: ${props => props.lightMode ? null : 'rgba(255, 255, 255, 0.05) !important'};
  cursor: pointer;
  @media (max-width: 1242px) {
    margin: 0 1vw !important;
    width: 9vw;
  }

  @media (max-width: 968px) {
    margin: 0 0.5vw !important;
    width: 11vw;
  }

  @media (max-width: 816px) {
    margin: 0 !important;
    padding: 0.5em !important;
    width: 15vw;
    height: 3vh;
  }

  @media (max-width: 676px) {
    width: 18vw;
    margin: 0 !important;
    padding: 0em !important;
  }
`;

export const ListMessage = styled(Message)`
  margin: 2vh auto !important;
  background: ${props => props.lightMode ? 'white' : 'rgba(255, 255, 255, 0.05) !important'};
`;

function Atlas(props){
  let style = null;
  if(!props.lightMode){
    style={boxShadow: "0 0 0 1px white inset, 0 0 0 0 transparent", color: "white"}
  }
  return (
    <div className="atlas">
      <AtlasMessage lightMode={props.lightMode} className="atlas-item" onClick={() => props.hook("Warning")} color="red" >Warning</AtlasMessage>
      <AtlasMessage lightMode={props.lightMode} className="atlas-item" onClick={() => props.hook("Suggestion")} color="yellow">Tips</AtlasMessage>
      <AtlasMessage lightMode={props.lightMode} className="atlas-item" onClick={() => props.hook("")} style={style}>All</AtlasMessage>
      <AtlasMessage lightMode={props.lightMode} className="atlas-item" onClick={() => props.hook("Pattern")} color="green">Patterns</AtlasMessage>
      <AtlasMessage lightMode={props.lightMode} className="atlas-item" onClick={() => props.hook("Time")} color="blue">Times</AtlasMessage>
    </div>
  )
}

export const SuggestionMessage = styled(Message)`
  margin: 1vh auto !important;
  background: ${props => props.lightMode ? 'white' : 'rgba(255, 255, 255, 0.05) !important'};
`

function Pattern(props){
  return (
    <ListMessage lightMode={props.lightMode} color="green" className="pattern">
      <div>TOKEN: {props.pattern.token}</div>
      <div>PATTERN: {props.pattern.pattern}</div>
      {props.pattern.pattern == "dictionary" ? <div>DICTIONARY NAME: {props.pattern.pattern}</div> : null}
    </ListMessage>
  )
}

function Suggestion(props){
  return (
    <SuggestionMessage lightMode={props.lightMode} color="yellow" className="issue">
      {props.body != undefined ? props.body : null}
    </SuggestionMessage>
  )
}


export default App;
