import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sensor, SensorType } from './sensor.enity';
import { CreateSensorDto, UpdateSensorDto } from './sensor.dto';

@Injectable()
export class SensorsService {
    constructor(@InjectRepository(Sensor) private repo: Repository<Sensor>) {}

    //never send the secret back to the browser
    private toPublic(s: Sensor)
    {
        const { clientSecret, ...safeConfig } = s.config ?? {};
        return { ...s, config: safeConfig };
    }

    private async testConnection(type: SensorType, config: Record<string, any>)
    {
        if(type === SensorType.O365_MAIL)
        {
            const res = await fetch
            (
                'https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/token',
                {
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    body: new URLSearchParams
                    ({
                        client_id: config.client_id,
                        client_secret: config.clientSecret,
                        scope: 'https://graph.microsoft.com/.default',
                        grant_type: 'client_credentials',
                    }),
                },
            );

            if(!res.ok)
            {
                throw new BadRequestException('Microsoft rejected these credentals (check tenant ID, client ID and secret).');
            }
        }
    }

    async create(dto: CreateSensorDto)
    {
        await this.testConnection(dto.type, dto.config)
        const sensor = await this.repo.save(
            this.repo.create({ name: dto.name, type: dto.type, config: { ...dto.config}}),
        );

        return this.toPublic(sensor);
    }

    async findPage(page: number, limit: number)
    {
        const[items, total] = await this.repo.findAndCount({
            order: {id: 'DESC'},
            skip: (page - 1) * limit,
            take: limit,
        });

        return { items: items.map((s) => this.toPublic(s)), total, page, limit };
    }

    async update(id: number, dto: UpdateSensorDto)
    {
        const sensor = await this.repo.findOneBy({ id });
        if(!sensor) throw new NotFoundException('Sensor not found');
        if(dto.name) sensor.name = dto.name;
        if(dto.config)
        {
            const merged = { ...sensor.config, ...dto.config};
            await this.testConnection(sensor.type, merged);
            sensor.config = merged;
        }

        return this.toPublic(await this.repo.save(sensor));
    }

    async setEnabled(id: number, enabled: boolean)
    {
        const sensor = await this.repo.findOneBy({ id });
        if (!sensor) throw new NotFoundException('Sensor not found');
        sensor.enabled = enabled;

        return this.toPublic(await this.repo.save(sensor));
    }

}
