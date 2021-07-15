import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './dto/signup.dto';
import { JwtPayload } from './jwt-payload.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ){}

    async signUp(signUpDto: AuthCredentialDto): Promise<void> {
        return this.userRepository.signUp(signUpDto);
    }

    async signIn(signUpDto: AuthCredentialDto): Promise<{accessToken:string}> {

        const username = await this.userRepository.signIn(signUpDto);
        const payload: JwtPayload = {username};
        const accessToken = await this.jwtService.sign(payload);
        return {accessToken}
    }
}
