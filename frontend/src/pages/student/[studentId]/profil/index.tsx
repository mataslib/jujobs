import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import {
  faCircleCheck,
  faExclamationCircle,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { Alerts, useAlerts } from "src/components/Alerts";
import { ApiErrorAlert } from "../../../../components/ApiErrorAlert";
import { Link } from "../../../../components/Link/Link";
import { MyAlert } from "../../../../components/MyAlert";
import { useDeleteStudy } from "../../../../hooks/useDeleteStudy";
import { useGetStudent } from "../../../../hooks/useGetStudent";
import { useImportStagStudy } from "../../../../hooks/useImportStagStudy";
import { useUser } from "../../../../hooks/useUser";
import { withConfirm } from "../../../../util/utils";

const StudentProfil: NextPage = () => {
  const router = useRouter();
  const { studentId } = router.query;
  const theme = useTheme();

  const { user } = useUser();

  const getAlerts = useAlerts();
  const deleteStudy = useDeleteStudy();
  const getStudent = useGetStudent({
    studentId: studentId as string | undefined,
    queryOptions: {
      onError: getAlerts.addErrorAlert,
    },
  });

  const queryClient = useQueryClient();
  const importStagStudy = useImportStagStudy();
  const [isGettingToken, setIsGettingToken] = useState(false);
  const getStagTokenByStagSignIn = async () => {
    setIsGettingToken(true);
    router.push(
      `https://wstag.jcu.cz/ws/login?originalURL=${window.location.href}`
    );
  };
  const [stagUserTicket, setStagUserTicket] = useState<string>();

  useEffect(() => {
    if (router.query.stagUserTicket) {
      setStagUserTicket(router.query.stagUserTicket);
      router.replace(window.location.href.split("?")[0]);
    }
  }, [router.query]);

  // getStudent - {
  // linkedin:
  // cv
  // studies: []
  // }
  // importStagStudy
  // updateStudent
  // updateStudy if study === stag -> to user

  if (getStudent.queryResult.isFetching) {
    return (
      <Layout>
        <CircularProgress />
      </Layout>
    );
  }

  if (getStudent.queryResult.isError) {
    return (
      <Layout>
        <Alerts usedAlerts={getAlerts} />
      </Layout>
    );
  }

  if (getStudent.queryResult.data) {
    return (
      <Layout>
        <Typography variant="h1">Jan Novák</Typography>

        {user &&
          user.studentId === studentId &&
          user.roles.includes("student") && (
            <Link noLinkStyle href={`/student/${studentId}/profil/upravit`}>
              <Button variant="outlined">Upravit profil</Button>
            </Link>
          )}
        {getStudent.queryResult.data?.linkedin && (
          <Box sx={{ my: 2 }}>
            <Typography variant="h3">Linkedin</Typography>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="body1">
                <FontAwesomeIcon icon={faLinkedin} />{" "}
                <a
                  target="_blank"
                  href={getStudent.queryResult.data.linkedin}
                  rel="noreferrer"
                >
                  {getStudent.queryResult.data.linkedin}
                </a>
              </Typography>
            </Paper>
          </Box>
        )}

        {getStudent.queryResult.data?.cv && (
          <Box sx={{ my: 2 }}>
            <Typography variant="h3">Životopis</Typography>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="body1">
                <FontAwesomeIcon icon={faFileAlt} />{" "}
                <a
                  target="_blank"
                  href={getStudent.queryResult.data.cv}
                  rel="noreferrer"
                >
                  {getStudent.queryResult.data.cv}
                </a>
              </Typography>
            </Paper>
          </Box>
        )}

        <Typography variant="h2">Studium</Typography>

        {!stagUserTicket &&
          user &&
          user.studentId === studentId &&
          user.roles.includes("student") && (
            <Box sx={{ display: "flex", gap: 1 }}>
              <LoadingButton
                loading={isGettingToken}
                onClick={getStagTokenByStagSignIn}
                variant="outlined"
              >
                Importovat studium ze Stagu (krok 1/2)
              </LoadingButton>

              <Link noLinkStyle href={`/studium/vytvorit`}>
                <Button variant="outlined">Přidat studium ručně</Button>
              </Link>
            </Box>
          )}

        {stagUserTicket &&
          user &&
          user.studentId === studentId &&
          user.roles.includes("student") && (
            <>
              <ApiErrorAlert error={importStagStudy.error} />
              {importStagStudy.isSuccess && <MyAlert>Úspěch!</MyAlert>}
              <LoadingButton
                loading={importStagStudy.isLoading}
                onClick={async () => {
                  await importStagStudy.mutateAsync(
                    {
                      stagUserTicket,
                      studentId: studentId as string,
                    },
                    {
                      onSuccess: () => {
                        queryClient.invalidateQueries([
                          "getStudent",
                          studentId,
                        ]);
                      },
                    }
                  );
                  setStagUserTicket(undefined);
                }}
                variant="contained"
                color="success"
              >
                Dokončit import studia ze Stagu (krok 2/2)
              </LoadingButton>
            </>
          )}

        {deleteStudy.isSuccess && (
          <Stack sx={{ my: 1 }}>
            <MyAlert severity="success">Úspěch!</MyAlert>
            <ApiErrorAlert error={deleteStudy.error} />
          </Stack>
        )}

        {getStudent.queryResult.data?.studies?.map((study) => (
          <Paper key={study._id} sx={{ my: 2 }}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h3">{study.nazevSp}</Typography>
              <Typography variant="h4">
                {typSpKeyToReadable(study.typSpKey)},{" "}
                {fakultaSpTypeToReadable(study.fakultaSp)}
              </Typography>
              {study.dataSource === "stag" && (
                <Box sx={{ color: theme.palette.success.main }}>
                  <FontAwesomeIcon icon={faCircleCheck} /> Důvěryhodné
                  (importováno školním systémem)
                </Box>
              )}
              {study.dataSource === "user" && (
                <Box sx={{ color: theme.palette.warning.main }}>
                  <FontAwesomeIcon icon={faExclamationCircle} /> Neověřené
                  (zadáno nebo upraveno ručně studentem)
                </Box>
              )}

              {user &&
                user.studentId === studentId &&
                user.roles.includes("student") && (
                  <>
                    <Box sx={{ my: 1, display: "flex", gap: 1 }}>
                      <LoadingButton
                        variant="contained"
                        loading={deleteStudy.isLoading}
                        onClick={withConfirm(async () => {
                          await deleteStudy.mutateAsync(
                            {
                              studyId: study._id,
                            },
                            {
                              onSuccess: () => {
                                queryClient.invalidateQueries([
                                  "getStudent",
                                  user.studentId,
                                ]);
                              },
                            }
                          );
                        }, `Opravdu chcete odstranit studium?`)}
                      >
                        Odstranit
                      </LoadingButton>
                      <Link
                        href={`/student/${user.studentId}/studium/${study._id}/upravit`}
                      >
                        <Button variant="contained">Upravit</Button>
                      </Link>
                    </Box>
                    <ApiErrorAlert error={deleteStudy.error} />
                  </>
                )}
              <TableContainer sx={{ p: 1 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Název předmětu</TableCell>
                      <TableCell>Známka</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {study?.predmetAbsolvoval.map((predmetAbsolvoval, idx) => (
                      <TableRow
                        key={idx}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {predmetAbsolvoval.nazevPredmetu}
                        </TableCell>
                        <TableCell>
                          {znamkaToReadable(predmetAbsolvoval.znamka)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Paper>
        ))}
      </Layout>
    );
  }

  return null;
};

const Layout = (props: { children: ReactNode }) => {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Container sx={{ my: 2 }}>
        <Box sx={{ my: 1 }}>
          <Typography variant="h2">Profil studenta</Typography>
        </Box>

        {props.children}
      </Container>
    </>
  );
};

function znamkaToReadable(znamka: string) {
  const znamkaTypeLabels = {
    S: "Splněno",
    "1": "1",
    "1,5": "1,5",
    "2": "2",
    "2,5": "2,5",
    "3": "3",
    N: "Nesplněno",
  };
  return znamkaTypeLabels[znamka] ?? znamka;
}

function fakultaSpTypeToReadable(fakulta: string) {
  const fakultaSpTypeLabels = {
    FEK: "Ekonomická fakulta",
    FFI: "Filozofická fakulta",
    FPE: "Pedagogická fakulta",
    FPR: "Přírodovědecká fakulta",
    FRO: "Fakulta rybářství a ochrany vod",
    FTE: "Teologická fakulta",
    FZE: "Fakulta zemědělská a technologická",
    FZS: "Zdravotně sociální fakulta",
  };
  return fakultaSpTypeLabels[fakulta] ?? fakulta;
}

function typSpKeyToReadable(typSpKey: string) {
  const typSpKeyTypeLabels = {
    "0": "Navazující",
    "1": "Univerzita 3. věku",
    "2": "Mezinárodně uznávaný kurz",
    "3": "Celoživotní",
    "4": "Ostatní",
    "6": "Rigorózní",
    "7": "Bakalářské",
    "8": "Magisterské",
    "9": "Doktorské",
  };
  return typSpKeyTypeLabels[typSpKey] ?? typSpKey;
}

export default StudentProfil;
