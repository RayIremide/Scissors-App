import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Response } from 'express';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('root', () => {
    it('should render index.ejs', () => {
      const renderSpy = jest.spyOn(appService, 'renderIndex');
      const responseMock = {
        render: jest.fn(), // Mock the render function of Express response
      } as unknown as Response; // Mock the Response object

      appController.getHello(responseMock);

      expect(renderSpy).toHaveBeenCalledWith(responseMock);
    });
  });
});
