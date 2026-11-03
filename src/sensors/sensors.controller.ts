import { Controller, DefaultValuePipe, ParseIntPipe, Patch, Post, Query, Get, ParseBoolPipe, Body, Param } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { CreateSensorDto, UpdateSensorDto } from './sensor.dto';

@Controller('sensors')
export class SensorsController {
    constructor(private readonly sensors: SensorsService) {}

    @Post()
    create(@Body() dto: CreateSensorDto)
    {
        return this.sensors.create(dto);
    }

    @Get()
    list(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    )
    {
        return this.sensors.findPage(page, Math.min(limit, 100));
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSensorDto)
    {
        return this.sensors.update(id, dto);
    }

    @Patch(':id/enabled')
    setEnabled(
        @Param('id', ParseIntPipe) id: number,
        @Body('enabled', ParseBoolPipe) enabled: boolean,
    )
    {
        return this.sensors.setEnabled(id, enabled);
    }

}
