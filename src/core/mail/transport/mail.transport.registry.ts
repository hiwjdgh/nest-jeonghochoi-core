import { Injectable } from '@nestjs/common';
import { MailTransport } from './mail.transport.interface.js';

@Injectable()
export class MailTransportRegistry {
    private readonly transports = new Map<string, MailTransport>();

    register(name: string, transport: MailTransport) {
        this.transports.set(name, transport);
    }

    use(name: string): MailTransport {
        const transport = this.transports.get(name);
        if (!transport) {
            throw new Error(`Mail transport "${name}" not registered`);
        }
        return transport;
    }

    has(name: string): boolean {
        return this.transports.has(name);
    }
}
