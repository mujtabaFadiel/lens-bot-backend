import { Availability } from "src/availability/Entity/availability.entity";
import { Booking } from "src/booking/Entity/booking.entity";
import { Conversation } from "src/conversation/Entity/conversation";
import { Customer } from "src/customers/Entity/customers";
import { Package } from "src/packages/Entity/Package";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum Role {
    ADMIN = 'admin', 
    STAFF = 'staff'
}
@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    username!: string

    @Column({ select: false })
    password!: string;

    @Column()
    email!: string

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.STAFF
    })
    role!: Role;

    @OneToMany(() => Availability, (availability) => availability.user)
    availabilities!: Availability[]

    @OneToMany(() => Package, (pack) => pack.user)
    packages!: Package[];

    @OneToMany(() => Booking, (booking) => booking.user)
    bookings!: Booking[]

    @OneToMany(() => Conversation, (conversation) => conversation.user)
    conversations!: Conversation[]

    @OneToMany(() => Customer, customer => customer.user)
    customers!: Customer[]

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}