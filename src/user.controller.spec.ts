// due to limitaion of time I could not touch the test section
// here i just make a single test
// i wish if i could get more time i can perform the tests

// test cmd i am using =>>> npm run test:watch user.controller.spec.ts

import { UserService } from './../src/modules/user/user.service';

// Mock dependencies
const mockJwtService = {
  /* Define mock methods or properties of JwtService */
};

const mockRedis = {
  /* Define mock methods or properties of Redis */
};

const mockUserRepository = {
  /* Define mock methods or properties of Repository<User> */
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService(
      mockJwtService as any,
      mockRedis as any,
      mockUserRepository as any,
    );
  });

  it('dummyTest should return "Dummy test"', async () => {
    const result = await service.dummyTest();
    expect(result).toEqual('Dummy test');
  });
});
