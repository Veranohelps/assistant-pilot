export interface ITextTheme {
  size: number;
  weight: string | number;
  height?: number;
  opacity?: number;
}

export interface IButtonTheme {
  borderRadius: string;
  backgroundColor: string;
  borderColor: string;
  color: string;
  loaderColor: string;
}

export interface ITheme {
  colors: {
    layout: {
      primaryColor: string;
      accentColor: string;
      bgPrimaryColor: string;
      bgAccentColor: string;
      bgPrimaryColor2: string;
    };
    text: {
      primary: string;
      primary600: string;
      accent: string;
    };
  };
  text: {
    style: {
      sm12: ITextTheme;
      sm14: ITextTheme;
      sm16: ITextTheme;
      sm18: ITextTheme;
      md20: ITextTheme;
      md24: ITextTheme;
      lg36: ITextTheme;
    };
  };
  button: {
    flat: IButtonTheme;
  };
}

export interface IAppTheme extends ITheme {}
