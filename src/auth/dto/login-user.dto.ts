import { IsEmail, IsString } from "class-validator";

export class LogginuserDto{

    @IsString()
    @IsEmail()
    email:string;
 
    @IsString()
    password:string;
}