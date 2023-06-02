import {
  faFlag,
  faGlobeEurope,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function PlaceIcon(props: { place: string }): JSX.Element {
  const map = {
    "Celá Česká republika": faFlag,
    Zahraničí: faGlobeEurope,
    "Jižní Čechy": faMapMarkerAlt,
  };

  const icon = map[props.place];

  return icon ? <FontAwesomeIcon title="místo" icon={icon} fixedWidth /> : "";
}
