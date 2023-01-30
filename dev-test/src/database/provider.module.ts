import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        ({
          type: 'mongodb',
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          username: 'default',
          database: process.env.DB_DATABASE,
          entities: [],
          synchronize: true,
          autoLoadEntities: true,
          useUnifiedTopology: true,
        } as TypeOrmModuleAsyncOptions),
    }),
  ],
})
export class DatabaseProvider {}
