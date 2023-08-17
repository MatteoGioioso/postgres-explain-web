import {Box, IconButton, Stack, Link, Typography, useMediaQuery, Button, Chip} from '@mui/material';
import {GithubOutlined} from '@ant-design/icons';
import {Link as RouterLink, useLocation, useNavigate, useParams} from 'react-router-dom';
import Search from './Search';
import PlansListDropdown from "../../../CoreModules/PlansListDropdown";
import {queryExplainerService} from "../../../Web/ioc";
import {useEffect, useState} from "react";

const HeaderContent = () => {
    const {pathname} = useLocation();
    const {plan_id} = useParams();
    const navigate = useNavigate();
    const [plansList, setPlansList] = useState([])

    useEffect(() => {
        const queryPlansList = queryExplainerService.getQueryPlansList();
        setPlansList(queryPlansList)
    }, [plan_id]);

    return (
        <>
            {(pathname !== '/' && !pathname.includes('/share')) && (
                <>
                    <Button component={RouterLink} to={'/'} variant='outlined' sx={{ml: 1, pt: 0.3, pb: 0.3, pl: 3, pr: 3}}>
                        <Box sx={{flexShrink: 0}}>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{p: 0.5}}>
                                <Typography variant="subtitle1">+ New Plan</Typography>
                            </Stack>
                        </Box>
                    </Button>

                    <Box sx={{pl: 2}}>
                        <PlansListDropdown
                            items={plansList}
                            currentPlanId={plan_id}
                            onClick={(id) => navigate(`/plans/${id}`)}
                        />
                    </Box>
                </>
            )}

            {/*{!matchesXs && <Search/>}*/}

            <Box sx={{width: '100%', ml: 1}}/>

            <Box sx={{flexShrink: 0, ml: 0.75, pr: 1.5}}>
                <Stack direction="row" spacing={0.5} alignItems="center" sx={{p: 0.5}}>
                    <Typography variant="h4">Postgres Explain</Typography>
                    <Chip
                        label={'v1.0.0-beta'}
                        size="small"
                        sx={{
                            height: 16,
                            backgroundColor: theme => theme.palette.primary[100],
                            '& .MuiChip-label': {fontSize: '0.625rem', py: 0.25}
                        }}
                        // component="a"
                        // href="https://github.com/codedthemes/mantis-free-react-admin-template"
                        // target="_blank"
                        // clickable
                    />
                </Stack>
            </Box>

            <IconButton
                component={Link}
                href="https://github.com/MatteoGioioso/postgres-explain-web"
                target="_blank"
                disableRipple
                color="secondary"
                title="Github"
                sx={{color: 'text.primary', bgcolor: 'grey.100'}}
            >
                <GithubOutlined/>
            </IconButton>
        </>
    );
};

export default HeaderContent;
