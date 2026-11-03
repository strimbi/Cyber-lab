import { Module } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { SensorsController } from './sensors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sensor } from './sensor.enity';

@Module({
  imports: [TypeOrmModule.forFeature([Sensor])],
  providers: [SensorsService],
  controllers: [SensorsController]
})
export class SensorsModule {}
