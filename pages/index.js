import { Wrapper } from '../components/Wrapper/Wrapper';
import { createGlobalStyle } from 'styled-components'
import Head from 'next/head';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: sans-serif;
  }

  body {
    overflow: hidden;
    height: 100vh;
  }
`;

const App = () => {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Alata&display=swap" rel="stylesheet" />
        <title>Daniele Meli</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="Daniele Meli Website"
        />
      </Head>
      <GlobalStyle />
      <Wrapper />
    </>
  );
}

export default App;
