import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LogginuserDto, RegisterUserDto } from './dto';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}


  @MessagePattern({cmd:'auth.regiter.user'})
  regiterUser(@Payload()registerUserDto:RegisterUserDto){
    return this.authService.registerUser(registerUserDto);
  }
  
  @MessagePattern({cmd:'auth.login.user'})
  loginUser(@Payload() logginUserDto:LogginuserDto){
    return this.authService.logginUser(logginUserDto);
  }
  @MessagePattern({cmd:'auth.verify.user'})
  verifyUser(@Payload()token:string){
    return this.authService.verifyToken(token);
  }
  
}
