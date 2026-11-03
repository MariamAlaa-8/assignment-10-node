import { ConfirmEmailDto, ISignupDto, ResendConfirmEmailDto, ILoginDto, ForgetPasswordDto, ResetPasswordDto, RefreshTokenDto, LogoutDto } from "./dto/authentication.dto";
import { EmailSubjectEnum, ProvideEnum, ROLEENUM, TokenTypeEnum } from "../../common/enum/index";
import { emailEvent } from "../../common/utils/email/email.event"; 
import { UserEmailKey, UserEmailTrailsKey } from "../../common/utils/email/send.email"; 
import { createOtp } from "../../common/utils/otp";
import { BadException, ConflictException, NotfoundException, UnauthorizedException, ForbiddenException } from "../../common/exception/index";
import { CacheService } from "../../common/services/cache.service";
import cacheService from "../../common/services/cache.service";
import { userRepository } from "../../common/repository/index"; 
import { compare, encryption, hash } from "../../common/security/index";
import { generateToken, getExpiry, getSignature, verifyToken } from "../../common/utils/token/token.utils";
import { WEB_CLIENT_IDs } from "../../config";
import { OAuth2Client } from "google-auth-library";


const googleClient = new OAuth2Client();

export class AuthenticationService {
  private userRepository = userRepository; 
  private cacheService: CacheService;

  constructor() {
    this.cacheService = cacheService;
  }

  async senEmailOtp({ email, subject, expiresIn = 120, maxTrails = 3, blockInSeconds = 300 }: { email: string, subject: EmailSubjectEnum, expiresIn?: number, maxTrails?: number, blockInSeconds?: number }) {
    const existOtpTTl = await this.cacheService.ttl({ key: UserEmailKey({ email, subject }) });
    
    if (existOtpTTl > 0) {
      throw new ConflictException(`Sorry we cannot create new otp until existing one become expired please try again later after ${existOtpTTl}s`);
    }
    
    const oldTrails = await this.cacheService.get({ key: UserEmailTrailsKey({ email, subject }) }) ?? 0;
    
    if (oldTrails >= maxTrails) {
      throw new BadException("Max otp trails reached");
    }
    
    const code = createOtp();
    
    await this.cacheService.set({
      key: UserEmailKey({ email, subject }),
      ttl: expiresIn,
      value: await hash({ plaintext: code.toString() }) 
    });
    
    const currentTrails = await this.cacheService.incrBy({ key: UserEmailTrailsKey({ email, subject }) });
    
    if (currentTrails == maxTrails) {
      await this.cacheService.expire({ key: UserEmailTrailsKey({ email, subject }), ttl: blockInSeconds });
    }
    
    emailEvent.emit("sendEmail", {
      recipient: { to: [email] }, 
      subject,
      data: { code }
    });
  }

  async signup({ username, email, password, phone }: ISignupDto['body']) {
    const duplicatedAccount = await this.userRepository.findOne({ filter: { email } });
    if (duplicatedAccount) throw new ConflictException("Email Exist");

    const account = await this.userRepository.createOne({
      data: {
        username, 
        email,
        phone: await encryption(phone),
        password: await hash({ plaintext: password }) 
      }
    });
    
    await this.senEmailOtp({ email, subject: EmailSubjectEnum.CONFIRM_EMAIL });
    
    return account;
  }

  async confirmEmail({ otp, email }: ConfirmEmailDto): Promise<void> {
    const account = await this.userRepository.findOne({
      filter: {
        email,
        provider: ProvideEnum.SYSTEM,
        confirmEmail: { $exists: false }
      }
    });
    if (!account) throw new NotfoundException("Email not Exist");

    const hashOtp = await this.cacheService.get({
      key: UserEmailKey({ email, subject: EmailSubjectEnum.CONFIRM_EMAIL }),
    });
    
    if (!hashOtp || !await compare(otp, hashOtp)) {
      throw new ConflictException("Invalid otp");
    }
    
    account.confirmEmail = new Date(); 
    await account.save();
    
    await this.cacheService.del({ key: UserEmailKey({ email, subject: EmailSubjectEnum.CONFIRM_EMAIL }) });
    await this.cacheService.del({ key: UserEmailTrailsKey({ email, subject: EmailSubjectEnum.CONFIRM_EMAIL }) });
    
    return;
  }

  async resendConfirmEmail({ email }: ResendConfirmEmailDto) {
    const account = await this.userRepository.findOne({
      filter: {
        email,
        provider: ProvideEnum.SYSTEM,
        confirmEmail: { $exists: false }
      }
    });
    if (!account) throw new NotfoundException("Email not Exist");
    
    await this.senEmailOtp({ email, subject: EmailSubjectEnum.CONFIRM_EMAIL });
    return;
  }

