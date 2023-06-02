import {userRepository} from '../../data/repository/userRepository';
import {Token} from '../../domain/token';
import {InvalidCredentialsError} from '../../shared/error';
import {AuthenticateInput, authenticateInputSchema} from './schema';

export class Authenticate {
  // 1. zvaliduje request
  // 2. najde uzivatelska data (uzivatele)
  // 3. overi autentizacni metodu
  // 4. vytvori, zaznamena a vrati autentizacni prostredek
  async execute(input: AuthenticateInput) {
    const validatedInput = authenticateInputSchema.parse(input);

    const user = await userRepository.findOneByEmail(validatedInput.email);
    if (user === null) {
      throw new InvalidCredentialsError();
    }

    if (!(await user.isMyPassword(validatedInput.password))) {
      throw new InvalidCredentialsError();
    }

    const token = await Token.createForUser(user);

    const signedToken = token.jwtToken;

    return signedToken;
  }
}
