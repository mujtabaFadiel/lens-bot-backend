// conversation/conversation.entity.ts
import { Users } from "src/users/Entity/Users";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum MessageRole {
    USER = 'user',
    ASSISTANT = 'assistant',
}

@Entity('conversations')
export class Conversation {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    phone!: string; // ← رقم العميل

    @Column({ type: 'enum', enum: MessageRole })
    role!: MessageRole; // ← مين قال الرسالة (عميل أو بوت)

    @Column('text')
    content!: string; // ← نص الرسالة

    @ManyToOne(() => Users, (user) => user.conversations)
    user!: Users;
    
    @CreateDateColumn()
    createdAt!: Date;
}