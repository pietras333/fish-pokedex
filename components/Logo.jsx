import Image from "next/image";
import Link from "next/link";
import LogoIcon from "@/public/images/logo.svg";

const Logo = ({ isMobile }) => (
  <Link href="/">
    <Image
      src={LogoIcon}
      alt="Fish Pokedex"
      width={isMobile ? 48 : 64}
      height={isMobile ? 24 : 32}
      priority
    />
  </Link>
);

export default Logo;
