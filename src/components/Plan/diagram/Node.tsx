// @ts-nocheck
// material-ui
import { Box, Chip, Grid, Stack, Typography } from '@mui/material';

// project import
import MainCard from '../../MainCard';

// assets
import { RiseOutlined, FallOutlined } from '@ant-design/icons';

// ==============================|| STATISTICS - ECOMMERCE CARD  ||============================== //

const Node = ({ color, title, count, percentage, isLoss, extra }) => (
    <MainCard contentSX={{ p: 2.25 }} sx={{width: '350px'}} boxShadow>
        <Stack spacing={0.5}>

            <Grid container alignItems="center">
                {/*<Grid item>*/}
                {/*    <Typography variant="p" color="inherit">*/}
                {/*        {count}*/}
                {/*    </Typography>*/}
                {/*</Grid>*/}
                <Typography variant="h5" color="bold">
                    {title}
                </Typography>
                {percentage && (
                    <Grid item>
                        <Chip
                            variant="combined"
                            style={{backgroundColor: color}}
                            icon={
                                <>
                                    {!isLoss && <RiseOutlined style={{ fontSize: '0.75rem', color: 'inherit' }} />}
                                    {isLoss && <FallOutlined style={{ fontSize: '0.75rem', color: 'inherit' }} />}
                                </>
                            }
                            label={`${percentage} ms`}
                            sx={{ ml: 1.25, pl: 1 }}
                            size="small"
                        />
                    </Grid>
                )}
            </Grid>
        </Stack>
        <Box sx={{ pt: 2.25 }}>
            <Typography variant="caption" color="textSecondary">
                <Typography component="span" variant="caption" sx={{ color: `${color || 'primary'}.main` }}>
                    {extra}
                </Typography>{' '}
            </Typography>
        </Box>
    </MainCard>
);

Node.defaultProps = {
    color: 'primary'
};

export default Node;