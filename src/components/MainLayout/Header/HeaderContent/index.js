// material-ui
import {Box, IconButton, Stack, Link, Typography, useMediaQuery, Button} from '@mui/material';
import {GithubOutlined} from '@ant-design/icons';
import {Link as RouterLink, useLocation} from 'react-router-dom';

// project import
import Search from './Search';

const HeaderContent = () => {
    const {pathname} = useLocation();

    return (
        <>
            {pathname !== '/' && (
                <Button component={RouterLink} to={'/'} variant='outlined' sx={{ml: 1, pt: 0.3, pb: 0.3}}>
                    <Box sx={{flexShrink: 0}}>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{p: 0.5}}>
                            <Typography variant="subtitle1">+ New Plan</Typography>
                        </Stack>
                    </Box>
                </Button>
            )}
            {/*{!matchesXs && <Search/>}*/}

            <Box sx={{width: '100%', ml: 1}}/>

            <Box sx={{flexShrink: 0, ml: 0.75, pr: 1.5}}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{p: 0.5}}>
                    <Typography variant="subtitle1">Postgres Explain</Typography>
                </Stack>
            </Box>

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
