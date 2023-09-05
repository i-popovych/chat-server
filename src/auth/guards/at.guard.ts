import { AuthGuard } from '@nestjs/passport';

export class AtGuard extends AuthGuard('jwt-at') {
  constructor() {
    super();
  }
}
