import { captureException, withScope } from "@sentry/nextjs";
import axiosFactory, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import type {
  ApproveJobRequestBody,
  ApproveJobResultBody,
} from "shared/src/endpoint/approveJob";
import type {
  ArchiveJobRequestBody,
  ArchiveJobResultBody,
} from "shared/src/endpoint/archiveJob";
import type {
  AuthenticateRequestBody,
  AuthenticateResultBody,
} from "shared/src/endpoint/authenticate";
import type {
  CreateJobRequestBody,
  CreateJobResultBody,
} from "shared/src/endpoint/createJob";
import type {
  CreateStudyRequestBody,
  CreateStudyResultBody,
} from "shared/src/endpoint/createStudy";
import type {
  DeleteJobRequestBody,
  DeleteJobResultBody,
} from "shared/src/endpoint/deleteJob";
import type {
  DeleteStudyRequestBody,
  DeleteStudyResultBody,
} from "shared/src/endpoint/deleteStudy";
import type {
  UpdateStudyRequestBody,
  UpdateStudyResultBody,
} from "shared/src/endpoint/updateStudy";

import type { GetAdvertiserViewResultBody } from "shared/src/endpoint/getAdvertiserView";
import type { GetJobViewResultBody } from "shared/src/endpoint/getJobView";
import type { GetStudentResultBody } from "shared/src/endpoint/getStudent";
import type { GetUserResultBody } from "shared/src/endpoint/getUser";
import type {
  ImportStagStudyRequestBody,
  ImportStagStudyResultBody,
} from "shared/src/endpoint/importStagStudy";
import type {
  ListAdvertisersRequestQuery,
  ListAdvertisersResultBody,
} from "shared/src/endpoint/listAdvertisers";
import type {
  ListJobsRequestQuery,
  ListJobsResultBody,
} from "shared/src/endpoint/listJobs";
import type {
  RegisterAdvertiserRequestBody,
  RegisterAdvertiserResultBody,
} from "shared/src/endpoint/registerAdvertiser";
import type {
  ReplyToJobRequestBody,
  ReplyToJobResultBody,
} from "shared/src/endpoint/replyToJob";
import type {
  RequestEmailChangeRequestBody,
  RequestEmailChangeResultBody,
} from "shared/src/endpoint/requestEmailChange";
import type {
  RequestForgottenPasswordRequestBody,
  RequestForgottenPasswordResultBody,
} from "shared/src/endpoint/requestForgottenPassword";
import type {
  ResetForgottenPasswordRequestBody,
  ResetForgottenPasswordResultBody,
} from "shared/src/endpoint/resetForgottenPassword";
import type {
  SubscribeToNewJobNotificationRequestBody,
  SubscribeToNewJobNotificationResultBody,
} from "shared/src/endpoint/subscribeToNewJobNotification";
import type {
  UnsubscribeFromNewJobNotificationRequestBody,
  UnsubscribeFromNewJobNotificationResultBody,
} from "shared/src/endpoint/unsubcribeFromNewJobNotification";
import type {
  UpdateAdvertiserProfileRequestBody,
  UpdateAdvertiserProfileResultBody,
} from "shared/src/endpoint/updateAdvertiserProfile";
import type {
  UpdateJobRequestBody,
  UpdateJobResultBody,
} from "shared/src/endpoint/updateJob";
import type {
  UpdateStudentRequestBody,
  UpdateStudentResultBody,
} from "shared/src/endpoint/updateStudent";
import type {
  UpdateUserRequestBody,
  UpdateUserResultBody,
} from "shared/src/endpoint/updateUser";
import type {
  VerifyAdvertiserRequestBody,
  VerifyAdvertiserResultBody,
} from "shared/src/endpoint/verifyAdvertiser";
import type {
  VerifyEmailChangeRequestBody,
  VerifyEmailChangeResultBody,
} from "shared/src/endpoint/verifyEmailChange";
import { stringifyQuerystring } from "../util/utils";
import { accessTokenStorage } from "./accessTokenStorage";

// const apiHost = process.env.NEXT_PUBLIC_API_ENDPOINT;

const axios = axiosFactory.create({
  timeout: 10000,
  paramsSerializer: {
    serialize: (params: any) => {
      const stringified = stringifyQuerystring(params);
      return stringified;
    },
  },
});

