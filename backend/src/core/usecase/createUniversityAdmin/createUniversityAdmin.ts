import {userRepository} from '../../data/repository/userRepository';
import {User} from '../../domain/user/user';
import {
  CreateUniversityAdminInput,
  createUniversityAdminSchema,
} from './schema';

export class CreateUniversityAdmin {
  public async execute(input: CreateUniversityAdminInput) {
    const validatedInput = createUniversityAdminSchema.parse(input);
    const user = await User.createUniversityAdmin(validatedInput);

    await userRepository.save(user);
  }
}
