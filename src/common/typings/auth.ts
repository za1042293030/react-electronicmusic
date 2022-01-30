import { AuthAdmin, AuthUser } from '../enums';
import { JwtPayload } from 'jsonwebtoken';

interface IJwtPayload extends JwtPayload {
  id: number;
  isAdmin: boolean;
}

type Auth = AuthUser | AuthAdmin;
export type { Auth, IJwtPayload };