axios.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    withScope((scope) => {
      scope.setLevel("error");
      scope.setExtras({
        data: error?.response?.data,
        cause: {
          message: error?.response?.data?.cause?.message,
          stack: error?.response?.data?.cause?.stack,
        },
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        // data: error?.response?.headers,
        // data: error?.response?.request,
        // data: error?.response?.config,
      });
      captureException(error);
    });
    return Promise.reject(error ?? null);
  }
);

export class Api {
  public registerAdvertiser = async (data: RegisterAdvertiserRequestBody) => {
    return apiFetch<RegisterAdvertiserResultBody>(
      apiPath("/registerAdvertiser"),
      {
        method: "POST",
        data: data,
      }
    );
  };

  public verifyAdvertiser = async (data: VerifyAdvertiserRequestBody) => {
    return apiFetch<VerifyAdvertiserResultBody>(apiPath(`/verifyAdvertiser`), {
      method: "POST",
      data: data,
    });
  };

  public authenticate = async (data: AuthenticateRequestBody) => {
    return apiFetch<AuthenticateResultBody>(apiPath(`/authenticate`), {
      method: "POST",
      data: data,
    });
  };

  public updateAdvertiserProfile = async (
    data: UpdateAdvertiserProfileRequestBody
  ) => {
    return apiFetchAuthenticated<UpdateAdvertiserProfileResultBody>(
      apiPath(`/updateAdvertiserProfile`),
      {
        method: "POST",
        data: data,
      }
    );
  };

  public updateUser = async (data: UpdateUserRequestBody) => {
    return apiFetchAuthenticated<UpdateUserResultBody>(apiPath(`/updateUser`), {
      method: "POST",
      data: data,
    });
  };

  public requestEmailChange = async (data: RequestEmailChangeRequestBody) => {
    return apiFetchAuthenticated<RequestEmailChangeResultBody>(
      apiPath(`/requestEmailChange`),
      {
        method: "POST",
        data: data,
      }
    );
  };

  public verifyEmailChange = async (data: VerifyEmailChangeRequestBody) => {
    return apiFetch<VerifyEmailChangeResultBody>(
      apiPath(`/verifyEmailChange`),
      {
        method: "POST",
        data: data,
      }
    );
  };

  public createJob = async (data: CreateJobRequestBody) => {
    return apiFetchAuthenticated<CreateJobResultBody>(apiPath(`/createJob`), {
      method: "POST",
      data: data,
    });
  };

  public updateJob = async (data: UpdateJobRequestBody) => {
    return apiFetchAuthenticated<UpdateJobResultBody>(apiPath(`/updateJob`), {
      method: "POST",
      data: data,
    });
  };

  public approveJob = async (data: ApproveJobRequestBody) => {
    return apiFetchAuthenticated<ApproveJobResultBody>(apiPath(`/approveJob`), {
      method: "POST",
      data: data,
    });
  };

  public archiveJob = async (data: ArchiveJobRequestBody) => {
    return apiFetchAuthenticated<ArchiveJobResultBody>(apiPath(`/archiveJob`), {
      method: "POST",
      data: data,
    });
  };

  public replyToJob = async (data: ReplyToJobRequestBody) => {
    return apiFetchAuthenticated<ReplyToJobResultBody>(apiPath(`/replyToJob`), {
      method: "POST",
      data: data,
    });
  };

  public deleteJob = async (data: DeleteJobRequestBody) => {
    return apiFetchAuthenticated<DeleteJobResultBody>(apiPath(`/deleteJob`), {
      method: "POST",
      data: data,
    });
  };

  public subscribeToNewJobNotification = async (
    data: SubscribeToNewJobNotificationRequestBody
  ) => {
    return apiFetchAuthenticated<SubscribeToNewJobNotificationResultBody>(
      apiPath(`/subscribeToNewJobNotification`),
      {
        method: "POST",
        data: data,
      }
    );
  };

  public unsubscribeFromNewJobNotification = async (
    data: UnsubscribeFromNewJobNotificationRequestBody
  ) => {
    return apiFetchAuthenticated<UnsubscribeFromNewJobNotificationResultBody>(
      apiPath(`/unsubscribeFromNewJobNotification`),
      {
        method: "POST",
        data: data,
      }
    );
  };

  public getAdvertiserView = async (advertiserId: string) => {
    return apiFetch<GetAdvertiserViewResultBody>(
      apiPath(`/getAdvertiserView/${advertiserId}`)
    );
  };

