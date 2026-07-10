import { Customer } from "src/customers/Entity/customers";
import { Package } from "src/packages/Entity/Package";
import { Users } from "src/users/Entity/Users";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum BookingStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}

@Entity('Bookings')
export class Booking {
    @PrimaryGeneratedColumn()
    id!: number

    @ManyToOne(() => Customer, customer => customer.bookings)
    customer!: Customer;
    
    @ManyToOne(() => Package, pack => pack.bookings )
    package!: Package

    @Column()
    date!: Date; //  يوم التصوير يختاره العميل

    @Column({
        type: 'enum',
        enum: BookingStatus,
        default: BookingStatus.PENDING
    })
    status!: BookingStatus;

    @Column({ nullable: true })
    notes?: string;

    @ManyToOne(() => Users, (user) => user.bookings)
    user!: Users

    @CreateDateColumn()
    createdAt!: Date // يوم الرسل فيه الحجز من النظام
}