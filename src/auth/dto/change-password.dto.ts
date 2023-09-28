import { IsNotEmpty } from "class-validator";

export class ChangePassDto{
    @IsNotEmpty()
    username:string;
    @IsNotEmpty()
    password:string;
    @IsNotEmpty()
    passwordNew:string;
    @IsNotEmpty()
    passwordConfirm:string
}