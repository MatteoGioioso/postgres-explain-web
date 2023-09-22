/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as fm from "./fetch.pb"
import * as GoogleProtobufTimestamp from "./google/protobuf/timestamp.pb"
import * as BorealisV1beta1Shared from "./shared.pb"
export type GetProfileRequest = {
  period_start_from?: GoogleProtobufTimestamp.Timestamp
  period_start_to?: GoogleProtobufTimestamp.Timestamp
  cluster_name?: string
}

export type GetProfileResponse = {
  traces?: {[key: string]: Trace}
  current_cpu_cores?: number
}

export type Trace = {
  x_values_timestamp?: GoogleProtobufTimestamp.Timestamp[]
  x_values_float?: number[]
  x_values_string?: string[]
  y_values_float?: number[]
  x_values_metadata?: {[key: string]: Metadata}
  color?: string
}

export type Metadata = {
  meta?: string[]
}

export type QueriesMetrics = {
  metrics?: {[key: string]: BorealisV1beta1Shared.MetricValues}
}

export type GetTopQueriesRequest = {
  period_start_from?: GoogleProtobufTimestamp.Timestamp
  period_start_to?: GoogleProtobufTimestamp.Timestamp
  cluster_name?: string
}

export type GetTopQueriesResponse = {
  traces?: {[key: string]: Trace}
  queries_metrics?: {[key: string]: QueriesMetrics}
}

export type GetQueryDetailsRequest = {
  period_start_from?: GoogleProtobufTimestamp.Timestamp
  period_start_to?: GoogleProtobufTimestamp.Timestamp
  cluster_name?: string
  query_id?: string
}

export type GetQueryDetailsResponse = {
  traces?: {[key: string]: Trace}
}

export type GetTopWaitEventsLoadByGroupNameRequest = {
  period_start_from?: GoogleProtobufTimestamp.Timestamp
  period_start_to?: GoogleProtobufTimestamp.Timestamp
  cluster_name?: string
  group_name?: string
}

export type GetTopWaitEventsLoadByGroupNameResponse = {
  traces?: {[key: string]: Trace}
  groups?: string
}

export class Activities {
  static GetProfile(req: GetProfileRequest, initReq?: fm.InitReq): Promise<GetProfileResponse> {
    return fm.fetchReq<GetProfileRequest, GetProfileResponse>(`/v0/activities/GetProfile`, {...initReq, method: "POST", body: JSON.stringify(req, fm.replacer)})
  }
  static GetTopQueries(req: GetTopQueriesRequest, initReq?: fm.InitReq): Promise<GetTopQueriesResponse> {
    return fm.fetchReq<GetTopQueriesRequest, GetTopQueriesResponse>(`/v0/activities/GetTopQueries`, {...initReq, method: "POST", body: JSON.stringify(req, fm.replacer)})
  }
  static GetQueryDetails(req: GetQueryDetailsRequest, initReq?: fm.InitReq): Promise<GetQueryDetailsResponse> {
    return fm.fetchReq<GetQueryDetailsRequest, GetQueryDetailsResponse>(`/v0/activities/GetQueryDetails`, {...initReq, method: "POST", body: JSON.stringify(req, fm.replacer)})
  }
  static GetTopWaitEventsLoadByGroupName(req: GetTopWaitEventsLoadByGroupNameRequest, initReq?: fm.InitReq): Promise<GetTopWaitEventsLoadByGroupNameResponse> {
    return fm.fetchReq<GetTopWaitEventsLoadByGroupNameRequest, GetTopWaitEventsLoadByGroupNameResponse>(`/v0/activities/GetTopWaitEventsLoadByGroupName`, {...initReq, method: "POST", body: JSON.stringify(req, fm.replacer)})
  }
}