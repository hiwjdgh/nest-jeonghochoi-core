# @jeonghochoi/core

NestJS 서비스에서 공통 인프라(로거, DB, Redis, JWT, RBAC, File, Mail)를 일관되게 구성하기 위한 Core 라이브러리입니다.

## 설치

```bash
npm install @jeonghochoi/core
```

---

## 빠른 시작

```ts
import { Module } from '@nestjs/common';
import { CoreModule } from '@jeonghochoi/core';

@Module({
  imports: [
    CoreModule.forRoot({
      logger: {
        appName: 'user-api',
        level: 'info',
        pretty: true,
      },
      database: {
        registry: {
          main: {
            enabled: true,
            type: 'postgres',
            supportsSchema: true,
            options: {
              type: 'postgres',
              host: process.env.DB_HOST,
              port: Number(process.env.DB_PORT ?? 5432),
              username: process.env.DB_USER,
              password: process.env.DB_PASSWORD,
              database: process.env.DB_NAME,
              entities: [],
            },
          },
        },
      },
      redis: {
        host: process.env.REDIS_HOST ?? '127.0.0.1',
        port: Number(process.env.REDIS_PORT ?? 6379),
      },
      jwt: {
        secret: process.env.JWT_SECRET!,
        signOptions: { expiresIn: '1h' },
      },
      rbac: {
        // contextProvider, permissionChecker 구현체를 앱에서 주입
      },

      // 👇 새 멀티 인스턴스 File
      file: {
        uploader: {
          reportFtp: {
            type: 'ftp',
            host: 'ftp-a.example.com',
            user: 'ftp-user',
            password: '***',
          },
          archiveS3: {
            type: 's3',
            region: 'ap-northeast-2',
            bucket: 'archive-bucket',
          },
        },
        writer: {
          reportCsv: {
            type: 'csv',
            path: 'tmp/report.csv',
          },
          reportExcel: {
            type: 'excel',
            path: 'tmp/report.xlsx',
          },
        },
      },

      // 👇 새 멀티 인스턴스 Mail
      mail: {
        templateDir: 'templates/mail',
        transports: {
          noticeSmtp: {
            type: 'smtp',
            host: 'smtp.notice.example.com',
            port: 587,
            user: 'notice-user',
            password: '***',
            from: 'notice@example.com',
          },
          marketingSes: {
            type: 'ses',
            region: 'ap-northeast-2',
            credentials: {
              accessKeyId: process.env.SES_KEY!,
              secretAccessKey: process.env.SES_SECRET!,
            },
            from: 'no-reply@example.com',
          },
        },
      },
    }),
  ],
})
export class AppModule {}
```

---

## File / Mail 사용법 (핵심)

### FileService

설정을 여러 개 등록해두고, 사용할 때 이름으로 선택합니다.

```ts
import { Injectable } from '@nestjs/common';
import { FileService } from '@jeonghochoi/core';

@Injectable()
export class ReportService {
  constructor(private readonly fileService: FileService) {}

  async makeAndUpload() {
    // writer 설정(reportCsv)에 path가 있으면 filePath 생략 가능
    const { filePath } = await this.fileService.write('reportCsv', [{ id: 1 }], {
      headers: ['id'],
    });

    await this.fileService.upload('reportFtp', filePath, {
      remotePath: '/daily/report.csv',
    });
  }
}
```

### MailService

```ts
import { Injectable } from '@nestjs/common';
import { MailService } from '@jeonghochoi/core';

@Injectable()
export class NoticeService {
  constructor(private readonly mailService: MailService) {}

  async sendRaw() {
    await this.mailService.send('noticeSmtp', {
      to: 'ops@example.com',
      subject: '[Notice] Raw mail',
      html: '<b>Hello</b>',
    });
  }

  async sendTemplate() {
    await this.mailService.sendTemplate(
      'noticeSmtp',
      'daily-report',
      { date: '2026-01-01' },
      {
        to: 'ops@example.com',
        subject: '[Report] Daily Result',
      },
    );
  }
}
```

---

## 제공 모듈

- `CoreModule` (global)
  - `RequestContextMiddleware`, `HttpLoggerMiddleware` 자동 적용
  - 전역 `HttpExceptionFilter` 등록
  - 옵션에 따라 Logger/Database/Redis/JWT/RBAC/File/Mail 모듈 로딩
- `DatabaseModule`
- `RedisModule`
- `JwtModule`
- `RbacModule`
- `FileModule`
- `MailModule`

---

## CoreOptions 요약

```ts
interface CoreOptions {
  logger?: {
    enabled?: boolean;
    appName: string;
    level?: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
    pretty?: boolean;
  };

  redis?: {
    enabled?: boolean;
    host: string;
    port: number;
    password?: string;
    db?: number;
    keyPrefix?: string;
    enableReadyCheck?: boolean;
  };

  database?: {
    enabled?: boolean;
    registry: Record<string, any>;
  };

  jwt?: {
    enabled?: boolean;
    secret: string;
    signOptions?: Record<string, any>;
  };

  rbac?: {
    enabled?: boolean;
    contextProvider?: any;
    permissionChecker?: any;
  };

  file?: {
    enabled?: boolean;
    uploader?: Record<string, any>; // ftp | s3 | local
    writer?: Record<string, any>; // csv | excel
  };

  mail?: {
    enabled?: boolean;
    templateDir?: string;
    transports?: Record<string, any>; // smtp | ses
  };
}
```

---

## 헬스체크

- `GET /health/live`
- `GET /health/ready`

---

## License

MIT
