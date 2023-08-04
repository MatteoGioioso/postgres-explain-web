// ==============================|| OVERRIDES - TABLE CELL ||============================== //

export default function TableCell(theme) {
  return {
    MuiTableCell: {
      styleOverrides: {

        root: {
          fontSize: '0.875rem',
          padding: 12,
          borderColor: theme.palette.divider,
          '&.MuiTableCell-root:hover td': {
            // border: `2px solid ${theme.palette.secondary['100']}`,
            backgroundColor: `${theme.palette.secondary.lighter} !important`,
          },
        },
        head: {
          fontWeight: 600,
          paddingTop: 20,
          paddingBottom: 20
        }
      }
    }
  };
}
