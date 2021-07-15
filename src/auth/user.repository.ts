import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { User } from "./auth.entity";
import { AuthCredentialDto } from "./dto/signup.dto";
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async signUp(signUpDto: AuthCredentialDto): Promise<void> {
        const {username, password} = signUpDto;
        const user = new User();
        user.username = username;
        user.salt = await this.getSalt();
        user.password = await this.hashPassword(password, user.salt);
        try {
            await user.save();    
        } catch (error) {
            console.log(error.code);
            if(error.code === '23505') {
                throw new ConflictException('User already exists');
            } else {
                throw new InternalServerErrorException();
                
            }
        }       
    }

    async signIn(signIn: AuthCredentialDto): Promise<string> {
        const {username, password} = signIn;
        const user = await this.findOne({username});
        if (user) {
            if(await user.validatePassword(password)) {
                return user.username;
            }
        }
        return null;
    }

    private async getSalt(): Promise<string> {
        return bcrypt.genSalt();
    }

    private async hashPassword(password: string, salt: string) {
        return bcrypt.hash(password, salt);
    }
}