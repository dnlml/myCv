import { lazy, Suspense } from 'react';
import styled from "styled-components"
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

const LoadingStyles = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  font-family: 'Alata', sans-serif;
  color: white;
  background-color: #161616;
  display: flex;
  align-items:center;
  justify-content:center;
`;

const Shape = lazy(() => import('../Shape/Shape').then(module => ({ default: module.Shape })));

const renderLoader = () => <LoadingStyles><p>Loading...</p></LoadingStyles>;

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
      <Suspense fallback={renderLoader()}>
        <Shape />
      </Suspense>
    </WrapperDiv>
  )
}