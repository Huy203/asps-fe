import { LoggingActionEnum } from "../enums";

export type LoggingAction = {
  action: LoggingActionEnum;
  createdAt: string;
  updatedAt: string;
};

export type Logging = {
  [LoggingActionEnum.CREATE_TASK]: LoggingAction[];
  [LoggingActionEnum.UPDATE_TASK]: LoggingAction[];
  [LoggingActionEnum.DELETE_TASK]: LoggingAction[];
  [LoggingActionEnum.UPDATE_FOCUS_DURATION]: LoggingAction[];
};
