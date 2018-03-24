import { InjectionToken } from "@angular/core";
import { NgfmConnector } from "./ngfm-connector";
import { NgfmRestConfig } from './rest/ngfm-rest.config';

export const NGFM_CONNECTOR = new InjectionToken<NgfmConnector>('ngfm_connector');
export const NGFM_REST_CONFIG = new InjectionToken<NgfmRestConfig>('ngfm_rest_config');