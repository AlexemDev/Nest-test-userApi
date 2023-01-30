import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseProvider } from './database/provider.module';
import { Users } from './api/users/users.model';
import { UsersModule } from './api/users/users.module';
import { AuthModule } from './api/auth/auth.module';

const appMode = process.env.NODE_ENV || 'development';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${appMode}`,
      isGlobal: true,
    }),
    DatabaseProvider,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
