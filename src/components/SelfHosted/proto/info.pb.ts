/* eslint-disable */
// @ts-nocheck
/*
* This file is a generated Typescript file for GRPC Gateway, DO NOT MODIFY
*/

import * as fm from "./fetch.pb"
export type GetClustersRequest = {
}

export type GetClustersResponse = {
  clusters?: Cluster[]
}

export type GetClusterInstancesRequest = {
  cluster_name?: string
}

export type GetClusterInstancesResponse = {
  instances?: Instance[]
}

export type Cluster = {
  id?: string
  name?: string
  hostname?: string
  port?: string
  status?: string
  status_error?: string
}

export type Instance = {
  id?: string
  name?: string
  hostname?: string
  port?: string
  status?: string
  status_error?: string
}

export class Info {
  static GetClusters(req: GetClustersRequest, initReq?: fm.InitReq): Promise<GetClustersResponse> {
    return fm.fetchReq<GetClustersRequest, GetClustersResponse>(`/v0/info/GetClusters`, {...initReq, method: "POST", body: JSON.stringify(req, fm.replacer)})
  }
  static GetClusterInstances(req: GetClusterInstancesRequest, initReq?: fm.InitReq): Promise<GetClusterInstancesResponse> {
    return fm.fetchReq<GetClusterInstancesRequest, GetClusterInstancesResponse>(`/v0/info/GetClusterInstances`, {...initReq, method: "POST", body: JSON.stringify(req, fm.replacer)})
  }
}