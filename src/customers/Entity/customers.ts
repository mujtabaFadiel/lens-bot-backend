import { Delete } from "@nestjs/common";
import { Booking } from "src/booking/Entity/booking.entity";
import { Users } from "src/users/Entity/Users";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('customers')
export class Customer {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ unique: true })
    phone!: string;

    @OneToMany(() => Booking, booking => booking.customer)
    bookings!: Booking[]

    @ManyToOne(() => Users, user => user.customers)
    user!: Users

    @CreateDateColumn()
    createdAt!: Date;

    @DeleteDateColumn()
    deleltedAt!: Date
}