import { InjectionToken } from "@angular/core";
import { NgfmConnector } from "./ngfm-connector";

export const NGFM_CONNECTOR = new InjectionToken<NgfmConnector>('ngfm_connector');