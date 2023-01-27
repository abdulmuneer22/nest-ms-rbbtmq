import { Injectable } from '@nestjs/common';

@Injectable()
export class PresenceService {
  getHello(): string {
    return 'Hello World!';
  }

  getPresence(): string {
    return 'Hello from presence service';
  }
}
