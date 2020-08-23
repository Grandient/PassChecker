import React, {useState ,useEffect ,useRef } from 'react';
import zxcvbn from 'zxcvbn';
import './App.css';
import { Input, Message, Progress, Modal, Header} from 'semantic-ui-react';
import {FaRegLightbulb} from 'react-icons/fa';
import 'semantic-ui-css/semantic.min.css';
import styled from 'styled-components';

function App() {
  let [password, setPassword] = useState("")
  let [lightMode, setLightMode] = useState(false);
  let [selected, setSelected] = useState("");
  let [showInfo, setShowInfo] = useState(false);
  let issues = zxcvbn(password);
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
      <Score percent={issues.score} lightMode={lightMode}/>
      <Guess guesses={issues.guesses} hookLight={setLightMode} info={showInfo} hookInfo={setShowInfo} lightMode={lightMode}/>
      <Atlas lightMode={lightMode} hook={setSelected}/>
      <ListMessage lightMode={lightMode}>
        {issues.feedback.warning != "" && (selected == "" || selected == "Warning") ? <Warning lightMode={lightMode} body={issues.feedback.warning}/> : null}
        {issues.feedback.suggestions != "" && (selected == "" || selected == "Suggestion") ? issues.feedback.suggestions.map((issue, key) => (
          <Suggestion lightMode={lightMode} key={key} body={issue}/>
        )) : null}
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

export const ElemScore = styled(Progress)`
  .label {
    color: ${props => props.lightMode ? "black !important" : "white !important"};
    margin-top: -2.5vh !important;
  }
`;
function Score(props){
  return (
    <ElemScore lightMode={props.lightMode} className="score" percent={((props.percent+1)/5)*100} indicating>
        {((props.percent+1)/5) * 5} / 5
    </ElemScore>
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
    margin-right: 0.5vw !important;
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
  @media (max-width: 768px) {
    width: 14vw;
  }
  @media (max-width: 425px) {
    width: auto;
    margin-right: 0.5vw !important;
  }
`;

function Guess(props){
  return (
    <div className="options">
      <GuessMessage lightMode={props.lightMode} color="purple">FOUND IN {props.guesses} GUESSES!</GuessMessage>
      <Options lightMode={props.lightMode} info={props.info} hookLight={props.hookLight} hookInfo={props.hookInfo}/>
    </div>
  )
}


export const MHeader = styled(Header)`
  background: rgba(0, 0, 0, 0.9) !important;
  border-bottom: 1px solid white !important;
  color: white !important;
`

export const MContent = styled(Modal.Content)`
  background: rgba(0, 0, 0, 0.9) !important;
  color: white !important;
`

function Options(props){
    let style = null;
  if(!props.lightMode){
    style={boxShadow: "0 0 0 1px white inset, 0 0 0 0 transparent", color: "white"}
  }
  return (
    <div style={{display:"flex"}}>
      <Info info={props.info} hook={props.hookInfo} lightMode={props.lightMode}/>
      <OptionMessage lightMode={props.lightMode} onClick={() => props.hookLight(!props.lightMode)} className="info" style={style}><FaRegLightbulb/></OptionMessage>
    </div>
  )
}

function Info(props) {
  let style = null;
  if(!props.lightMode){
    style={boxShadow: "0 0 0 1px white inset, 0 0 0 0 transparent", color: "white", width: "100%"}
  }
  return (
    <Modal
      closeIcon
      open={props.info}
      trigger={<OptionMessage lightMode={props.lightMode} color="teal" className="info">Info</OptionMessage>}
      onClose={() => props.hook(false)}
      onOpen={() => props.hook(true)}
    >
      <MHeader content='Information' />
      <MContent>
        Welcome! This is StrongPass Password Strength Estimation.
        <br/> 
        This info box gives more information regarding each of the four categories as well as some various other tips.  
        <br/> 
        <SuggestionMessage style={style} lightMode={props.lightMode} color="white">
          1 Too guessable: risky password. (guesses less than 10^3)
          <br/>
          2 Very guessable: protection from throttled online attacks. (guesses less than 10^6)
          <br/>
          3 Somewhat guessable: protection from unthrottled online attacks. (guesses less than 10^8)
          <br/>
          4 Safely unguessable: moderate protection from offline slow-hash scenario. (guesses less than 10^10)
          <br/>
          5 Very unguessable: strong protection from offline slow-hash scenario. (guesses greater than 10^10)
        </SuggestionMessage>
        <SuggestionMessage style={{width: "100%"}} lightMode={props.lightMode} color="red" className="warning">
            Explainations of the errors in a particular password.  
        </SuggestionMessage>
        <SuggestionMessage style={{width: "100%"}} lightMode={props.lightMode} color="yellow" className="issue">
            A list of suggestions to help choose a less guessable password.
        </SuggestionMessage>
        <SuggestionMessage style={{width: "100%"}} lightMode={props.lightMode} color="blue" className="time">
            Very Slow: Online attack on a service that ratelimits password auth attempts.
            <br/>
            Slow: Online attack on a service that doesn't ratelimit, or where an attacker has outsmarted ratelimiting.
            <br/>
            Fast: Offline attack that assumes multiple attackers, proper user-unique salting, and a slow hash function. (bcrypt, scrypt, PBKDF2)
            <br/>
            Very Fast: Offline attack with user-unique salting but a fast hash function. (SHA-1, SHA-256 or MD5).
        </SuggestionMessage>
        <SuggestionMessage style={{width: "100%"}} lightMode={props.lightMode} color="green" className="pattern">
            Bruteforce: Token is found by doing a bruteforce search on all possible character combinations.
            <br/>
            Sequence: Token is found by searching common sequences.
            <br/>
            Dictionary: Token is found by searching a dictionary.
            <br/>
            Repeated: Token is found by looking at a previous part of the whole password.
        </SuggestionMessage>
      </MContent>
    </Modal>
  )
}

function Time(props){
  return (
    <div className="times">
      <SuggestionMessage lightMode={props.lightMode} color="blue" className="time">Very Slow: {props.verySlow} (100 Attempts per hour)</SuggestionMessage>
      <SuggestionMessage lightMode={props.lightMode} color="blue" className="time">Slow: {props.slow} (10 Attempts per second)</SuggestionMessage>
      <SuggestionMessage lightMode={props.lightMode} color="blue" className="time">Fast: {props.fast} (1000 Attempts per second)</SuggestionMessage>
      <SuggestionMessage lightMode={props.lightMode} color="blue" className="time">Very Fast: {props.veryFast} (1 Billion Attempts per second)</SuggestionMessage>
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
