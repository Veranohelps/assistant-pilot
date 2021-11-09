import * as CSS from 'csstype';
import { merge } from 'lodash';
import styled, { css } from 'styled-components';
import appTheme from '../config/appTheme';
import { ITextTheme, ITheme } from '../types/theme';
import { boxMixin, IBoxProps } from './Layout';

const toEm = (...pxs: (number | string)[]) => {
  return pxs.map((px) => (typeof px === 'number' ? `${(px / 16).toFixed(2)}em` : px)).join(' ');
};

export interface ITypographyProps {
  textStyle?: keyof ITheme['text']['style'];
  textColor?: keyof ITheme['colors']['text'];
  textTheme?: Partial<ITextTheme>;
  textAlign?: CSS.Properties['textAlign'];
  display?: CSS.Properties['display'];
  clip?: boolean;
  ellipsis?: boolean;
  nowrap?: boolean;
  textTransform?: CSS.Properties['textTransform'];
  decoration?: CSS.Properties['textDecoration'];
  box?: IBoxProps;
}

export const typographyMixin = (props: ITypographyProps) => {
  const txtTheme = merge({}, appTheme.text.style[props.textStyle ?? 'sm14'], props.textTheme);

  return css`
    text-align: ${props.textAlign || 'left'};
    letter-spacing: 0px;
    display: ${props.display ? props.display : props.textAlign ? 'block' : 'inline-block'};
    font-size: ${(p) => toEm(txtTheme.size)};
    font-weight: ${(p) => txtTheme.weight};
    font-family: 'fira sans';
    line-height: ${(p) => toEm(txtTheme.height ?? 'normal')};
    color: ${(p) => p.theme.colors.text[props.textColor ?? 'primary']};
    font-style: normal;
    font-variant: normal;
    opacity: ${(p) => txtTheme.opacity ?? 1};
    overflow: ${props.clip || props.ellipsis ? 'hidden' : 'initial'};
    text-overflow: ${props.clip ? 'clip' : props.ellipsis ? 'ellipsis' : 'initial'};
    white-space: ${props.clip || props.ellipsis || props.nowrap ? 'pre' : 'pre-wrap'};
    width: ${props.clip || props.ellipsis ? '100%' : 'initial'};
    text-transform: ${props.textTransform ?? 'initial'};
    text-decoration: ${props.decoration ?? 'initial'};
    ${props.box ? boxMixin(props.box) : ''};
  `;
};
const validateProps = (prop: string) => {
  return ![
    'textColor',
    'textStyle',
    'textTheme',
    'textAlign',
    'ellipsis',
    'nowrap',
    'clip',
    'textTransform',
  ].includes(prop);
};

export const Typography = styled('span').withConfig({
  shouldForwardProp: (prop) => validateProps(prop),
})<ITypographyProps>`
  ${(props) => typographyMixin(props)}
`;
