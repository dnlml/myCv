import styled from "styled-components"
import { Shape } from "../Shape/Shape"
import { Contacts } from "../Contacts/Contacts"

const WrapperDiv = styled.div`
  display: grid;
  grid-template-columns: 100vw;
  grid-template-rows: 100vh;
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

  h1 {
    font-family: 'Alata', sans-serif;
    font-size: 30px;
    letter-spacing: .3em;
  }
`;

const SubTitleStyles = styled.p`
  font-family: sans-serif;
  font-size: 11px;
  padding-top: 4px;
  letter-spacing: .3em;
`;

export const Wrapper = () => {
  return (
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
  )
}