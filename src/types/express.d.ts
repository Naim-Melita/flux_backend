export {};

declare global {
  namespace Express {
    namespace Multer {
      interface File {
        secure_url?: string;
      }
    }

    interface Request {
      user?: any;
    }
  }
}
