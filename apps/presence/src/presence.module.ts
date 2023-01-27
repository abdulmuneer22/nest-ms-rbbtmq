import { SharedModule } from '@app/shared';
import { PostgressDBModule } from '@app/shared/postgresdb.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PresenceController } from './presence.controller';
import { PresenceService } from './presence.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    PostgressDBModule,
    SharedModule,
  ],
  controllers: [PresenceController],
  providers: [PresenceService],
})
export class PresenceModule {}
