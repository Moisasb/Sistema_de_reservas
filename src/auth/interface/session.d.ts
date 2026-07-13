import 'express-session';

declare module 'express-session' {
  interface SessionData {
    usuario?: {
      nome: string;
      email: string;
      loginEm: string;
    };
  }
}
