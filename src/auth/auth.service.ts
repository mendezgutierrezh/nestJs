import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users, UsersDocument } from 'src/users/schema/user.schema';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<UsersDocument>,
    private jwtService: JwtService,
  ) {}
  async register(userObject: RegisterAuthDto) {
    const { password, email } = userObject;
    const user = await this.userModel.findOne({ email });
    if (user)
      throw new HttpException('Usuario ya registrado!', HttpStatus.FORBIDDEN);
    const textToHash = await hash(password, 10);
    userObject = { ...userObject, password: textToHash };
    return this.userModel.create(userObject);
  }

  async login(userObjetctLogin: LoginAuthDto) {
    const { email, password } = userObjetctLogin;
    const user = await this.userModel.findOne({ email });
    if (!user)
      throw new HttpException(
        'Usuario o contraseña no validos',
        HttpStatus.FORBIDDEN,
      );
    const checkPassword = await compare(password, user.password); // Devuelve true o false
    if (!checkPassword)
      throw new HttpException(
        'Usuario o contraseña no validos',
        HttpStatus.FORBIDDEN,
      );

    const payload = { id: user._id, name: user.name };
    const token = this.jwtService.sign(payload);

    const data = {
      user,
      token,
    };
    return data;
  }
}
