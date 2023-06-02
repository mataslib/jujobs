import { Alert, AlertTitle } from "@mui/material";
import Container from "@mui/material/Container";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { Link } from "../../../components/Link/Link";

const Upraveno: NextPage = () => {
  const router = useRouter();
  const { jobId } = router.query;

  return (
    <Container>
      <Alert sx={{ marginTop: 2 }} severity="success">
        <AlertTitle>Úspěch 🥳</AlertTitle>
        Váš inzerát byl upraven.
      </Alert>
      <Link href={`/nabidka/${jobId}`}>Zobrazit nabídku</Link>
    </Container>
  );
};

export default Upraveno;
