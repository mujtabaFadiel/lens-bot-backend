import { Injectable } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConstants } from "./constants";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService 
    ) {// تأكد من طباعة المفتاح هنا في الكونسول لتتأكد أنه لا يظهر undefined
        console.log("🔑 JWT Secret inside Strategy:", configService.get<string>('JWT_SECRET'));

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            // نمرر المفتاح مباشرة من الـ configService
            secretOrKey: configService.get<string>('JWT_SECRET') || 'SecretKey',
        });
    }

    // 🔴 هــذه هـي الـدالة المـطلوبة لحل الخطأ 🔴
    async validate(payload: any) {
        // الـ payload يحتوي على البيانات التي قمت بتشفيرها أثناء الـ login (مثل sub و username)
        // ما تعود به هذه الدالة سيقوم NestJS بحقنه تلقائياً داخل كائن الـ Request (req.user)
        return {
            userId: payload.sub,
            email: payload.email,
            role: payload.role
        }
    }
}