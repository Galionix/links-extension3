import { TLink } from '../store';

export const MessageType = {
  CHECK_FOR_UPDATE: 'CHECK_FOR_UPDATE',
} as const;

export const MessageResponse = {
  UPDATED: 'UPDATED',
  UPDATE_ERROR: 'UPDATE_ERROR',
} as const;

export const checkForUpdate = {
  type: MessageType.CHECK_FOR_UPDATE,
};
export type TCheckForUpdate = typeof checkForUpdate;

export type TUpadatedMessage = {
  type: typeof MessageResponse.UPDATED;
  payload: TLink[];
};

export type TUpdateErrorMessage = {
  type: typeof MessageResponse.UPDATE_ERROR;
  reason: string;
};
