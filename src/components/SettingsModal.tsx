const SettingsModal = ({closeModal, formstate, setFormstate}: ISettingsModal) => {
    const {setItem} = useLocalStorage();


    function handleChange(e: ChangeEvent<HTMLInputElement>){
        const {name, checked} = e.target;
        setItem(name as Items, checked);
        setFormstate(old => {
            return {
                ...old,
                [name]: checked
            }
        })
    }
    return (
        <SettingsWrapper>
            <SettingsContainer>
                <SettingsTop>
                    <h3>Set password strength criteria</h3>
                    <span onClick={closeModal}><MdClear /></span>
                </SettingsTop>
                <SettingsBox>
                    {
                        conditions.map(({key, value}, i) => (
                            <Settings key={i}>
                                <input type="checkbox" name={key} checked={(formstate as any)[key]} onChange={handleChange} /> 
                                <p>{value}</p>
                            </Settings>
                        ))
                    }
                </SettingsBox>
            </SettingsContainer>
        </SettingsWrapper>
    )
}




import { ChangeEvent, MouseEvent } from "react"
import styled from "styled-components"
import {MdClear} from "react-icons/md";
import useLocalStorage, { Items } from "../hooks/useLocalStorage";
import { IState } from "../App";



type ISettingsModal = {
    closeModal: (e: MouseEvent<HTMLSpanElement>) => void,
    formstate: IState,
    setFormstate: React.Dispatch<React.SetStateAction<IState>>
}

const SettingsWrapper = styled.div`
    position:fixed;
    top: 0;
    bottom:0;
    left: 0;
    right: 0;
    background-color: rgba(0,0,0,.5);
    display: flex;
    justify-content: center;
    z-index: 100;
    padding-top: 100px;
`;

const SettingsBox = styled.div`
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    gap: 25px;
`;

const SettingsContainer = styled.div`
    width: min(100% - 1rem, 500px);
    background-color: ${props => props.theme.primary.main};
    padding: 60px 40px;
    border-radius: 16px;
    box-shadow: 0px 2px 5px #ccc;
    height: fit-content;
`;

const SettingsTop = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 800;

    > h3 {
        font-size: 0.8rem;
        text-transform: uppercase;
    }

    > span {
        cursor: pointer;
    }
`;

const Settings = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;

    > p {
        font-size: 0.9rem;
    }

    >input {
        outline: none;

        &[type=number] {
            text-align: center;
            border: 2px solid ${props => props.theme.primary.dark}
        }
    }
`;



export const conditions = [
    {
        key: 'uppercase',
        value: 'At least 1 uppercase'
    },
    {
        key: 'lowercase',
        value: 'At least 1 lowercase'
    },
    {
        key: 'number',
        value: 'At least 1 figure'
    },
    {
        key: 'special_character',
        value: 'At least 1 special character - !@#$%^&*()'
    },
    {
        key: 'length',
        value: 'At least 8 characters long'
    },
]

export default SettingsModal;