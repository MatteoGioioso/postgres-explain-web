// ==============================|| OVERRIDES - TABS ||============================== //

export default function Tabs() {
    return {
        MuiTabs: {
            styleOverrides: {
                vertical: {
                    overflow: 'visible'
                },
                indicator: {
                    height: 0,
                },
            },
        }
    };
}
