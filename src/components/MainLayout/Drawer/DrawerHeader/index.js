import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import {Stack, Chip, Typography} from '@mui/material';

// project import
import DrawerHeaderStyled from './DrawerHeaderStyled';

// ==============================|| DRAWER HEADER ||============================== //

const DrawerHeader = ({ open }) => {
  const theme = useTheme();

  return (
    // only available in paid version
    <DrawerHeaderStyled theme={theme} open={open}>
      <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant='h5'>Postgres Explain</Typography>
        <Chip
          label={'v0.1'}
          size="small"
          sx={{ height: 16, '& .MuiChip-label': { fontSize: '0.625rem', py: 0.25 } }}
          component="a"
          href="https://github.com/MatteoGioioso/postgres-explain-web"
          target="_blank"
          clickable
        />

      </Stack>
    </DrawerHeaderStyled>
  );
};

export default DrawerHeader;
