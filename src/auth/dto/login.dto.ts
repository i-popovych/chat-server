import { IsEmail, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Wrong email' })
  readonly email: string;

  @IsString()
  @Length(3, 8, { message: 'Wrong length of field' })
  readonly password: string;
}
