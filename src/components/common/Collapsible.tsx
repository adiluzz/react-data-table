import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const defaultTime = '1s';

export const Collapsible = styled(Box, {
    shouldForwardProp: (prop) => prop !== '$open' && prop !== '$time',
})<{ $open: boolean, $time?: string }>(({ $open, $time }) => ({
    display: 'block',
    overflow: $open ? 'visible' : 'hidden',
    maxHeight: $open ? "9999px" : "0",
    boxShadow: 'none !important',
    margin: 0,
    padding: 0,
    lineHeight: $open ? 'normal' : 0,
    marginTop: 0,
    transition: $open
        ? `max-height ${$time || defaultTime} ease-out`
        : `max-height ${$time || defaultTime} cubic-bezier(0, 1, 0, 1)`,
}));

