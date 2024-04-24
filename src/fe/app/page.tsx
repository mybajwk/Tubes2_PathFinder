import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code"
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";

export default function Home() {
	return (
		<section className="flex flex-col items-center justify-center gap-4 py-3 md:py-10">
			<div className="inline-block max-w-lg text-center justify-center mt-8">
				<h1 className={title()}>Welcome&nbsp;to </h1>
				<h1 className={title({ color: "green" })}>Path&nbsp;Finder</h1>
				<br />
				<h1 className={title()}>
					where knowledge exploration becomes an unforgettable adventure.
				</h1>
				<h2 className={subtitle({ class: "mt-4" })}>
					Beautiful, fast and modern.
				</h2>
			</div>

			<div className="flex gap-3 mt-8">
				<Snippet hideSymbol hideCopyButton variant="flat">
					<span>
						Get started 
							<Link
							className={`${buttonStyles({ color: "primary", radius: "full", variant: "shadow" })} ml-2`}
							href="/app"
						>
							Search
						</Link>
					</span>
				</Snippet>
			</div>
		</section>
	);
}
