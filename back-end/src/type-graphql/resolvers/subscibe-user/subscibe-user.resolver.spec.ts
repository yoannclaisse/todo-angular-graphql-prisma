import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionResolver } from './subscibe-user.resolver';

describe('SubscriptionResolver', () => {
  let resolver: SubscriptionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscriptionResolver],
    }).compile();

    resolver = module.get<SubscriptionResolver>(SubscriptionResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
