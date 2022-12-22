import { Test, TestingModule } from '@nestjs/testing';
import { StravaController } from './strava.controller';

describe('StravaController', () => {
  let controller: StravaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StravaController],
    }).compile();

    controller = module.get<StravaController>(StravaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
