import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy) {
  public constructor(private readonly configService: ConfigService) {
    super({

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'ARhnfgQ20w5CJttkOToTTFdyW8WyeY65rMopLPRgEwLi5Gft0LmZEc4HNitebLEncvwERbM2gjfTor8jgAbO9A==',
    })
  }

  async validate(payload: any): Promise<any> {
    return payload
  }

  authenticate(req) {
    super.authenticate(req)
  }
}