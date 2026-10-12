import type en from './en';

/** Every locale file must satisfy this shape; missing keys fail type-checking. */
export type Messages = typeof en;
