import {
  FieldValues,
  SubmitErrorHandler,
  UseFormReturn,
} from "react-hook-form";

/**
 * Default implementation for react hook form onErrorSubmit.
 * - Mainly for monitoring purpose
 * - I'm using model when validating as typing field by field,
 * This function is triggered when submit button is clicked and form is not valid.
 * - This function is important when using backend schema, which would break frontend validation
 * eg. where there is field in backend schema which is not having field in form - so error wouldn't display anywhere,
 * so we log at least to console.
 */
export function onInvalid<TFieldValues extends FieldValues>(
  usedForm: UseFormReturn<TFieldValues>
): ReturnType<SubmitErrorHandler<TFieldValues>> {
  return (err: any, event: any) => {
    console.error(err, event, usedForm.formState.errors, usedForm.getValues());
  };
}
