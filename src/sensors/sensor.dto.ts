import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, isUUID, MaxLength, ValidateNested } from 'class-validator';
import { SensorType } from './sensor.enity';

export class O365ConfigDto
{
    @IsUUID() tenantId: string;
    @IsUUID() clientId: string;
    @IsString() @IsNotEmpty() clientSecret: string;
}

export class CreateSensorDto
{
    @IsString() @IsNotEmpty() @MaxLength(100)
    name: string;

    @IsEnum(SensorType)
    type: SensorType;

    @ValidateNested() @Type(() => O365ConfigDto)
    config: O365ConfigDto;
}

export class UpdateO365ConfigDto
{
    @IsOptional() @IsUUID() tenantId?: string;
    @IsOptional() @IsUUID() clientId?: string;
    @IsOptional() @IsString() @IsNotEmpty() clientSecret?: string;
}

export class UpdateSensorDto
{
    @IsOptional() @IsString() @IsNotEmpty() @MaxLength(100)
    name?: string;

    @IsOptional() @ValidateNested() @Type(() => UpdateO365ConfigDto)
    config?: UpdateO365ConfigDto;
}