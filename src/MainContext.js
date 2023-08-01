import {createContext, useState} from "react";

import {getMode} from "./config";

export const PlanContext = createContext({});

export function PlanProvider(props) {
    const [plan, setPlan] = useState(`[
  {
    "Plan": {
      "Node Type": "Nested Loop",
      "Parallel Aware": false,
      "Async Capable": false,
      "Join Type": "Inner",
      "Startup Cost": 11272.44,
      "Total Cost": 24177.52,
      "Plan Rows": 100000,
      "Plan Width": 461,
      "Actual Startup Time": 193.352,
      "Actual Total Time": 1060.950,
      "Actual Rows": 100000,
      "Actual Loops": 1,
      "Output": ["pgbench_accounts.aid", "pgbench_accounts.bid", "pgbench_accounts.abalance", "pgbench_accounts.filler", "pb.bid", "pb.bbalance", "pb.filler"],
      "Inner Unique": true,
      "Join Filter": "(pgbench_accounts.bid = pb.bid)",
      "Rows Removed by Join Filter": 0,
      "Shared Hit Blocks": 1862,
      "Shared Read Blocks": 0,
      "Shared Dirtied Blocks": 41,
      "Shared Written Blocks": 0,
      "Local Hit Blocks": 0,
      "Local Read Blocks": 0,
      "Local Dirtied Blocks": 0,
      "Local Written Blocks": 0,
      "Temp Read Blocks": 1311,
      "Temp Written Blocks": 1315,
      "Plans": [
        {
          "Node Type": "Gather Merge",
          "Parent Relationship": "Outer",
          "Parallel Aware": false,
          "Async Capable": false,
          "Startup Cost": 11272.32,
          "Total Cost": 22669.38,
          "Plan Rows": 100000,
          "Plan Width": 97,
          "Actual Startup Time": 193.259,
          "Actual Total Time": 486.155,
          "Actual Rows": 100000,
          "Actual Loops": 1,
          "Output": ["pgbench_accounts.aid", "pgbench_accounts.bid", "pgbench_accounts.abalance", "pgbench_accounts.filler"],
          "Workers Planned": 1,
          "Workers Launched": 1,
          "Shared Hit Blocks": 1860,
          "Shared Read Blocks": 0,
          "Shared Dirtied Blocks": 41,
          "Shared Written Blocks": 0,
          "Local Hit Blocks": 0,
          "Local Read Blocks": 0,
          "Local Dirtied Blocks": 0,
          "Local Written Blocks": 0,
          "Temp Read Blocks": 1311,
          "Temp Written Blocks": 1315,
          "Plans": [
            {
              "Node Type": "Sort",
              "Parent Relationship": "Outer",
              "Parallel Aware": false,
              "Async Capable": false,
              "Startup Cost": 10272.31,
              "Total Cost": 10419.37,
              "Plan Rows": 58824,
              "Plan Width": 97,
              "Actual Startup Time": 190.465,
              "Actual Total Time": 269.543,
              "Actual Rows": 50000,
              "Actual Loops": 2,
              "Output": ["pgbench_accounts.aid", "pgbench_accounts.bid", "pgbench_accounts.abalance", "pgbench_accounts.filler"],
              "Sort Key": ["pgbench_accounts.abalance"],
              "Sort Method": "external merge",
              "Sort Space Used": 5200,
              "Sort Space Type": "Disk",
              "Shared Hit Blocks": 1860,
              "Shared Read Blocks": 0,
              "Shared Dirtied Blocks": 41,
              "Shared Written Blocks": 0,
              "Local Hit Blocks": 0,
              "Local Read Blocks": 0,
              "Local Dirtied Blocks": 0,
              "Local Written Blocks": 0,
              "Temp Read Blocks": 1311,
              "Temp Written Blocks": 1315,
              "Workers": [
                {
                  "Worker Number": 0,
                  "Actual Startup Time": 188.476,
                  "Actual Total Time": 273.173,
                  "Actual Rows": 50420,
                  "Actual Loops": 1,
                  "Sort Method": "external merge",
                  "Sort Space Used": 5288,
                  "Sort Space Type": "Disk",
                  "Shared Hit Blocks": 963,
                  "Shared Read Blocks": 0,
                  "Shared Dirtied Blocks": 21,
                  "Shared Written Blocks": 0,
                  "Local Hit Blocks": 0,
                  "Local Read Blocks": 0,
                  "Local Dirtied Blocks": 0,
                  "Local Written Blocks": 0,
                  "Temp Read Blocks": 661,
                  "Temp Written Blocks": 663
                }
              ],
              "Plans": [
                {
                  "Node Type": "Seq Scan",
                  "Parent Relationship": "Outer",
                  "Parallel Aware": true,
                  "Async Capable": false,
                  "Relation Name": "pgbench_accounts",
                  "Schema": "public",
                  "Alias": "pgbench_accounts",
                  "Startup Cost": 0.00,
                  "Total Cost": 2392.24,
                  "Plan Rows": 58824,
                  "Plan Width": 97,
                  "Actual Startup Time": 0.045,
                  "Actual Total Time": 87.221,
                  "Actual Rows": 50000,
                  "Actual Loops": 2,
                  "Output": ["pgbench_accounts.aid", "pgbench_accounts.bid", "pgbench_accounts.abalance", "pgbench_accounts.filler"],
                  "Shared Hit Blocks": 1804,
                  "Shared Read Blocks": 0,
                  "Shared Dirtied Blocks": 41,
                  "Shared Written Blocks": 0,
                  "Local Hit Blocks": 0,
                  "Local Read Blocks": 0,
                  "Local Dirtied Blocks": 0,
                  "Local Written Blocks": 0,
                  "Temp Read Blocks": 0,
                  "Temp Written Blocks": 0,
                  "Workers": [
                    {
                      "Worker Number": 0,
                      "Actual Startup Time": 0.051,
                      "Actual Total Time": 86.525,
                      "Actual Rows": 50420,
                      "Actual Loops": 1,
                      "Shared Hit Blocks": 907,
                      "Shared Read Blocks": 0,
                      "Shared Dirtied Blocks": 21,
                      "Shared Written Blocks": 0,
                      "Local Hit Blocks": 0,
                      "Local Read Blocks": 0,
                      "Local Dirtied Blocks": 0,
                      "Local Written Blocks": 0,
                      "Temp Read Blocks": 0,
                      "Temp Written Blocks": 0
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "Node Type": "Materialize",
          "Parent Relationship": "Inner",
          "Parallel Aware": false,
          "Async Capable": false,
          "Startup Cost": 0.12,
          "Total Cost": 8.14,
          "Plan Rows": 1,
          "Plan Width": 364,
          "Actual Startup Time": 0.001,
          "Actual Total Time": 0.001,
          "Actual Rows": 1,
          "Actual Loops": 100000,
          "Output": ["pb.bid", "pb.bbalance", "pb.filler"],
          "Shared Hit Blocks": 2,
          "Shared Read Blocks": 0,
          "Shared Dirtied Blocks": 0,
          "Shared Written Blocks": 0,
          "Local Hit Blocks": 0,
          "Local Read Blocks": 0,
          "Local Dirtied Blocks": 0,
          "Local Written Blocks": 0,
          "Temp Read Blocks": 0,
          "Temp Written Blocks": 0,
          "Plans": [
            {
              "Node Type": "Index Scan",
              "Parent Relationship": "Outer",
              "Parallel Aware": false,
              "Async Capable": false,
              "Scan Direction": "Forward",
              "Index Name": "pgbench_branches_pkey",
              "Relation Name": "pgbench_branches",
              "Schema": "public",
              "Alias": "pb",
              "Startup Cost": 0.12,
              "Total Cost": 8.14,
              "Plan Rows": 1,
              "Plan Width": 364,
              "Actual Startup Time": 0.033,
              "Actual Total Time": 0.034,
              "Actual Rows": 1,
              "Actual Loops": 1,
              "Output": ["pb.bid", "pb.bbalance", "pb.filler"],
              "Shared Hit Blocks": 2,
              "Shared Read Blocks": 0,
              "Shared Dirtied Blocks": 0,
              "Shared Written Blocks": 0,
              "Local Hit Blocks": 0,
              "Local Read Blocks": 0,
              "Local Dirtied Blocks": 0,
              "Local Written Blocks": 0,
              "Temp Read Blocks": 0,
              "Temp Written Blocks": 0
            }
          ]
        }
      ]
    },
    "Query Identifier": -1996360328127744072,
    "Planning": {
      "Shared Hit Blocks": 104,
      "Shared Read Blocks": 0,
      "Shared Dirtied Blocks": 0,
      "Shared Written Blocks": 0,
      "Local Hit Blocks": 0,
      "Local Read Blocks": 0,
      "Local Dirtied Blocks": 0,
      "Local Written Blocks": 0,
      "Temp Read Blocks": 0,
      "Temp Written Blocks": 0
    },
    "Planning Time": 0.695,
    "Triggers": [
    ],
    "Execution Time": 1202.369
  }
]
`);

    return (
        <PlanContext.Provider value={{plan, setPlan}}>
            {props.children}
        </PlanContext.Provider>
    );
}

export const AppFunctionalityContext = createContext({})
export const AppFunctionalityProvider = (props) => {
    const appMode = getMode()

    return (
        <AppFunctionalityContext.Provider value={{appMode}}>
            {props.children}
        </AppFunctionalityContext.Provider>
    )
}