  public getStudent = async (studentId: string) => {
    return apiFetchAuthenticated<GetStudentResultBody>(
      apiPath(`/getStudent/${studentId}`)
    );
  };

  public getUser = async (userId: string) => {
    return apiFetchAuthenticated<GetUserResultBody>(
      apiPath(`/getUser/${userId}`)
    );
  };

  public updateStudent = async (data: UpdateStudentRequestBody) => {
    return apiFetchAuthenticated<UpdateStudentResultBody>(
      apiPath(`/updateStudent`),
      {
        method: "POST",
        data: data,
      }
    );
  };

  public getJobView = async (jobId: string) => {
    return apiFetch<GetJobViewResultBody>(apiPath(`/getJobView/${jobId}`));
  };

  public listJobs = async (search: ListJobsRequestQuery) => {
    return apiFetch<ListJobsResultBody>(apiPath(`/listJobs`), {
      params: search,
    });
  };

  public listAdvertisers = async (search: ListAdvertisersRequestQuery) => {
    return apiFetch<ListAdvertisersResultBody>(apiPath(`/listAdvertisers`), {
      params: search,
    });
  };

  public importStagStudy = async (data: ImportStagStudyRequestBody) => {
    return apiFetchAuthenticated<ImportStagStudyResultBody>(
      apiPath(`/importStagStudy`),
      {
        method: "POST",
        data: data,
      }
    );
  };

  public requestForgottenPassword = async (
    data: RequestForgottenPasswordRequestBody
  ) => {
    return apiFetch<RequestForgottenPasswordResultBody>(
      apiPath(`/requestForgottenPassword`),
      {
        method: "POST",
        data: data,
      }
    );
  };

  public resetForgottenPassword = async (
    data: ResetForgottenPasswordRequestBody
  ) => {
    return apiFetch<ResetForgottenPasswordResultBody>(
      apiPath(`/resetForgottenPassword`),
      {
        method: "POST",
        data: data,
      }
    );
  };

  public createStudy = async (data: CreateStudyRequestBody) => {
    return apiFetchAuthenticated<CreateStudyResultBody>(
      apiPath(`/createStudy`),
      {
        method: "POST",
        data: data,
      }
    );
  };

  public updateStudy = async (data: UpdateStudyRequestBody) => {
    return apiFetchAuthenticated<UpdateStudyResultBody>(
      apiPath(`/updateStudy`),
      {
        method: "POST",
        data: data,
      }
    );
  };

  public deleteStudy = async (data: DeleteStudyRequestBody) => {
    return apiFetchAuthenticated<DeleteStudyResultBody>(
      apiPath(`/deleteStudy`),
      {
        method: "DELETE",
        data: data,
      }
    );
  };
}

function apiPath(path: string) {
  const apihost = process.env.NEXT_PUBLIC_API_ENDPOINT;
  return `${apihost}${path}`;
}

const apiFetch = <TSuccessPayload>(
  url: string,
  config?: AxiosRequestConfig
) => {
  return axios(url, config).then((res: AxiosResponse<TSuccessPayload>) => {
    // casting undefined to null must be here,
    // otherwise react-query since v4 will throw an error:
    // >Query data cannot be undefined. Please make sure to return a value other than undefined from your query function
    // https://tanstack.com/query/v4/docs/react/guides/migrating-to-react-query-4#undefined-is-an-illegal-cache-value-for-successful-queries
    // return res.data.result;
    // as typeof res.data is hack
    // to not poison mutation onSuccess callbacks with nulls.
    return res.data ?? (null as typeof res.data);
  });
};

const apiFetchAuthenticated = <TSuccessPayload>(
  url: string,
  config?: AxiosRequestConfig
) => {
  config = config ?? {};
  const token = accessTokenStorage.getToken();

  if (!token) {
    throw new Error("Trying to authenticated fetch but Token is missing!");
  }

  config = {
    ...config,
    headers: {
      Authorization: "Bearer " + token,
      ...(config["headers"] ?? {}),
    },
  };

  return apiFetch<TSuccessPayload>(url, config);
};

export function isAxiosError<ResponseType>(
  error: unknown
): error is AxiosError<ResponseType> {
  return axiosFactory.isAxiosError(error);
}
export const api = new Api();
