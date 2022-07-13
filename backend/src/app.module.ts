import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConnection from './providers/database';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CarModule } from './modules/car/car.module';
import { TokenCheckMiddleware } from './common/middleware/token-check.middleware';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      load: [() => ({ dbConnection: databaseConnection })],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get('dbConnection'),
      inject: [ConfigService],
    }),
    CarModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenCheckMiddleware)
      .forRoutes({ path: 'car', method: RequestMethod.ALL });
  }
}
