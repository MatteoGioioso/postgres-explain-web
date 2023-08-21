import {Box, IconButton, Stack, Link, Typography, Chip} from '@mui/material';
import {GithubOutlined} from '@ant-design/icons';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import Search from '../MainLayout/Header/HeaderContent/Search';
import PlansListDropdown from "../CoreModules/PlansListDropdown";
import {queryExplainerService} from "./ioc";
import {useEffect, useState} from "react";
import {ButtonLink} from "../CoreModules/Buttons";

const HeaderContent = () => {
    const {pathname} = useLocation();
    const {plan_id} = useParams();
    const navigate = useNavigate();
    const [plansList, setPlansList] = useState([])

    useEffect(() => {
        const queryPlansList = queryExplainerService.getQueryPlansList();
        setPlansList(queryPlansList)
    }, [plan_id]);


    function getContentBasedOnPath(pathname) {
        switch (true) {
            case pathname === "/":
                return <></>
            case pathname.includes("/comparisons"):
                return (
                    <>
                        <ButtonLink to={'/'} title="+ New Plan" variant='outlined'/>
                    </>
                )
            default:
                return (
                    <>
                        <ButtonLink to={'/'} title="+ New Plan" variant='outlined'/>
                        <Box sx={{pl: 2}}>
                            <PlansListDropdown
                                items={plansList}
                                currentPlanId={plan_id}
                                onClick={(id) => navigate(`/plans/${id}`)}
                            />
                        </Box>
                    </>
                )
        }
    }

    return (
        <>
            <ButtonLink to={'/docs'} title="Help" variant='contained'/>

            {getContentBasedOnPath(pathname)}
            {/*{!matchesXs && <Search/>}*/}

            <Box sx={{width: '100%', ml: 1}}/>

            <Box sx={{flexShrink: 0, ml: 0.75, pr: 1.5}}>
                <Stack direction="row" spacing={0.5} alignItems="center" sx={{p: 0.5}}>
                    <Typography fontFamily='Comfortaa' sx={{fontWeight: 'bold'}} variant="h4">Pgex</Typography>
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
                href="https://github.com/MatteoGioioso/postgres-explain"
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
