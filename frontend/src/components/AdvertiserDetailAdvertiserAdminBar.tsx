import { Button, Link } from "@mui/material";

export const AdvertiserDetailAdvertiserAdminBar = (props: {
  advertiserId: string;
}) => {
  const { advertiserId } = props;

  return (
    <>
      <Link href={`/inzerent/${advertiserId}/nabidka/vytvorit`}>
        <Button variant="contained">Nový inzerát</Button>
      </Link>
      <Link href={`/inzerent/${advertiserId}/profil`}>
        <Button variant="contained">Upravit profil</Button>
      </Link>
    </>
  );
};
