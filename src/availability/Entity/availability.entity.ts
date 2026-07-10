import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Users } from '../../users/Entity/Users'

export enum AvailabilityStatus {
    AVAILABLE = 'available',
    BOOKED = 'booked'
}

@Entity()
export class Availability {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'date' })
    date!: Date;

    @Column({ type: 'time', nullable: true })
    startTime?: string; // ← "09:00"

    @Column({ type: 'time', nullable: true })
    endTime?: string; // ← "12:00"

    @Column({
        type: 'enum',
        enum: AvailabilityStatus,
        default: AvailabilityStatus.AVAILABLE
    })
    status!: AvailabilityStatus;

    @Column({ nullable: true })
    notes?: string;

    @ManyToOne(() => Users, (user) => user.availabilities)
    user!: Users;
}