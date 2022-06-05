import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Question } from '../questions/entities/question.entity';

@Injectable()
export class DatabaseService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(connectionName?: string): TypeOrmModuleOptions {
    return {
      name: 'default',
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: false,
      logging: true,
      entities: [Question],
      autoLoadEntities: true,
      // migrations: [__dirname + '/migrations/*{.ts,.js}'],
      // migrationsRun: true,
      // migrationsTableName: 'migrations',
      // migrationsIgnorePatterns: ['node_modules'],
      // migrationsRecursive: true,
    };
  }
}
