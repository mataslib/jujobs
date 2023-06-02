import {advertiserRepository} from '../../data/repository/advertiserRepository';
import {Advertiser} from '../../domain/advertiser/advertiser';
import {IAuthorizerOfUser} from '../../service/authorizer';
import {IFileUploader} from '../../service/fileUploader';
import {AuthorizationError, NotFoundError} from '../../shared/error';
import {
  UpdateAdvertiserProfileInput,
  updateAdvertiserProfileInputSchema,
} from './schema';

export class UpdateAdvertiserProfile {
  private deps;

  constructor(deps: {
    fileUploader: IFileUploader;
    authorizer: Pick<IAuthorizerOfUser, 'updateAdvertiserProfile'>;
  }) {
    this.deps = deps;
  }

  // 1. validate input
  // 2. find user
  // 3. update user's advertiser profile
  //  3.1. if input contains logo, upload logo
  //    3.1.1 if upload fails and logo is only input - return error
  //
  async execute(input: UpdateAdvertiserProfileInput) {
    const validatedInput = updateAdvertiserProfileInputSchema.parse(input);

    if (
      !this.deps.authorizer.updateAdvertiserProfile({
        advertiserId: validatedInput.advertiserId.toString(),
      })
    ) {
      throw new AuthorizationError();
    }

    const advertiser = await advertiserRepository.findOneById(
      validatedInput.advertiserId
    );
    if (advertiser === null) {
      throw new NotFoundError();
    }

    await this.updateProfile(advertiser, validatedInput);
  }

  private updateProfile = async (
    advertiser: Advertiser,
    input: UpdateAdvertiserProfileInput
  ) => {
    const logoValue = await this.processLogoInput(advertiser, input);

    const {name, web, about} = input;
    const updateResult = advertiser.update({
      name,
      web,
      about,
      logo: logoValue,
    });

    await advertiserRepository.save(advertiser);
  };

  private processLogoInput = async (
    advertiser: Advertiser,
    input: UpdateAdvertiserProfileInput
  ) => {
    if (!('logo' in input)) {
      // keep current value
      return advertiser?.logo;
    }

    if (input.logo) {
      // upload new
      const uploadResult = await this.deps.fileUploader.uploadAdvertiserLogo(
        input.logo,
        advertiser._id.toString()
      );

      return uploadResult['uploadedUrl'];
    }

    return undefined;
  };
}
