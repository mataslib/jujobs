export type DiscriminableResultDto<T extends ResultDto = ResultDto> = {
  result: T;
};

export type DiscriminableErrorDto<E extends ErrorDto = ErrorDto> = {
  error: E;
};

export type ResultDto = DTO & {};
export type ErrorDto = DTO & {
  type: string;
  message: string;
  statusCode: number;
};

type Primitive =
  | number
  | string
  | boolean
  | bigint
  | symbol
  | undefined
  | null
  | Date
  | Array<any>;

type DTO =
  | {
      [key: string]: Primitive | DTO;
    }
  | Primitive;

export function resultDto<T extends ResultDto>(
  value: T
): DiscriminableResultDto<T> {
  return {
    result: value,
  };
}

export function errorDto<E extends ErrorDto>(
  errorDto: E
): DiscriminableErrorDto<E> {
  return {
    error: errorDto,
  };
}

export function isErrorDto(
  response: unknown
): response is DiscriminableErrorDto<ErrorDto> {
  if (
    typeof response === 'object' &&
    response !== null &&
    'error' in response
  ) {
    return true;
  }
  return false;
}
export function isResultDto(
  maybeResultDto: unknown
): maybeResultDto is DiscriminableResultDto<
  ExtractResultDtoValue<typeof maybeResultDto>
> {
  if (
    typeof maybeResultDto === 'object' &&
    maybeResultDto !== null &&
    'result' in maybeResultDto
  ) {
    return true;
  }
  return false;
}

export function isDiscriminableResultDto(
  maybeDiscriminableResultDto: unknown
): maybeDiscriminableResultDto is DiscriminableResultDto {
  if (
    maybeDiscriminableResultDto !== null &&
    typeof maybeDiscriminableResultDto === 'object' &&
    'result' in maybeDiscriminableResultDto
  ) {
    return true;
  }
  return false;
}

export function isDiscriminableErrorDto(
  maybeDiscriminableErrorDto: unknown
): maybeDiscriminableErrorDto is DiscriminableErrorDto {
  if (
    maybeDiscriminableErrorDto !== null &&
    typeof maybeDiscriminableErrorDto === 'object' &&
    'error' in maybeDiscriminableErrorDto
  ) {
    return true;
  }
  return false;
}

export function isDtoErrorDto(data: unknown): data is ErrorDto {
  return (
    typeof data === 'object' &&
    data !== null &&
    ['type', 'message', 'statusCode'].every(key => key in data)
  );
}

export function isDtoResultDto(data: unknown): data is ResultDto {
  return !isErrorDto(data);
}

export function assertResultDto(input: unknown): asserts input is {
  result: any;
} {
  if (isDiscriminableResultDto(input)) {
    return;
  }
  console.error(input);
  throw new Error('Result DTO expected!');
}

export function assertErrorDto(input: unknown): asserts input is {
  error: any;
} {
  if (isDiscriminableErrorDto(input)) {
    return;
  }
  throw new Error('Error DTO expected!');
}

export type ExtractResultDto<TDto> = TDto extends {result: unknown}
  ? TDto
  : never;

export type ExtractResultDtoValue<TDto> = TDto extends {result: infer TInnerDto}
  ? TInnerDto
  : never;

// const test = {
//   result: {
//     ahoj: 'ahoj',
//   },
// };
// type Halo = ExtractResultDtoValue<typeof test>;

export type ExtractErrorDto<TDto> = TDto extends DiscriminableErrorDto
  ? TDto
  : never;

export type ExtractErrorDtoValue<TDto> = TDto extends DiscriminableErrorDto<
  infer TInnerDto
>
  ? TInnerDto
  : never;
