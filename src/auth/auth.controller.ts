import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { VerifyTokenDto } from './dto/verifyTokenDto.dto';
import { Post, Body, Controller, HttpCode } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  login(@Body() authDto: AuthDto) {
    return this.authService.login(authDto);
  }

  @Post('/verify-token')
  @HttpCode(200)
  verifyToken(@Body() verifyTokenDto: VerifyTokenDto) {
    return this.authService.verifyToken(verifyTokenDto);
  }
}
