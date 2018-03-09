import { InjectionToken } from '@angular/core';
import { NgfmConnector } from './ngfm-connector';
export * from './ngfm-connector';
export * from './ngfm-memory-connector';
export * from './ngfm-upload-status';
export const NGFM_CONNECTOR = new InjectionToken<NgfmConnector>('ngfm_connector');