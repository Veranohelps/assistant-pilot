import React from 'react';
import { createGlobalStyle, StyleSheetManager, ThemeProvider } from 'styled-components';
import appTheme from '../config/appTheme';
import { appEnv } from '../config/environment';

interface IProps {
  children: React.ReactNode;
}

const GlobalStyle = createGlobalStyle`
* {
  margin: 0;
  padding: 0;
  font-size: 1em;
  box-sizing: border-box;
}
body {
  font-family: 'fira sans';
  height: 100%;
  background-color: #ffffff;
}

#root {
  height: 100%;
}

div, input {
  box-sizing: border-box;
}
a {
  text-decoration: none;
  font-family: inherit;
}

html {
    height: 100%;
    font-size: 1rem;
  }`;

const AppThemeProvider = (props: IProps) => {
  return (
    <StyleSheetManager disableVendorPrefixes={appEnv === 'local'}>
      <ThemeProvider theme={appTheme}>
        <GlobalStyle />
        {props.children}
      </ThemeProvider>
    </StyleSheetManager>
  );
};

export default AppThemeProvider;
