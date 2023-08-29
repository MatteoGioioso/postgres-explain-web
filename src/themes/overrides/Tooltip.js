// ==============================|| OVERRIDES - TABLE CELL ||============================== //

export default function TableCell(theme) {
    return {
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    fontSize: '1rem',
                    border: `1px solid ${theme.palette.secondary.dark}`,
                    color: theme.palette.secondary.dark,
                    backgroundColor: theme.palette.secondary['A100']
                }
            }
        }
    }
}
