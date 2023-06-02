import {ObjectId} from 'mongodb';
import {
  advertiserCollection,
  AdvertiserDocument,
} from '../../data/collection/advertiserCollection';
import {advertiserRepository} from '../../data/repository/advertiserRepository';
import {IFileUploader} from '../../service/fileUploader';
import {assertGetThrow} from '../../shared/assert';
import {UploadError} from '../../shared/error';
import {databaseTest} from '../../test/databaseTest';
import {UpdateAdvertiserProfile} from './updateAdvertiserProfile';

const {mongoClient: client} = databaseTest();

describe(`updateAdvertiserProfile`, () => {
  afterAll(async () => {
    await client.close();
  });

  test(`Expect success on valid scenario (advertiser found, logo upload success, valid input)`, async () => {
    const {updateAdvertiserProfile, fileUploaderMock} = await testSetup();
    const advertiserId = await givenAdvertiserExists();
    givenLogoUploadIsSuccessful(fileUploaderMock);
    const saveAdvertiserSpy = jest.spyOn(advertiserRepository, 'save');

    const result = await updateAdvertiserProfile.execute({
      advertiserId: advertiserId.toString(),
      name: `ACME`,
      about: `ACME is a company`,
      logo: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAIVBMVEXMzMyWlpbFxcWjo6O+vr63t7ecnJyqqqqbm5uxsbGampoKZyAaAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAU0lEQVRIiWNgGAWjYBQMd8Bk7KCITGMAZqeAQgZ2zwAwjQ2wmYU6ArVDaGyA0aWTkYHBFEpjM0FpoaABUzGExqaAJdmBkYFdNQBMj4JRMAoGOwAAPNIL2qWeApgAAAAASUVORK5CYII=`,
      web: `https://example.com`,
    });

    const updatedAdvertiser = await advertiserCollection.findOne({
      _id: advertiserId,
    });
    // assert updatedAdvertiser contain object with updated fields
    expect(updatedAdvertiser).toEqual(
      expect.objectContaining({
        name: `ACME`,
        about: `ACME is a company`,
        logo: `https://www.s3.com/`,
        web: `https://example.com`,
      })
    );

    expect(saveAdvertiserSpy).toHaveBeenCalledTimes(1);
  });

  test(`Expect error when updating profile of non-existing advertiser`, async () => {
    const {updateAdvertiserProfile} = await testSetup();

    const error = await assertGetThrow(() =>
      updateAdvertiserProfile.execute({
        // non-existing advertiserId
        advertiserId: new ObjectId().toString(),
      })
    );
    expect(error.name).toBe('NotFoundError');
  });

  test(`Expect error when upload fails`, async () => {
    const {updateAdvertiserProfile, fileUploaderMock} = await testSetup();
    const advertiserId = await givenAdvertiserExists();
    givenLogoUploadFails(fileUploaderMock);

    const error = await assertGetThrow(() =>
      updateAdvertiserProfile.execute({
        advertiserId: advertiserId.toString(),
        logo: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAIVBMVEXMzMyWlpbFxcWjo6O+vr63t7ecnJyqqqqbm5uxsbGampoKZyAaAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAU0lEQVRIiWNgGAWjYBQMd8Bk7KCITGMAZqeAQgZ2zwAwjQ2wmYU6ArVDaGyA0aWTkYHBFEpjM0FpoaABUzGExqaAJdmBkYFdNQBMj4JRMAoGOwAAPNIL2qWeApgAAAAASUVORK5CYII=`,
      })
    );

    expect(error.name).toBe('UploadError');
  });
});

const testSetup = async () => {
  const fileUploaderMock = createFileUploaderMock();

  const updateAdvertiserProfile = new UpdateAdvertiserProfile({
    authorizer: {
      updateAdvertiserProfile: () => true,
    },
    fileUploader: fileUploaderMock,
  });

  return {
    fileUploaderMock,
    updateAdvertiserProfile,
  };
};

async function givenAdvertiserExists() {
  const advertiserId = new ObjectId();
  await advertiserCollection.insertOne({
    _id: advertiserId,
  } as AdvertiserDocument);
  return advertiserId;
}

function createFileUploaderMock() {
  return {
    uploadAdvertiserLogo: jest.fn(),
  };
}

function givenLogoUploadIsSuccessful(
  fileUploaderMock: ReturnType<typeof createFileUploaderMock>
) {
  fileUploaderMock.uploadAdvertiserLogo.mockReturnValue(
    Promise.resolve({
      uploadedUrl: 'https://www.s3.com/',
    }) as ReturnType<IFileUploader['uploadAdvertiserLogo']>
  );
}
function givenLogoUploadFails(
  fileUploaderMock: ReturnType<typeof createFileUploaderMock>
) {
  fileUploaderMock.uploadAdvertiserLogo.mockImplementation(() => {
    throw new UploadError(`Upload failed`);
  });
}
