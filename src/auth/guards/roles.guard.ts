import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector
    ){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler()); 
        const request = context.switchToHttp().getRequest()
        
        const user = request.user
        return requiredRoles.includes(user.role)
    }
}