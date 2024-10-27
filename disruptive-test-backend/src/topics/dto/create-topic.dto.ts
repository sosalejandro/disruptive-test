import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateTopicDto {
    @ApiProperty({
        description: 'The name of the topic',
        example: 'Technology',
    })
    @IsString()
    @IsNotEmpty()
    name: string;
}

