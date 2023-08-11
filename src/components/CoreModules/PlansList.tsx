import {useNavigate} from "react-router-dom";
import {Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography} from "@mui/material";
import {GenericDetailsPopover} from "./GenericDetailsPopover";
import {CopyToClipboardButton} from "./CopyToClipboard";
import Highlight from "react-highlight";
import {ConsoleSqlOutlined} from "@ant-design/icons";
import React from "react";
import {QueryPlan} from "../SelfHosted/services/QueryExplainer.service";

interface PlansListProps {
    items: QueryPlan[]
    clusterId?: string
    onClick?: (item: QueryPlan) => void
}

export function PlansList(props: PlansListProps) {
    const navigate = useNavigate();
    const onClick = (item: QueryPlan) => {
        navigate(`/clusters/${props.clusterId}/plans/${item.id}`)
    }

    const getPrimaryText = (item: QueryPlan) => {
      if (item.alias) {
          return <>{item.alias} ({item.id})</>
      }

      return <>{item.id}</>
    }

    return (
        <List
            sx={{width: '100%', bgcolor: 'background.paper'}}
        >
            {props.items.map(item => (
                <ListItem key={item.id} disablePadding>
                    <ListItemButton onClick={() => props.onClick ? props.onClick(item) : onClick(item)}>
                        <ListItemText primary={getPrimaryText(item)} secondary={item.period_start.toISOString()}/>
                    </ListItemButton>
                    <GenericDetailsPopover
                        name={"query"}
                        content={
                            <>
                                <Box sx={{pb: 2}}>
                                    <CopyToClipboardButton data={item.query}/>
                                </Box>
                                <Highlight className='sql'>
                                    {item.query}
                                </Highlight>
                            </>
                        }
                    >
                        <ListItemIcon>
                            <ConsoleSqlOutlined/>
                        </ListItemIcon>
                    </GenericDetailsPopover>
                </ListItem>
            ))}
        </List>
    );
}