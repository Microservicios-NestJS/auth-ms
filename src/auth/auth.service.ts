import { Injectable, Logger, OnModuleInit, Res } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { jwtPayload, RegisterUserDto,LogginuserDto } from './dto';
import * as bcryt from 'bcrypt';
import { RpcException, MessagePattern, Payload } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { envs } from 'src/config';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
   
    private readonly logger = new Logger('AuthService');
   constructor(
    private readonly jwtservice:JwtService
   ){
    super();
   }
    onModuleInit() {
        this.$connect();
        this.logger.log('MongoDb connected');
    }

    async singJWT(Payload:jwtPayload){
       return this.jwtservice.sign(Payload);
    }
    
    async registerUser(registerUserDto:RegisterUserDto){
        const{email,name,password}= registerUserDto;
        
        try {
            
            const user= await this.user.findUnique({
                where:{
                  email:email
                },
              })
            if(user){
                throw new RpcException({
                    status:400,
                    message:`user already exists`,
                   })
            }
            const newUser= await this.user.create({
                data:{
                    email:email,
                    password:bcryt.hashSync(password,10),
                    name:name,
                }
            })
                const {password:__,...rest} =newUser;
            return {
                user:rest,
                token:await this.singJWT(rest),
            }
        } catch (error) {
                 throw new RpcException({
                  status:400,
                  message: error.message,
                  
                 })
              
        }
    }
    async logginUser(logginuserDto:LogginuserDto){
        const{email,password}= logginuserDto;
        
        try {
            
            const user= await this.user.findUnique({
                where:{
                  email:email
                },
              })
            if(!user){
                throw new RpcException({
                    status:400,
                    message:`user already exists`,
                   })
            }
            const isPasswordValid= bcryt.compareSync(password,user.password);

            if(!isPasswordValid){
                throw new RpcException({
                    status:400,
                    message:`user/password not valid`,
                   })
            }
            const {password:__,...rest} =user;
            return {
                user:rest,
                token: await this.singJWT(rest),
            }
        } catch (error) {
                 throw new RpcException({
                  status:400,
                  message: error.message,
                  
                 })
              
        }
    }

    async verifyToken(token:string){
        try {
            const {sub,iat,exp,...user}=this.jwtservice.verify(token,{
                secret:envs.jwt_secrete,
            })
            return{
                user:user,
                token: await this.singJWT(user), 
            }

        } catch (error) {
            throw new RpcException({
                status:401,
                message:'invalid token'
            })
        }
    }
    
    
}
