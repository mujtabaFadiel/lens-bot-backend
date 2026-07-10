import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { PackagesModule } from './packages/packages.module';
import { CustomersModule } from './customers/customers.module';
import { BookingModule } from './booking/booking.module';
import { AvailabilityModule } from './availability/availability.module';
import { WhatsAppModule } from './whats-app/whats-app.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AiModule } from './ai/ai.module';
import { ConversationModule } from './conversation/conversation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // يجعل المتغيرات متاحة في كل الـ Modules دون الحاجة لإعادة استيراده في كل مكان
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configSerivce: ConfigService) => ({
        type: 'postgres',
        host: configSerivce.get<string>('DB_HOST'),
        port: configSerivce.get<number>('DB_PORT'),
        username: configSerivce.get<string>('DB_USERNAME'),
        password: configSerivce.get<string>('DB_PASSWORD'),
        database: configSerivce.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,     // Turn off (false) in production!
      })
    }),
    UsersModule,
    AuthModule,
    PackagesModule,
    CustomersModule,
    BookingModule,
    AvailabilityModule,
    WhatsAppModule,
    AiModule,
    ConversationModule
  ],
  // exports: [WhatsAppModule],
})
export class AppModule { }
