import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/types/auth.module';
import { UserModule } from './user/types/user.module';
import { user } from './user/entities';
import { RefrashToken, AccessToken } from './auth/entities';
import { ProductModule } from './product/product.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true, // 전역으로 설정하여 어디서든 환경 변수 사용 가능
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('TYPEORM_HOST'),
        port: configService.get<number>('TYPEORM_PORT'),
        username: configService.get<string>('TYPEORM_USERNAME'),
        password: configService.get<string>('TYPEORM_PASSWORD'),
        database: configService.get<string>('TYPEORM_DATABASE'),
        entities: [user, AccessToken, RefrashToken],
        synchronize: true,
        ssl: {
          rejectUnauthorized: false,
        },
        logging: configService.get<boolean>('TYPEORM_LOGGING', false),
      }),
    }),
    AuthModule,
    UserModule,
    ProductModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService, CouponService],
})
export class AppModule {}
