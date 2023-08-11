import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {QueryPlan} from "../SelfHosted/services/QueryExplainer.service";
import {Typography} from "@mui/material";

interface PlansListDropdownProps {
    items: QueryPlan[]
    currentPlanId: string
    onClick?: (itemId: string) => void
}

export default function PlansListDropdown({items, onClick, currentPlanId}: PlansListDropdownProps) {
    const handleChange = (event: SelectChangeEvent) => {
        onClick(event.target.value)
    };

    return (
        <Box sx={{ minWidth: 300 }}>
            <FormControl fullWidth>
                <InputLabel id="plans">Plan ID</InputLabel>
                <Select
                    labelId="plans"
                    id="plans"
                    label="Plans"
                    value={currentPlanId}
                    onChange={handleChange}
                    size='small'
                >
                    {items.map(item => (
                        <MenuItem key={item.id} value={item.id}>
                            {item.alias || item.id}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}
