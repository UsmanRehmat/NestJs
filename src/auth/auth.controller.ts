import { Body, Controller, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from './auth.entity';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/signup.dto';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {

    }
    @Post('/signup')
    signUp(@Body(ValidationPipe) signUpDto: AuthCredentialDto): Promise<void> {
        return this.authService.signUp(signUpDto);
    }

    @Post('signin')
    signIn(@Body(ValidationPipe) signUpDto: AuthCredentialDto): Promise<{accessToken: string}> {
        return this.authService.signIn(signUpDto);
    }

    @Post('/test')
    @UseGuards(AuthGuard())
    test(@GetUser() user: User) {
        console.log(user);
    }


}
