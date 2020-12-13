import styled from "styled-components"
import { Contacts } from "../Contacts/Contacts"
import { contactReducer } from '../../state/Contact/reducer/contactReducer';
import { ContactContext } from '../../state/Contact/context/ContactContext';

import dynamic from 'next/dynamic'
import { useContext, useReducer } from "react";

const WrapperDiv = styled.div`
  display: grid;
  grid-template-columns: 100vw;
  grid-template-rows: 100vh;
  background-color: #161616;
`;

const TitleStyles = styled.div`
  z-index: 10;
  grid-row: 1;
  color: white;
  grid-column: 1;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  display: grid;
  grid-template-rows: 1fr;
  text-align: center;

  div {
    letter-spacing: .1em;

    @media (max-width: 768px) {
      position: relative;
      top: -6.5vh;
    }

    @media (min-width: 768px) {
      letter-spacing: .3em;
    }
  }

  h1 {
    font-size: 20px;
    font-family: 'Alata', sans-serif;

    @media (min-width: 768px) {
      font-size: 30px;
    }
  }
`;

const SubTitleStyles = styled.p`
  font-family: sans-serif;
  font-size: 9px;
  padding-top: 4px;

  @media (min-width: 768px) {
    font-size: 11px;
  }
`;

const Shape = dynamic(() => import('../Shape/Shape').then((mod) => mod.Shape), { ssr: false });

export const Wrapper = () => {
  const globalState = useContext(ContactContext);
  const [state, dispatch] = useReducer(contactReducer, globalState);

  return (
    <ContactContext.Provider value={{state, dispatch}}>
      <WrapperDiv>
        <TitleStyles>
          <div>
            <h1>Daniele  Meli</h1>
            <SubTitleStyles>Front end software engineer</SubTitleStyles>
          </div>
          <Contacts />
        </TitleStyles>
        <Shape />
      </WrapperDiv>
    </ContactContext.Provider>
  )
}