import React from 'react';
import styled, { css } from 'styled-components';
import { ITextTheme, ITheme } from '../types/theme';
import { boxMixin, IBoxProps } from './Layout';
import { ITypographyProps, typographyMixin } from './Typography';

export interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  buttonStyle?: keyof ITheme['button'];
  textStyle?: keyof ITheme['text']['style'];
  textColor?: keyof ITheme['colors']['text'];
  textTheme?: Partial<ITextTheme>;
  box?: IBoxProps;
  typography?: ITypographyProps;
}

export const buttonMixin = (props: IButtonProps) => {
  return css`
    display: inline-flex;
    justify-content: center;
    align-items: center;
    position: relative;
    background: ${(p) => p.theme.button[props.buttonStyle ?? 'flat'].backgroundColor};
    border: 1px solid ${(p) => p.theme.button[props.buttonStyle ?? 'flat'].borderColor};
    padding: 8px 17px;
    ${typographyMixin(props.typography ? props.typography : { textStyle: 'sm14', display: 'inline-flex' })}
    color: ${(p) =>
      props.textColor
        ? p.theme.colors.text[props.textColor]
        : p.theme.button[props.buttonStyle ?? 'flat'].color};
    font-style: normal;
    font-variant: normal;
    border-radius: ${(p) => p.theme.button[props.buttonStyle ?? 'flat'].borderRadius};
    opacity: 1;
    cursor: pointer;
    outline: none;
    min-width: 100px;
    overflow: hidden;
    white-space: pre-wrap;
    ${props.box ? boxMixin(props.box) : ''};

    &:disabled {
      cursor: not-allowed;
      background-color: #747474;
      border: none;
    }
  `;
};

export const Button = styled.button<IButtonProps>`
  ${buttonMixin}
`;

export const PlainButton = styled.button.attrs({ type: 'button' })<{ box?: IBoxProps }>`
  background: none;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  ${(p) => (p.box ? boxMixin(p.box) : '')};

  &:disabled {
    cursor: not-allowed;
  }
`;
