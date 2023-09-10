import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { AuthDto } from './dto';
import { JwtService } from '@nestjs/jwt/dist';
import { ConfigService } from '@nestjs/config/dist/config.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        hash,
      },
    });

    return this.signToken(user.id, user.email);
  }

  async signin(dto: AuthDto) {
    // find user by e-mail
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    //if user doesnt exist throw a error
    if (!user) {
      throw new ForbiddenException('Credentials Incorrect');
    }

    //compare passwords
    const isValidPassword = argon.verify(user.hash, dto.password);

    //if passwords incorrect trhow a error
    if (!isValidPassword) {
      throw new ForbiddenException('Credentials Incorrect');
    }

    //return user credentials
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    userEmail: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email: userEmail,
    };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    });

    return {
      access_token: token,
    };
  }
}
