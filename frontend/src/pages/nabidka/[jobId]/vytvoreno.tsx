import { Alert, AlertTitle } from "@mui/material";
import Container from "@mui/material/Container";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { Link } from "../../../components/Link/Link";

const Vytvoreno: NextPage = () => {
  const router = useRouter();
  const { jobId } = router.query;

  return (
    <Container>
      <Alert sx={{ marginTop: 2 }} severity="success">
        <AlertTitle>Úspěch 🥳</AlertTitle>
        Váš inzerát byl odeslán ke schválení a bude zveřejněn po schválení. O
        jeho schválení budete informováni.
      </Alert>
      {jobId && <Link href={`/nabidka/${jobId}`}>Zobrazit nabídku</Link>}
    </Container>
  );
};

export default Vytvoreno;
