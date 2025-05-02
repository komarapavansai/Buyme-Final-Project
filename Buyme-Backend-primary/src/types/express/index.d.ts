import { Document, Model } from 'mongoose';
import { ITest } from '../../interfaces/ITest';
import { UserClaims } from '../../interfaces/IAuth'; 

declare global {
  namespace Express {
    export interface Request {
      user?: {
        user_id: number;
        email: string;
        first_name: string;
        last_name: string;
        is_admin?: boolean;
        is_staff?: boolean;
        is_super_admin?: boolean;
        [key: string]: any;
      };
    }
  }

  namespace Models {
    export type testModel = Model<ITest & Document>;
  }
}
