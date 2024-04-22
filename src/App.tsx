const App = () => {
  const {conditions: c} = useLocalStorage();
  const inputRef = useRef<HTMLInputElement|null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [formstate, setFormstate] = useState<IState>(c);
  const s = useMemo(() => {
      console.log("CHANGED");
      let show = Object.values(formstate).every(c => c === false)
      if(show) return true;
      return false;
  }, [formstate]);
  const [showModal, setShowModal] = useState<boolean>(s);
  const theme = useTheme();
  const [emailFeedback, setEmailFeedback] = useState<string|null>(null);
  const [passwordStrength, setPasswordStrength] = useState<'easy'|'medium'|'hard'>('easy');
  const [passwordFeedback, setPasswordFeedback] = useState<string|null>(null);
  const [isPresent, _] = useState<IState>({        
    uppercase: false,
    lowercase: false,
    number: false,
    special_character: false,
    length: false
  });


  function closeModal(){
    setShowModal(() => false);
  }

  function isHard(p: string){
    let regex = new RegExp(/^[a-zA-Z0-9@#$%^!&+=*.\-_]{10,}$/gm);
    return regex.test(p);
  }

  function isMedium(p: string){
    let regex = new RegExp(/^[a-zA-Z@#$%^!&+=*.\-_]{3,}$/gm);
    return regex.test(p);
  }

  function togglePasswordView(e: ChangeEvent<HTMLInputElement>){
    if(e.target.checked) inputRef.current!.type = 'text';
    else inputRef.current!.type = 'password';
  }

  return (
    <AppWrapper>
      <AppContainer>
        <div style={{backgroundColor: passwordStrength === 'easy' ? theme.error.main : passwordStrength === 'medium' ? theme.warning.main : theme.success.main}}></div>
        <section>
          {showModal ? <SettingsModal formstate={formstate} setFormstate={setFormstate} closeModal={closeModal} /> : null}
          <span onClick={_ => setShowModal(() => true)}>
            <MdSettings />
          </span>
          <h2>Sign Up</h2>
          <p>Let's get you started on a 30 day free trial account on FoodCourt</p>
          <Form>

            <FormContainer $invalid={!!emailFeedback}>
              <label>Email</label>
              <input type="email" value={email} readOnly={s} placeholder="Enter email" 
              onChange={e => {
                let valid = validateEmail(e.target.value);
                if(!valid){
                  setEmailFeedback(() => "Email address not valid")
                }else {
                  setEmailFeedback(() => null);
                }
                setEmail(() => e.target.value)
              }} 
              />
              {
                emailFeedback ? 
                (
                  <Feedback>
                    <MdInfo />
                    <i>{emailFeedback}</i>
                  </Feedback>
                ) : null
              }
            </FormContainer>

            <FormContainer $invalid={!!passwordFeedback}>
              <label>Password</label>
              <input ref={inputRef} type="password" readOnly={s} value={password} placeholder="Enter password"
              onChange={e => {
                let newPassword = e.target.value;
                let hasNumber = /\d/.test(newPassword);
                let hasUppercase = /[A-Z]/.test(newPassword);
                let hasLowercase = /[a-z]/.test(newPassword);
                let hasSpecialChar = /[!@#$%^&*()]/.test(newPassword);
                if(hasNumber){
                  isPresent["number"] = true;
                }else {
                  isPresent["number"] = false;
                }
                if(hasUppercase){
                  isPresent["uppercase"] = true;
                }else {
                  isPresent["uppercase"] = false;
                }
                if(hasLowercase){
                  isPresent["lowercase"] = true;
                }else {
                  isPresent["lowercase"] = false;
                }
                if(hasSpecialChar){
                  isPresent["special_character"] = true;
                }else {
                  isPresent["special_character"] = false;
                }
                if(newPassword.length >= 8){
                  isPresent["length"] = true;
                }else {
                  isPresent["length"] = false;
                }
                if(isMedium(newPassword)){
                  setPasswordStrength(() => 'medium');
                }else if(isHard(newPassword)){
                  setPasswordStrength(() => 'hard');
                }else {
                  setPasswordStrength(() => 'easy');
                }
                Object.entries(formstate).forEach(([k, v], _) => {
                  if(v){
                    if(!(isPresent as any)[k]){
                      switch(k){
                        case 'uppercase':
                          setPasswordFeedback(() => 'Uppercase character missing');
                          break;
                        case 'lowercase':
                          setPasswordFeedback(() => 'Lowercase character missing');
                          break;
                        case 'number':
                          setPasswordFeedback(() => 'Number missing');
                          break;
                        case 'special_character':
                          setPasswordFeedback(() => 'Special character missing');
                          break;
                        case 'length':
                          setPasswordFeedback(() => 'Password must be greater than 8 characters');
                          break;
                      }
                    }else {
                      setPasswordFeedback(() => null);
                    }
                  }
                })

                setPassword(() => newPassword);
              }}  />
              {
                passwordFeedback ? 
                (
                  <Feedback>
                    <MdInfo />
                    <i>{passwordFeedback}</i>
                  </Feedback>
                ) : null
              }
              <aside>
                <PasswordStrength>
                  Password strength: <span style={{color: passwordStrength === 'easy' ? theme.error.main : passwordStrength === 'medium' ? theme.warning.main : theme.success.main}}>{passwordStrength}</span>
                </PasswordStrength>
                <p><input type="checkbox" readOnly={s} onChange={togglePasswordView} /> Show Password</p>
              </aside>
              <PasswordHints>
                {
                  conditions.map(({key, value}, i) => (
                    (formstate as any)[key] ? <p key={i} style={{color: (isPresent as any)[key] ? theme.success.main : theme.error.main}}><span>{(isPresent as any)[key] ? <BsCheck /> : <MdClear />}</span> {value}</p> : null
                  ))
                }
              </PasswordHints>
            </FormContainer>

            <FormContainer $invalid={false}>
              <button disabled={!!password || !!email || s || !!emailFeedback || !!passwordFeedback}>Sign Up</button>
            </FormContainer>

          </Form>
        </section>
      </AppContainer>
    </AppWrapper>
  )
}



import { ChangeEvent, useMemo, useRef, useState } from "react";
import styled, { useTheme } from "styled-components";
import { BsCheck } from "react-icons/bs";
import {MdSettings, MdClear, MdInfo} from "react-icons/md";


import SettingsModal, { conditions } from "./components/SettingsModal";
import useLocalStorage from "./hooks/useLocalStorage";
import validateEmail from "./utils/validate-email.util";


export type IState = {
  uppercase: boolean,
  lowercase: boolean,
  number: boolean,
  special_character: boolean,
  length: boolean
}


const AppWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: ${props => props.theme.primary.dark};
  // display: flex;
  // align-items: center;
  // justify-content: center;
  padding-top: 100px;
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: min(100% - 0.25rem, 500px);
  margin-inline: auto;

  > div {
    width: 100%;
    height: 15px;
  }

  > section {
    width: 100%;
    background-color: ${props => props.theme.primary.main};
    padding: 40px 20px;
    border-radius: 16px;
    box-shadow: 0px 2px 5px #ccc;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;

    > span {
      position: absolute;
      top: 20px;
      right: 20px;
      box-shadow: 0px 2px 5px #ccc;
      padding: 5px;
      border-radius:4px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      &:hover {
        scale: 1.03;
      }

      > svg {
        font-size: 1.5rem;
      }
    }

    > h2 {
      margin-bottom: 10px;
    }

    > p {
      text-align: center;
      font-size: 0.9rem;
    }
  }
`;

const Form = styled.form`
  margin-top: 30px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormContainer = styled.div<{$invalid: boolean}>`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;

  > label {
    font-size: 0.8rem;
  }

  > input {
    padding: 4px;
    outline: none;
    line-height: 2;
    border-radius: 8px;
    border: 1px solid ${props => props.$invalid ? 'red' : props.theme.primary.dark};
  }

  > button {
    width: 100%;
    padding: 10px;
    cursor: pointer;
    background-color: ${props => props.theme.secondary.main};
    border: none;
    color: ${props => props.theme.primary.main};
    border-radius: 8px;
    opacity: 1;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }

  >aside {
    display: flex;
    align-items: center;
    justify-content: space-between;

    > p {
      font-size: 0.7rem;
      margin-top: 5px;
      align-self: flex-end;
      cursor: pointer;
    }
  }
`;


const PasswordHints = styled.div`
  > p {
    font-size: 0.7rem;
    display: flex;
    align-items: center;
    gap: 5px;
  }
`;


const Feedback = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  color: red;
  font-size: 0.7rem;

  > svg {
    font-size: 0.9rem;
  }
`;


const PasswordStrength = styled.div`
  font-size: 0.7rem;

  > span {
    text-transform: capitalize;
    font-weight: 700;
  }
`;
export default App;