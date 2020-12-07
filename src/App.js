import { Wrapper } from './components/Wrapper/Wrapper';
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: sans-serif;
  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <Wrapper />
    </>
  );
}

export default App;
