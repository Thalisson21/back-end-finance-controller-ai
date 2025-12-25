import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from '../common/utils/hash';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const passwordValid = await comparePassword(password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = {
      user_id: user.id,
      email: user.email,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
    };
  }
}
