import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";
import { AuthService, Provider } from "./auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google')
{
	constructor(private configService: ConfigService, private readonly authService: AuthService) {
		super({
			clientID: configService.get<string>('CLIENT_ID'),
			clientSecret: configService.get<string>('CLIENT_SECRET'),
			callbackURL: 'http://localhost:3000/auth/google/callback',
			passReqToCallback: true,
			scope: ['profile']
		});
	}

	async validate(request: any, accessToken: string, refreshToken: string, profile, done: Function) {
		try {
			console.log(profile);

			const jwt: string = await this.authService.validateOAuthLogin(profile.id, Provider.GOOGLE);
			const user =
			{
				jwt
			};

			done(null, user);
		}
		catch (err) {
			// console.log(err)
			done(err, false);
		}
	}
}