import { Booking } from "src/booking/Entity/booking.entity";
import { Customer } from "src/customers/Entity/customers";
import { Users } from "src/users/Entity/Users";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Package {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    type!: string;

    @Column()
    price!: number;

    @Column()
    duration!: string;

    @Column()
    description!: string;

    @OneToMany(() => Booking, booking => booking.package)
    bookings!: Booking[]

    @Column()
    deliveryDays!: number;

    @Column({default: true})
    isActive!: boolean;

    @Column('simple-array', { nullable: true })
    features!: string[];

    @ManyToOne(() => Users, (user) => user.packages)
    user!: Users

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date
}