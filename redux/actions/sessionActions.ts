import { createAction } from '@reduxjs/toolkit';

/** Clear all user-scoped Redux data while preserving public app configuration. */
export const clearUserSession = createAction('session/clearUserSession');
