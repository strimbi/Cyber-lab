import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

export enum SensorType
{
    O365_MAIL = 'o365_mail',
}

@Entity()
export class Sensor
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100})
    name: string;

    @Column({type: 'varchar', length: 50})
    type: SensorType;

    @Column({ default: true })
    enabled: boolean;

    @Column({ type: 'json' })
    config: Record<string, any>;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}