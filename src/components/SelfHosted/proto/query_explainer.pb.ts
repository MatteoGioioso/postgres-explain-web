/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as fm from "./fetch.pb"
import * as GoogleProtobufTimestamp from "./google/protobuf/timestamp.pb"
export type GetQueryPlanRequest = {
  period_start_from?: GoogleProtobufTimestamp.Timestamp
  period_start_to?: GoogleProtobufTimestamp.Timestamp
  cluster_name?: string
  query_id?: string
  namespace?: string
  parameters?: string[]
}

export type GetQueryPlanResponse = {
  query_id?: string
  query_plan?: string
}

export class QueryExplainer {
  static GetQueryPlan(req: GetQueryPlanRequest, initReq?: fm.InitReq): Promise<GetQueryPlanResponse> {
    return fm.fetchReq<GetQueryPlanRequest, GetQueryPlanResponse>(`/v0/explain/GetQueryPlan`, {...initReq, method: "POST", body: JSON.stringify(req, fm.replacer)})
  }
}