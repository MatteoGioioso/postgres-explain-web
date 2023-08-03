/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as fm from "./fetch.pb"
import * as GoogleProtobufTimestamp from "./google/protobuf/timestamp.pb"
export type SaveQueryPlanRequest = {
  period_start_from?: GoogleProtobufTimestamp.Timestamp
  period_start_to?: GoogleProtobufTimestamp.Timestamp
  cluster_name?: string
  query_id?: string
  query?: string
  database?: string
  namespace?: string
  parameters?: string[]
}

export type SaveQueryPlanResponse = {
  plan_id?: string
}

export type GetQueryPlanRequest = {
  plan_id?: string
}

export type GetQueryPlanResponse = {
  query_id?: string
  plan_id?: string
  query_plan?: string
  query_original_plan?: string
  query_fingerprint?: string
  query?: string
}

export type GetQueryPlansListRequest = {
  period_start_from?: GoogleProtobufTimestamp.Timestamp
  period_start_to?: GoogleProtobufTimestamp.Timestamp
  cluster_name?: string
  limit?: string
  order?: string
  query_fingerprint?: string
  tracking_id?: string
}

export type GetQueryPlansListResponse = {
  plans?: PlanItem[]
}

export type PlanItem = {
  id?: string
  alias?: string
  period_start?: GoogleProtobufTimestamp.Timestamp
  query?: string
  tracking_id?: string
}

export class QueryExplainer {
  static SaveQueryPlan(req: SaveQueryPlanRequest, initReq?: fm.InitReq): Promise<SaveQueryPlanResponse> {
    return fm.fetchReq<SaveQueryPlanRequest, SaveQueryPlanResponse>(`/v0/explain/SaveQueryPlan`, {...initReq, method: "POST", body: JSON.stringify(req, fm.replacer)})
  }
  static GetQueryPlan(req: GetQueryPlanRequest, initReq?: fm.InitReq): Promise<GetQueryPlanResponse> {
    return fm.fetchReq<GetQueryPlanRequest, GetQueryPlanResponse>(`/v0/explain/GetQueryPlan`, {...initReq, method: "POST", body: JSON.stringify(req, fm.replacer)})
  }
  static GetQueryPlansList(req: GetQueryPlansListRequest, initReq?: fm.InitReq): Promise<GetQueryPlansListResponse> {
    return fm.fetchReq<GetQueryPlansListRequest, GetQueryPlansListResponse>(`/v0/explain/GetQueryPlansList`, {...initReq, method: "POST", body: JSON.stringify(req, fm.replacer)})
  }
}