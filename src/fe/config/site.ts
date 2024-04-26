export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	name: "PathFinder",
	description: "Make beautiful websites regardless of your design experience.",
	navItems: [
		{
			label: "Home",
			href: "/",
		},
    {
      label: "App",
      href: "/app",
    },
    {
      label: "About",
      href: "/about",
    }
	],
	navMenuItems: [
		{
			label: "Home",
			href: "/",
		},
		{
			label: "App",
			href: "/app",
		},
		{
			label: "About",
			href: "/about",
		}
	],
};
