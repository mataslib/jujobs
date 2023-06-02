import { useUser } from "../hooks/useUser";
import { AdvertiserDetailAdvertiserAdminBar } from "./AdvertiserDetailAdvertiserAdminBar";
import { AdvertiserDetailUniversityAdminBar } from "./AdvertiserDetailUniversityAdminBar";
export const AdvertiserDetailAdminBar = (props: { advertiserId: string }) => {
  const { advertiserId } = props;
  const { user } = useUser();

  if (!user) {
    return null;
  }

  if (user.roles.includes("admin")) {
    return <AdvertiserDetailUniversityAdminBar advertiserId={advertiserId} />;
  }

  if (user.roles.includes('advertiser') && user.advertiserId === advertiserId) {
    return <AdvertiserDetailAdvertiserAdminBar advertiserId={advertiserId} />;
  }

  return null;
};
