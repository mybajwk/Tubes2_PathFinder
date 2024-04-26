import {
	Navbar as NextUINavbar,
	NavbarContent,
	NavbarMenu,
	NavbarMenuToggle,
	NavbarBrand,
	NavbarItem,
	NavbarMenuItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";

import { link as linkStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import NextLink from "next/link";
import clsx from "clsx";

import { ThemeSwitch } from "@/components/theme-switch";
import {
	GithubIcon,
	HeartFilledIcon,
	SearchIcon,
} from "@/components/icons";

import { Logo } from "@/components/icons";

export const Navbar = () => {

	return (
		<NextUINavbar maxWidth="xl" position="sticky">
			<NavbarContent className="basis-1/2 sm:basis-full" justify="start">
				<NavbarBrand as="li" className="gap-1 max-w-fit">
					<NextLink className="flex justify-start items-center" href="/">
						<Logo />
						<p className="font-bold text-inherit text-green-500">PathFinder</p>
					</NextLink>
				</NavbarBrand>
				<ul className="hidden sm:flex gap-4 justify-start ml-2">
					{siteConfig.navItems.map((item) => (
						<NavbarItem key={item.href}>
							<NextLink
								className={clsx(
									linkStyles({ color: "foreground" }),
									"data-[active=true]:text-primary data-[active=true]:font-medium"
								)}
								color="foreground"
								href={item.href}
							>
								{item.label}
							</NextLink>
						</NavbarItem>
					))}
				</ul>
			</NavbarContent>

			<NavbarContent
				className="hidden sm:flex basis-1/5 sm:basis-full"
				justify="end"
			>
				<NavbarItem className="hidden sm:flex gap-2">
					<ThemeSwitch />
				</NavbarItem>
				<NavbarItem className="hidden sm:flex">
					<Button
            			isExternal
						as={Link}
						className="text-sm font-normal text-default-600 bg-default-100"
						startContent={<GithubIcon/>}
						variant="flat"
						href="https://github.com/mybajwk/Tubes2_PathFinder"
					>
					</Button>
				</NavbarItem>
			</NavbarContent>

			<NavbarContent className="sm:hidden basis-1 pl-2" justify="end">
				<ThemeSwitch />
				<NavbarItem className="sm:hidden">
					<Button
            			isExternal
						as={Link}
						className="text-sm font-normal text-default-600 bg-default-100 hide-below"
						startContent={<GithubIcon />}
						variant="flat"
						href="https://github.com/mybajwk/Tubes2_PathFinder"
						size="sm"
					>
					</Button>
				</NavbarItem>
				<NavbarMenuToggle />
			</NavbarContent>

			<NavbarMenu>
				<div className="mx-4 mt-2 flex flex-col gap-2">
					{siteConfig.navMenuItems.map((item, index) => (
						<NavbarMenuItem key={`${item}-${index}`}>
							<Link
								color="foreground"
								href={item.href}
								size="lg"
							>
								{item.label}
							</Link>
						</NavbarMenuItem>
					))}
				</div>
			</NavbarMenu>
		</NextUINavbar>
	);
};
