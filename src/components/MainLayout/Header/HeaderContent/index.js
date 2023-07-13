// material-ui
import {Box, IconButton, Link, Stack, Typography, useMediaQuery} from '@mui/material';
import {GithubOutlined} from '@ant-design/icons';

// project import
import Search from './Search';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
    const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('md'));

    return (
        <>
            {!matchesXs && <Search/>}
            {matchesXs && <Box sx={{width: '100%', ml: 1}}/>}

            <IconButton
                component={Link}
                href="https://github.com/MatteoGioioso/postgres-explain-web"
                target="_blank"
                disableRipple
                color="secondary"
                title="Download Free Version"
                sx={{color: 'text.primary', bgcolor: 'grey.100'}}
            >
                <GithubOutlined/>
            </IconButton>

            <Box sx={{flexShrink: 0, ml: 0.75}}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{p: 0.5}}>
                    <Typography variant="subtitle1">Postgres Explain</Typography>
                </Stack>
            </Box>
        </>
    );
};

export default HeaderContent;
