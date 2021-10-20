import * as CSS from 'csstype';
import styled, { css } from 'styled-components';
import { toRem } from '../utils/style';

type ListProperties = string | number | (string | number)[];

const listPropsToString = (prop: ListProperties) => {
  if (typeof prop === 'string') return prop;
  if (typeof prop === 'number') return toRem(prop);

  return toRem(...prop);
};

interface ILayoutProps {
  margin?: ListProperties;
  mBottom?: number | CSS.Properties['marginBottom'];
  mTop?: number | CSS.Properties['marginTop'];
  mRight?: number | CSS.Properties['marginRight'];
  mLeft?: number | CSS.Properties['marginLeft'];
  pBottom?: number | CSS.Properties['paddingBottom'];
  pTop?: number | CSS.Properties['paddingTop'];
  pRight?: number | CSS.Properties['paddingRight'];
  pLeft?: number | CSS.Properties['paddingLeft'];
  padding?: ListProperties;
  height?: number | CSS.Properties['height'];
  width?: number | CSS.Properties['width'];
  maxWidth?: number | CSS.Properties['maxWidth'];
  maxHeight?: number | CSS.Properties['maxHeight'];
  minWidth?: number | CSS.Properties['minWidth'];
  minHeight?: number | CSS.Properties['minHeight'];
  overflow?: CSS.Properties['overflow'];
  overflowX?: CSS.Properties['overflowX'];
  overflowY?: CSS.Properties['overflowY'];
  bgColor?: CSS.Properties['backgroundColor'];
  bdRadius?: ListProperties;
  bdColor?: CSS.Properties['borderColor'];
  bdWidth?: ListProperties;
  bdStyle?: CSS.Properties['borderStyle'];
  shadow?: CSS.Properties['boxShadow'];
  filter?: CSS.Properties['filter'];
}

interface IGridBoxProps {
  direction?: 'row' | 'column';
  gap?: number;
  inline?: boolean;
  align?: CSS.Properties['alignItems'];
  justify?: CSS.Properties['justifyContent'];
  $alignItems?: CSS.Properties['alignItems'];
  columns?: string;
  rows?: string;
  box?: ILayoutProps;
}

interface IFlexBoxProps {
  direction?: 'row' | 'column';
  inline?: boolean;
  align?: CSS.Properties['alignItems'];
  justify?: CSS.Properties['justifyContent'];
  box?: ILayoutProps;
}

export const layoutMixin = (p: ILayoutProps) => {
  return css`
    ${p.margin ? `margin: ${listPropsToString(p.margin)}` : ''};
    ${p.mBottom ? `margin-bottom: ${toRem(p.mBottom)}` : ''};
    ${p.mTop ? `margin-top: ${toRem(p.mTop)}` : ''};
    ${p.mLeft ? `margin-left: ${toRem(p.mLeft)}` : ''};
    ${p.mRight ? `margin-right: ${toRem(p.mRight)}` : ''};
    ${p.padding ? `padding: ${listPropsToString(p.padding)}` : ''};
    ${p.pBottom ? `padding-bottom: ${listPropsToString(p.pBottom)}` : ''};
    ${p.pTop ? `padding-top: ${listPropsToString(p.pTop)}` : ''};
    ${p.pLeft ? `padding-left: ${listPropsToString(p.pLeft)}` : ''};
    ${p.pRight ? `padding-right: ${listPropsToString(p.pRight)}` : ''};
    ${p.height ? `height: ${toRem(p.height)}` : ''};
    ${p.width ? `width: ${toRem(p.width)}` : ''};
    ${p.maxHeight ? `max-height: ${toRem(p.maxHeight)}` : ''};
    ${p.maxWidth ? `max-width: ${toRem(p.maxWidth)}` : ''};
    ${p.minHeight ? `min-height: ${toRem(p.minHeight)}` : ''};
    ${p.minWidth ? `min-width: ${toRem(p.minWidth)}` : ''};
    ${p.overflow ? `overflow: ${p.overflow}` : ''};
    ${p.overflowX ? `overflow-x: ${p.overflowX}` : ''};
    ${p.overflowY ? `overflow-y: ${p.overflowY}` : ''};
    ${p.bgColor ? `background-color: ${p.bgColor}` : ''};
    ${p.bdRadius ? `border-radius:  ${listPropsToString(p.bdRadius)}` : ''};
    ${p.bdColor ? `border-color: ${p.bdColor}` : ''};
    ${p.bdWidth ? `border-width: ${listPropsToString(p.bdWidth)}` : ''};
    ${p.bdColor || p.bdWidth ? `border-style: ${p.bdStyle ?? 'solid'}` : ''}
    ${p.shadow ? `box-shadow: ${p.shadow}` : ''};
    ${p.filter ? `filter: ${p.filter}` : ''};
  `;
};

export const gridBoxMixin = (p: IGridBoxProps) => css`
  display: ${p.inline ? 'inline-grid' : 'grid'};
  ${p.direction ? `grid-auto-flow: ${p.direction}` : ''};
  gap: ${(p.gap ?? 0) / 16}rem;
  ${p.rows ? `grid-template-rows: ${p.rows}` : ''};
  ${p.columns ? `grid-template-columns: ${p.columns}` : ''};
  align-items: ${p.align ?? 'center'};
  justify-content: ${p.justify ?? 'start'};

  ${p.box ? layoutMixin(p.box) : ''}
`;

export const GridBox = styled.div<IGridBoxProps>`
  ${gridBoxMixin}
`;

export const flexBoxMixin = (p: IFlexBoxProps) => css`
  display: ${p.inline ? 'inline-flex' : 'flex'};
  ${p.direction ? `flex-direction: ${p.direction === 'column' ? 'row' : 'column'}` : ''};
  align-items: ${p.align ?? 'center'};
  justify-content: ${p.justify ?? 'center'};

  ${p.box ? layoutMixin(p.box) : ''}
`;

export const FlexBox = styled.div<IFlexBoxProps>`
  ${flexBoxMixin}
`;

export interface IBoxProps extends ILayoutProps {
  grid?: IGridBoxProps;
  flex?: IFlexBoxProps;
}

export const boxMixin = (p: IBoxProps) => css`
  ${p.flex ? flexBoxMixin(p.flex) : ''}
  ${p.grid ? gridBoxMixin(p.grid) : ''}
  ${layoutMixin(p)}
`;

export const Box = styled.div<IBoxProps>`
  ${boxMixin}
`;

export const boxBorder = (
  width: number,
  style: CSS.Properties['borderStyle'],
  color: string,
  radius?: number
): IBoxProps => {
  return {
    bdColor: color,
    bdStyle: style,
    bdWidth: width,
    bdRadius: radius,
  };
};
