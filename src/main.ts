import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Mi API documentation')
    .setDescription('Probando nest desde 0')
    .setVersion('1.0')
    .addTag('items')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentacion', app, document);

  await app.listen(3000);
}
bootstrap();
