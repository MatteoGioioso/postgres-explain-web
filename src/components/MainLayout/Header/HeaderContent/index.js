// material-ui
import {Box, IconButton, Stack, Link, Typography, useMediaQuery, Button} from '@mui/material';
import {GithubOutlined} from '@ant-design/icons';
import {Link as RouterLink} from 'react-router-dom';

// project import
import Search from './Search';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
    const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('md'));

    return (
        <>
            {!matchesXs && <Search/>}

            {matchesXs && <Box sx={{width: '100%', ml: 1}}/>}

            <Button component={RouterLink} to={'/'}>
                <Box sx={{flexShrink: 0, ml: 0.75, pr: 1.5}}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{p: 0.5}}>
                        <Typography variant="subtitle1">Postgres Explain</Typography>
                    </Stack>
                </Box>
            </Button>

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
        </>
    );
};

export default HeaderContent;
