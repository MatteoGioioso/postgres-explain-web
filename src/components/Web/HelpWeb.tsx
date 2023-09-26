import MainCard from "../CoreModules/MainCard";
import {Alert, AlertTitle, Box, Grid, Link, Typography} from "@mui/material";
import React from "react";
import {ShareAltOutlined, UploadOutlined} from "@ant-design/icons";
import Highlight from 'react-highlight'
import {ButtonAction} from "../CoreModules/Buttons";


const HelpWeb = () => {
    return (
        <MainCard contentSX={{width: '50%', margin: 'auto'}}>
            <Grid
                container
                spacing={0}
                direction="column"
                justifyContent="center"
            >
                <Typography variant='h2'>Welcome</Typography>
                <br/>
                <Typography variant='h5' fontWeight='100'>Welcome to Pgex, an advanced PostgreSQL query plan visualizer</Typography>
                <br/>
                <Alert severity="warning">
                    <AlertTitle>
                        <Typography variant='h5'>
                            Please keep in mind that this is still a beta version, thus data model and APIs might change unexpectedly
                        </Typography>
                    </AlertTitle>
                    <Typography>
                        If you encounter any issue, feel free to open an issue on: {` `}
                        <Link
                            href="https://github.com/MatteoGioioso/postgres-explain/issues" target='_blank'>
                            Github
                        </Link>
                    </Typography>
                </Alert>
                <br/>
                <Typography variant='h5' fontWeight='100'>
                    This tool accept any kind of text format, but to get the best out of it I recommend using the following command: <br/>
                    <Highlight className='sql'>EXPLAIN (ANALYZE, FORMAT JSON, BUFFERS, VERBOSE) ...</Highlight>
                    Also be sure to paste your original query. <br/><br/>
                    If you don't understand something you can try to hover on it, most of the things have explanatory tooltip. If you still
                    have problems, don't hesitate to open a new issue
                </Typography>
                <br/>
                <Typography variant='h3'>Plan sharing</Typography>
                <br/>
                <Typography variant='h5' fontWeight='100'>
                    <Alert severity="warning">
                        <Typography fontWeight='bolder'>
                            Pgex public website does not store or save any information in the server, instead it uses wasm to process your
                            plan and save all your data in the client
                        </Typography>
                    </Alert><br/>
                    If you want to share a plan with your friends or colleagues you can click on the
                    share <ShareAltOutlined/> button,
                    it
                    will download the JSON of your processed plan.
                    Your colleagues can then import it using the upload <UploadOutlined/> button.
                    <br/>
                    <b>The possibility to save plans in the server is already in the roadmap</b>
                </Typography>
                <br/>
                <Typography variant='h3'>Plans comparison</Typography>
                <br/>
                <Alert severity="warning">
                    <Typography>
                        This feature is still experimental
                    </Typography>
                </Alert>
                <br/>
                <Typography variant='h5' fontWeight='100'>
                    One of the feature that distinguish Pgex is the plans comparison.
                    Once you discovered your query's bottlenecks, you can try to optimize it and <code>EXPLAIN</code> a new plan; by
                    clicking on
                    the <ButtonAction title="Optimize"/> button, you can associates this new plan with the initial one. <br/>
                    you will see now that a new tab <b>Optimizations</b> has
                    appeared on the plan visualization, if you click on it you will see all the optimizations associated with your initial
                    plan and their behaviour through time. Click on the selections drop down under <b>Compare plans</b> and select the plan
                    ids you wish to compare. <br/><br/>
                    After you have clicked on <ButtonAction size='small' variant='contained' title="Compare"/> you will be displayed with
                    the side by side diagram nodes.
                    On the <b>Stats</b> tab you can see the difference on overall plan statistics. <br/>

                </Typography>
                <br/>
                <Typography variant='h4'>Nodes comparison</Typography>
                <br/>
                <Typography variant='h5' fontWeight='100'>
                    <b>You can also select one node per side to see the detailed difference between them</b>.
                    <br/><br/>

                    <Alert severity="info">
                        <Typography>
                            Sometimes comparing nodes together might be meaningless, you will be display with a warning on why this may be
                            the case. However use your own judgment
                        </Typography>
                    </Alert>
                    <br/>
                </Typography>
            </Grid>
        </MainCard>
    )
}

export default HelpWeb