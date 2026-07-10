import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, Matches, min, MinLength } from "class-validator";

export class RegisterDto {
    @IsString()
    //@Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @Matches(/^\S+$/, { message: 'Username cannot contain any spaces' })
    @IsNotEmpty({ message: 'Full name cannot be empty or just spaces' })
    username!: string;
    
    @IsEmail()
    @IsNotEmpty()
    email!: string;
    
    @IsString()
    @IsNotEmpty()
    @Matches(/^\S+$/, { message: 'Password cannot contain any spaces' })
    @MinLength(6)
    password!: string
}