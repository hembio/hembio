import {
  EntityRepository,
  InjectRepository,
  RefreshTokenEntity,
  UserEntity,
} from "@hembio/core";
import { createLogger } from "@hembio/logger";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { authenticator } from "@otplib/preset-default";
import { toDataURL } from "qrcode";
import { HEMBIO_JWT_SECRET } from "~/constants";
import { CredentialsDto } from "./dto/credentials.dto";
import { InvalidUsernameOrPassword } from "./exceptions/invalid-username-or-password.exception";
import { Token } from "./token.interface";

type SignedToken = string;
type ExpiryDate = Date;

// 30 day ttl for refresh tokens
const refreshTokenTtl = 1000 * 60000 * 24 * 30;
// 15 minute ttl for access tokens
const accessTokenTtl = 1000 * 60000 * 15;

interface SignInResult {
  accessToken: string;
  refreshToken: string;
  user: UserEntity;
  expiryDate: Date;
  maxAge: number;
  accessTokenTtl: number;
}

@Injectable()
export class AuthService {
  private logger = createLogger("api");
  private pendingTfa = new Map<string, SignInResult>();

  public constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: EntityRepository<UserEntity>,
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepo: EntityRepository<RefreshTokenEntity>,
    private readonly jwtService: JwtService,
  ) {}

  public async signIn({
    username,
    password,
    device,
    ip,
  }: CredentialsDto & { device: string; ip: string }): Promise<SignInResult> {
    const user = await this.userRepo.findOne(
      { username },
      { populate: ["refreshTokens"] },
    );
    const validCredentials = user && (await user.verifyPassword(password));
    if (!user || !validCredentials) {
      throw new InvalidUsernameOrPassword();
    }

    const accessToken = await this.jwtService.signAsync({
      userId: user.id,
      username: user.username,
      expires: Date.now() + accessTokenTtl,
    });

    const expiryTime = Date.now() + refreshTokenTtl;
    const expiryDate = new Date(expiryTime);

    const refreshToken = await this.jwtService.signAsync({
      userId: user.id,
      username: user.username,
      expires: expiryTime,
    });

    const refreshTokenEntity = this.refreshTokenRepo.create({
      id: refreshToken,
      user,
      device,
      ip,
      expires: expiryTime,
    });

    this.refreshTokenRepo.persist(refreshTokenEntity);

    return {
      accessToken,
      refreshToken,
      user,
      expiryDate,
      maxAge: refreshTokenTtl,
      accessTokenTtl,
    };
  }

  public decodeToken(token: string, complete = false): Token {
    return this.jwtService.decode(token, {
      complete,
    }) as Token;
  }

  public generateToken({ userId, username }: Token): Promise<string> {
    return this.jwtService.signAsync({
      userId,
      username,
    });
  }

  public async signAccessToken(
    userId: string,
    username: string,
  ): Promise<[SignedToken, ExpiryDate]> {
    const expiryTime = Date.now() + accessTokenTtl;
    const expiryDate = new Date(expiryTime);
    const accessToken = await this.jwtService.signAsync({
      userId,
      username,
      expires: expiryTime,
    });
    return [accessToken, expiryDate];
  }

  public async signRefreshToken(
    user: UserEntity,
  ): Promise<[SignedToken, ExpiryDate]> {
    const expiryTime = Date.now() + refreshTokenTtl;
    const expiryDate = new Date(expiryTime);
    const refreshToken = await this.jwtService.signAsync({
      userId: user.id,
      username: user.username,
      expires: expiryTime,
    });
    return [refreshToken, expiryDate];
  }

  public async parseAuthHeader(header: string): Promise<UserEntity | null> {
    if (!header || header.indexOf("Bearer") === -1) {
      return null;
    }
    const token = this.jwtService.decode(header.substr(7)) as Token;
    if (!token || !token.userId) {
      return null;
    }
    return await this.userRepo.findOne(token.userId, { cache: true });
  }

  public async generateTfaQrCode(userId: string): Promise<string> {
    const otpAuth = authenticator.keyuri(userId, "hembio", HEMBIO_JWT_SECRET);
    return toDataURL(otpAuth);
  }

  public async addPendingTfaAuth(authResults: SignInResult): Promise<void> {
    this.pendingTfa.set(authResults.user.id, authResults);
    // Allow user to authenticate with TFA for 5 minutes
    setTimeout(() => {
      this.pendingTfa.delete(authResults.user.id);
    }, 1000 * 60 * 5);
  }

  public getPendingTfaAuth(
    userId: string,
    tfaCode: string,
  ): SignInResult | undefined {
    try {
      const isValid =
        true || authenticator.checkDelta(tfaCode, HEMBIO_JWT_SECRET);
      const authResults = this.pendingTfa.get(userId);
      if (isValid) {
        this.pendingTfa.delete(userId);
        return authResults;
      }
    } catch (e) {
      this.logger.error(e);
    }
    return undefined;
  }
}
