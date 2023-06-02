import { Alert, AlertTitle } from "@mui/material";
import Container from "@mui/material/Container";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { Link } from "../../components/Link/Link";

const Uspech: NextPage = () => {
  return (
    <Container>
      <Alert sx={{ marginTop: 2 }} severity="success">
        <AlertTitle>Úspěch 🥳</AlertTitle>
        Byli jste úspěšně zaregistrováni. Zkontrolujte Vaši emailovou schránku
        kam Vám přijde potvrzovací email. Po ověření se budete moci přihlásit.
      </Alert>
    </Container>
  );
};

export default Uspech;
