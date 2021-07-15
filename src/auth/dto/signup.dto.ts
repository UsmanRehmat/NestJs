import { IsString, MaxLength, MinLength } from "class-validator";

export class AuthCredentialDto {
    @IsString()
    @MaxLength(20)
    @MinLength(4)
    username: string;
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    password: string;
}