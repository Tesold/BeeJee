import { IsEmail, IsString, Length } from "class-validator";

export class CreateTaskDto{

    @Length(3, 64)
    readonly UserName: string;

    @IsString()
    @IsEmail({}, { message: 'Некорректный e-mail.' })
    @Length(6, 64)
    readonly Email: string;

    @Length(3, 64)
    readonly Text: string;
}