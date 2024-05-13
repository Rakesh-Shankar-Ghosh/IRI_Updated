// src/database/database.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ConfigService from '../config/config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ConfigService.getDbConfig(),
    }),
  ],
  exports: [TypeOrmModule],
})
export class ConfigModule {}
