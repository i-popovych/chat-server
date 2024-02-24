import { IsEmail, IsString, Length } from 'class-validator';

export class AuthDto {
  @IsEmail({}, { message: 'Wrong email' })
  readonly email: string;

  @IsString()
  @Length(3, 8, { message: 'Wrong length of field' })
  readonly password: string;

  @IsString()
  @Length(3, 8, { message: 'Wrong length of field' })
  readonly username: string;
}
