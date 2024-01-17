import { Test, TestingModule } from '@nestjs/testing';
import { SubscibeUserResolver } from './subscibe-user.resolver';

describe('SubscibeUserResolver', () => {
  let resolver: SubscibeUserResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscibeUserResolver],
    }).compile();

    resolver = module.get<SubscibeUserResolver>(SubscibeUserResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
