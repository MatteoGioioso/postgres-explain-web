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

export type Cluster = {
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
}