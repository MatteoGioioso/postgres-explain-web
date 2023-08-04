export default function TableRow(theme) {
    return {
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&.MuiTableRow-root:hover td': {
                        // border: `2px solid ${theme.palette.secondary['100']}`,
                        backgroundColor: `${theme.palette.secondary.lighter}`,
                    },
                }
            }
        }
    };
}
