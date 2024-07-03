import { css } from "styled-components";
export const grayScale150 = '#e3e3e3';
export const grayScale100 = '#f5f5f5';
export const grayScale200 = '#dbd9d9';
export const grayScale500 = '#adadad';
export const grayScale700 = '#575757';

export const defaultBorder = `1px solid ${grayScale200}`;
export const lightBorder = `1px solid ${grayScale100}`;
export const darkBorder = `1px solid ${grayScale500}`;


export const RowBorder = css({
    borderBottom: defaultBorder,
});
