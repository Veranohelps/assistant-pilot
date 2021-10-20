import { ITheme } from '../types/theme';

const appTheme: ITheme = {
  colors: {
    layout: {
      primaryColor: '#F3CE7D',
      accentColor: '#FFDA8A',
      bgPrimaryColor: '#F7F2EC',
      bgAccentColor: '#fff',
      bgPrimaryColor2: '#ECE5FF',
    },
    text: {
      primary: '#17161B',
      primary600: '#17161b99',
      accent: '#F7F7F7',
    },
  },
  text: {
    style: {
      sm12: {
        weight: 'normal',
        size: 12,
      },
      sm14: {
        weight: 'normal',
        size: 14,
      },
      sm16: {
        weight: 'normal',
        size: 16,
      },
      sm18: {
        weight: 'normal',
        size: 18,
      },
      md20: {
        weight: 'normal',
        size: 20,
      },
      md24: {
        weight: 'normal',
        size: 24,
      },
      lg36: {
        weight: 'normal',
        size: 36,
      },
    },
  },
  button: {
    flat: {
      color: '#fff',
      borderRadius: '4px',
      backgroundColor: '#21007A',
      borderColor: '#21007A',
      loaderColor: '#fff',
    },
  },
};

export default appTheme;
