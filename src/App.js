import React, {useState, useEffect} from 'react';
import zxcvbn from 'zxcvbn';
import './App.css';
import { Input, Message, Progress } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import styled from 'styled-components';


function App() {
  let [password, setPassword] = useState("")
  let [lightMode, setLightMode] = useState(false);
  let [selected, setSelected] = useState("");
  let issues = zxcvbn(password);
  console.log(issues)
  return (
    <div className="center">
      <div className="title">HOW STRONG IS YOUR PASSWORD?</div>
      <Input id="password" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="ENTER PASSWORD"/>
      <Score percent={issues.score}/>
      <Guess guesses={issues.guesses}/>
      <Atlas hook={setSelected}/>
      {issues.feedback.suggestions != "" && (selected == "" || selected == "Suggestion") ? issues.feedback.suggestions.map((issue, key) => (
        <Suggestion key={key} body={issue}/>
      )) : null}
      {issues.feedback.warning != "" && (selected == "" || selected == "Warning") ? <Warning body={issues.feedback.warning}/> : null}
      {(selected == "" || selected == "Time") ? 
        <Time verySlow={issues.crack_times_display.online_throttling_100_per_hour} 
            slow={issues.crack_times_display.online_no_throttling_10_per_second} 
            fast={issues.crack_times_display.offline_slow_hashing_1e4_per_second}
            veryFast={issues.crack_times_display.offline_fast_hashing_1e10_per_second}/> 
        : null}
      {(selected == "" || selected == "Pattern") ?
        <div>
          {issues.sequence.map((pattern, key) => (
            <Pattern pattern={pattern} key={key}/>
          ))} 
        </div> 
        : null}
    </div>
  );
}

function Score(props){
  return (
    <Progress className="score" percent={((props.percent+1)/5)*100} indicating/>
  )
}

export const GuessMessage = styled(Message)`
  text-align: center;
  width: 20vw;
  margin: 0 auto !important;
  margin-bottom: 2vh !important;
  background: rgba(255, 255, 255, 0.05) !important;
`

function Guess(props){
  return (
      <GuessMessage color="purple" className="guess">FOUND IN {props.guesses} GUESSES!</GuessMessage>
  )
}

function Options(props){
  return (
    <div></div>
  )
}

function Time(props){
  return (
    <div>
      <ListMessage color="blue" className="time">Very Slow: {props.verySlow} (100 Attempts per hour)</ListMessage>
      <ListMessage color="blue" className="time">Slow: {props.slow} (10 Attempts per second)</ListMessage>
      <ListMessage color="blue" className="time">Fast: {props.fast} (1000 Attempts per second)</ListMessage>
      <ListMessage color="blue" className="time">Very Fast: {props.veryFast} (1 Billion Attempts per second)</ListMessage>
    </div>
  )
}

function Warning(props){
  return (
    <ListMessage color="red" className="warning">
      {props.body}
    </ListMessage>
  )
}

export const AtlasMessage = styled(Message)`
  width: 6vw;
  margin: 0 2vw !important;  
  background: rgba(255, 255, 255, 0.05) !important;
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
  }

  @media (max-width: 676px) {
    margin: 0 !important;
    padding: 0em !important;
  }
`;

export const ListMessage = styled(Message)`
  margin: 2vh auto !important;
  background: rgba(255, 255, 255, 0.05) !important;
`;

function Atlas(props){
  return (
    <div className="atlas">
      <AtlasMessage onClick={() => props.hook("Warning")} color="red" >Warning</AtlasMessage>
      <AtlasMessage onClick={() => props.hook("Suggestion")} color="yellow">Suggestions</AtlasMessage>
      <AtlasMessage onClick={() => props.hook("")} style={{boxShadow: "0 0 0 1px white inset, 0 0 0 0 transparent", color: "white"}}>All</AtlasMessage>
      <AtlasMessage onClick={() => props.hook("Pattern")} color="green">Patterns</AtlasMessage>
      <AtlasMessage onClick={() => props.hook("Time")} color="blue">Times</AtlasMessage>
    </div>
  )
}

export const SuggestionMessage = styled(Message)`
  margin: 1vh auto !important;
  background: rgba(255, 255, 255, 0.05) !important;
`

function Pattern(props){
  return (
    <ListMessage color="green" className="pattern">
      <div>TOKEN: {props.pattern.token}</div>
      <div>PATTERN: {props.pattern.pattern}</div>
      {props.pattern.pattern == "dictionary" ? <div>DICTIONARY NAME: {props.pattern.pattern}</div> : null}
    </ListMessage>
  )
}

function Suggestion(props){
  return (
    <SuggestionMessage color="yellow" className="issue">
      {props.body != undefined ? props.body : null}
    </SuggestionMessage>
  )
}


export default App;
