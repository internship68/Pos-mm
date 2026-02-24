import { Role } from '../../../common/enums/role.enum';

export class RegisterDto {
  email: string;
  password: string;
  name: string;
  role?: Role;
}
