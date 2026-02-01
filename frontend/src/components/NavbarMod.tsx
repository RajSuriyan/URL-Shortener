import { useAuth } from "@/context/useAuth";
import {
  Button,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/react";
export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M3 12h4a3 3 0 0 1 0 6H3a3 3 0 0 1 0-6zm14 0h4a3 3 0 0 1 0 6h-4a3 3 0 0 1 0-6zM7 15h10v-2H7z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default function NavbarMod() {
  const {loggedIn} = useAuth();
  const menuItems = [
    "Home",
    "About",
    "Contact",
    // "Analytics",
    // "System",
    // "Deployments",
    // "My Settings",
    // "Team Settings",
    // "Help & Feedback",
    "Log Out",
  ];
  

  return (
      <Navbar className="bg-gray-100" maxWidth="xl" height="3rem" >
        <NavbarContent className="sm:hidden" justify="start">
          <NavbarMenuToggle />
        </NavbarContent>
        <NavbarContent className="sm:hidden pr-3" justify="center">
          <NavbarBrand>
            <AcmeLogo />
            <a href="/" className="font-bold text-inherit">Mirco URL</a>
          </NavbarBrand>
        </NavbarContent>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarBrand>
            <AcmeLogo />
            <a href="/" className="font-bold text-inherit">Mirco URL</a>
          </NavbarBrand>
          <NavbarItem >
            <Link color="foreground" href="/about">
              About
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="/contact">
              Contact
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem className="hidden md:flex">
            <Link href="/login" className={(loggedIn)?"hidden":""} >Login</Link>
          </NavbarItem>
          <NavbarItem className="flex gap-1">
            <Button className={(loggedIn)?"hidden":""} as={Link} color="warning" href="/signup" variant="flat">
              Sign Up
            </Button>
            {loggedIn && (<Button className={(loggedIn)?"":"hidden"} as={Link} color="warning" href="/logout" variant="flat">
              Profile
            </Button>)}
            <Button className={(loggedIn)?"":"hidden"} as={Link} color="warning" href="/logout" variant="flat">
              Logout
            </Button>
          </NavbarItem>
        </NavbarContent>
        <NavbarMenu>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                className="w-full"
                color={
                  index === -1 ? "warning" : index === menuItems.length - 1 ? "danger" : "foreground"
                }
                href="#"
                size="lg"
              >
                {item}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
  );
}
