export type IErrorsMode = 'silent' | 'console' | 'exception';

export interface ITypedError {
  message: string;
  code: string;
}