  async login({ email, password }: ILoginDto) {
    const account = await this.userRepository.findOne({ filter: { email, provider: ProvideEnum.SYSTEM } });
    if (!account) throw new NotfoundException("Invalid login credentials");

    if (!account.confirmEmail) throw new ForbiddenException("Please confirm your email first");

    const isMatch = await compare(password, account.password);
    if (!isMatch) throw new NotfoundException("Invalid login credentials");

    const accessToken = generateToken({
        payload: { _id: account._id, role: account.role },
        secret: getSignature(account.role as ROLEENUM, TokenTypeEnum.ACCESS),
        options: { expiresIn: getExpiry(TokenTypeEnum.ACCESS) }
    });

    const refreshToken = generateToken({
        payload: { _id: account._id, role: account.role },
        secret: getSignature(account.role as ROLEENUM, TokenTypeEnum.REFRESH),
        options: { expiresIn: getExpiry(TokenTypeEnum.REFRESH) }
    });

    return { accessToken, refreshToken };
  }

  async refreshToken({ refreshToken }: RefreshTokenDto) {
    let decoded: any;
    try {
        decoded = verifyToken(refreshToken, getSignature(ROLEENUM.USER, TokenTypeEnum.REFRESH));
    } catch (error) {
        decoded = verifyToken(refreshToken, getSignature(ROLEENUM.ADMIN, TokenTypeEnum.REFRESH));
    }

    const isRevoked = await this.cacheService.get({ key: `revoked_token::${refreshToken}` });
    if (isRevoked) throw new UnauthorizedException("Token is revoked, please login again");

    const accessToken = generateToken({
        payload: { _id: decoded._id, role: decoded.role },
        secret: getSignature(decoded.role, TokenTypeEnum.ACCESS),
        options: { expiresIn: getExpiry(TokenTypeEnum.ACCESS) }
    });

    return { accessToken };
  }



  async forgetPassword({ email }: ForgetPasswordDto) {
    const account = await this.userRepository.findOne({ filter: { email, provider: ProvideEnum.SYSTEM } });
    if (!account) throw new NotfoundException("Email not Exist");
    
    await this.senEmailOtp({ email, subject: EmailSubjectEnum.FORGOT_PASSWORD });
    return;
  }

  async resetPassword({ email, otp, newPassword }: ResetPasswordDto) {
    const account = await this.userRepository.findOne({ filter: { email, provider: ProvideEnum.SYSTEM } });
    if (!account) throw new NotfoundException("Email not Exist");

    const hashOtp = await this.cacheService.get({
      key: UserEmailKey({ email, subject: EmailSubjectEnum.FORGOT_PASSWORD }),
    });
    
    if (!hashOtp || !await compare(otp, hashOtp)) {
      throw new ConflictException("Invalid otp");
    }
    
    account.password = await hash({ plaintext: newPassword });
    account.changeCredentialsTime = new Date();
    await account.save();
    
    await this.cacheService.del({ key: UserEmailKey({ email, subject: EmailSubjectEnum.FORGOT_PASSWORD }) });
    await this.cacheService.del({ key: UserEmailTrailsKey({ email, subject: EmailSubjectEnum.FORGOT_PASSWORD }) });
    
    return;
  }

  
  async loginWithGoogle({ idToken }: { idToken: string }) {
    const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: WEB_CLIENT_IDs,
    });
    const payload = ticket.getPayload();
    
    if (!payload || !payload.email) {
        throw new BadException("Invalid Google token");
    }

    const { email, given_name, family_name, picture, email_verified } = payload;

    let account = await this.userRepository.findOne({ filter: { email } });

    if (!account) {
        account = await this.userRepository.createOne({
            data: {
                firstname: given_name || "Google",
                lastname: family_name || "User",
                email,
                provider: ProvideEnum.GOOGLE,
                image: picture,
                confirmEmail: email_verified ? new Date() : undefined,
                password: "GOOGLE_AUTH_PASSWORD", // مش هيتستخدم
            }
        });
    } else if (account.provider !== ProvideEnum.GOOGLE) {
        throw new ConflictException("Email already registered with system, please login with password");
    }

    const accessToken = generateToken({
        payload: { _id: account._id, role: account.role },
        secret: getSignature(account.role as ROLEENUM, TokenTypeEnum.ACCESS),
        options: { expiresIn: getExpiry(TokenTypeEnum.ACCESS) }
    });

    const refreshToken = generateToken({
        payload: { _id: account._id, role: account.role },
        secret: getSignature(account.role as ROLEENUM, TokenTypeEnum.REFRESH),
        options: { expiresIn: getExpiry(TokenTypeEnum.REFRESH) }
    });

    return { accessToken, refreshToken };
  }
} 