import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import 'source-map-support/register'; // Error stack JS to TS
import {approveJobHandler} from './handler/approveJob';
import {archiveJobHandler} from './handler/archiveJob';
import {authenticateHandler} from './handler/authenticate';
import {createJobHandler} from './handler/createJob';
import {createStudyHandler} from './handler/createStudy';
import {deleteJobHandler} from './handler/deleteJob';
import {deleteStudyHandler} from './handler/deleteStudy';
import {getAdvertiserViewHandler} from './handler/getAdvertiserView';
import {getJobViewHandler} from './handler/getJobView';
import {getNewJobNotificationConfigHandler} from './handler/getNewJobNotificationConfig';
import {getStudentHandler} from './handler/getStudent';
import {getUserHandler} from './handler/getUser';
import {importStagStudyHandler} from './handler/importStagStudy';
import {listAdvertisersHandler} from './handler/listAdvertisers';
import {listJobsHandler} from './handler/listJobs';
import {registerAdvertiserHandler} from './handler/registerAdvertiser';
import {replyToJobHandler} from './handler/replyToJob';
import {requestEmailChangeHandler} from './handler/requestEmailChange';
import {requestForgottenPasswordHandler} from './handler/requestForgottenPassword';
import {resetForgottenPasswordHandler} from './handler/resetForgottenPassword';
import {subscribeToNewJobNotificationHandler} from './handler/subscribeToNewJobNotification';
import {unsubscribeFromNewJobNotificationHandler} from './handler/unsubscribeFromNewJobNotification';
import {updateAdvertiserProfileHandler} from './handler/updateAdvertiserProfile';
import {updateJobHandler} from './handler/updateJob';
import {updateStudentHandler} from './handler/updateStudent';
import {updateStudyHandler} from './handler/updateStudy';
import {updateUserHandler} from './handler/updateUser';
import {parseQueryString} from './handler/util/queryParams';
import {verifyAdvertiserHandler} from './handler/verifyAdvertiser';
import {verifyEmailChangeHandler} from './handler/verifyEmailChange';
import {
  authenticateUser,
  customErrorHandlerMiddleware,
  notFoundRouteErrorMiddleware,
} from './middleware';
// const __filename = url.fileURLToPath(import.meta.url);
// const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const app = express();

// allow all cors
app.use(
  cors({
    // takes care of preflight request
    // so my wrapper endpoint is not executed twice!
    // (once for preflight and once for actual request)
    preflightContinue: false,
    optionsSuccessStatus: 200,
  })
);

//  URL query parser
app.set('query parser', parseQueryString);

// Body parser - transform text body to it's JSON representation
// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.text());
// app.use(bodyParser.raw());

app.use((req, res, next) => {
  // log incomming request to see something is hapenning
  console.log(`Request ${new Date()}`);
  next();
});
// Register routes/handlers
app.post(`/approveJob`, authenticateUser, approveJobHandler);
app.post(`/archiveJob`, authenticateUser, archiveJobHandler);
app.post(`/authenticate`, authenticateHandler);
app.post('/createJob', authenticateUser, createJobHandler);
app.post('/createJob', authenticateUser, createStudyHandler);
app.post('/deleteJob', authenticateUser, deleteJobHandler);
app.post(
  '/unsubscribeFromNewJobNotification',
  authenticateUser,
  unsubscribeFromNewJobNotificationHandler
);
app.post('/deleteStudy', authenticateUser, deleteStudyHandler);
app.get(`/getAdvertiserView/:advertiserId`, getAdvertiserViewHandler);
app.get(`/getJobView/:jobId`, getJobViewHandler);
app.get(`/getUser/:userId`, authenticateUser, getUserHandler);
app.get(
  `/getNewJobNotificationConfig/:userId`,
  authenticateUser,
  getNewJobNotificationConfigHandler
);
app.get(`/getStudent/:studentId`, authenticateUser, getStudentHandler);
app.post('/importStagStudy', authenticateUser, importStagStudyHandler);
app.get('/listAdvertisers', listAdvertisersHandler);
app.get('/listJobs', listJobsHandler);
app.post('/registerAdvertiser', registerAdvertiserHandler);
app.post('/replyToJob', authenticateUser, replyToJobHandler);
app.post('/requestEmailChange', authenticateUser, requestEmailChangeHandler);
app.post('/requestForgottenPassword', requestForgottenPasswordHandler);
app.post('/resetForgottenPassword', resetForgottenPasswordHandler);
app.post(
  '/subscribeToNewJobNotification',
  authenticateUser,
  subscribeToNewJobNotificationHandler
);
app.post(
  '/updateAdvertiserProfile',
  authenticateUser,
  updateAdvertiserProfileHandler
);
app.post('/updateJob', authenticateUser, updateJobHandler);
app.post('/updateStudent', authenticateUser, updateStudentHandler);
app.post('/updateStudy', authenticateUser, updateStudyHandler);
app.post('/updateUser', authenticateUser, updateUserHandler);
app.post('/verifyAdvertiser', verifyAdvertiserHandler);
app.post('/verifyEmailChange', verifyEmailChangeHandler);

// catch 404 and forward to error handler
app.use(notFoundRouteErrorMiddleware);
// Custom error handler - returns normalized error reponse
// https://expressjs.com/en/guide/error-handling.html
app.use(customErrorHandlerMiddleware);

app.listen(9999, () => console.info('Server running on port 9999...'));

export default app;
