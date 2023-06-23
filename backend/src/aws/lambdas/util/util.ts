import {APIGatewayProxyStructuredResultV2} from 'aws-lambda';
import {ErrorDtoOutput, ResultDtoOutput} from '../../../core/shared/usecase';

export const dtoToResponse = <
  // TResultDto extends ResultDtoOutput,
  // TErrorDto extends ErrorDtoOutput
  TDto
>(
  // dto: TResultDto | TErrorDto,
  dto: TDto,
  options?: {
    onError?: (
      errorDto: TDto extends ErrorDtoOutput ? TDto : never
    ) => APIGatewayProxyStructuredResultV2 & {typeInferableBody: TDto};
    onResult?: (
      resultDto: TDto extends ResultDtoOutput ? TDto : never
    ) => APIGatewayProxyStructuredResultV2 & {typeInferableBody: TDto};
    // onResult?: <TOkDto extends ResultDtoOutput>(
    //   resultDto: TOkDto
    // ) => APIGatewayProxyResultV2;
    resultStatusCode?: number;
  }
) => {
  const defaultOptions: Required<typeof options> = {
    resultStatusCode: 200,
    onError: errorDto => {
      return {
        // statusCode: errorDto.error.statusCode,
        statusCode: errorDto.error.statusCode,
        body: JSON.stringify(errorDto),
        typeInferableBody: errorDto,
      };
    },
    onResult: resultDto => {
      return {
        statusCode: 200,
        // options?.resultStatusCode ?? defaultOptions.resultStatusCode,
        body: JSON.stringify(resultDto),
        typeInferableBody: resultDto,
      };
    },
  };

  const _options = {...defaultOptions, ...options};

  if ('error' in dto) {
    // @ts-ignore
    return defaultOptions.onError(dto);
  } else {
    // @ts-ignore
    return defaultOptions.onResult(dto);
  }

  throw `Given dto is not a resultDto nor errorDto`;
};
