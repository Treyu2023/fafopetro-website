import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { t as Button } from "./button-veSv-uKG.mjs";
import { t as Badge } from "./badge-D6uGyf42.mjs";
import { a as CardHeader, i as CardFooter, n as CardContent, o as CardTitle, r as CardDescription, t as Card } from "./card-D-tAiT0s.mjs";
import { a as Sparkles, h as ExternalLink, i as Terminal, m as Film } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/software-B87VgEuG.js
var import_jsx_runtime = require_jsx_runtime();
var products = [
	{
		icon: Film,
		name: "FAFO Local Media",
		tag: "Chrome extension · New Tab",
		description: "Turn your Chrome New Tab into a personal media center. Link local video and photo folders for immersive playback — playlists, cinema mode, VFX, and ambilight — with files that stay on your machine.",
		features: [
			"Photos, videos, or simultaneous mode",
			"Playlist manager & visual library",
			"Cinema, grid, carousel, and collage layouts",
			"Particle VFX and theme engine"
		],
		href: "https://chromewebstore.google.com/detail/fafo-local-media-29/phdfnpaigllbkdjfflapdmcapkapolpe",
		cta: "Chrome Web Store"
	},
	{
		icon: Terminal,
		name: "FAFO Progen",
		tag: "Chrome extension · Prompt engineering",
		description: "A precision command console for AI artists and prompt engineers. Build high-fidelity prompts layer by layer for Grok Imagine and other generators — modular sections, dynamic context, and surgical rerolls.",
		features: [
			"Camera, composition, character, lighting modules",
			"Dynamic context / find-replace",
			"Syntax-highlighted terminal output",
			"Local-only — no prompt data to the cloud"
		],
		href: "https://chromewebstore.google.com/detail/fafo-progen/epmbhjnfllakabbmoblbjbpjlimlaijl",
		cta: "Chrome Web Store"
	},
	{
		icon: Sparkles,
		name: "AI tools & support",
		tag: "Productivity",
		description: "AI-focused utilities and prompt-engineering experiments under the FAFO banner. Questions about any extension? Reach support by email.",
		features: [
			"Prompt engineering utilities",
			"Privacy-first, local-first mindset",
			"Active development from Siler City, NC",
			"Support: Rkey@FAFOPETRO.com"
		],
		href: "mailto:Rkey@FAFOPETRO.com?subject=Software%20support",
		cta: "Email support"
	}
];
function SoftwarePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-b border-border grid-bg py-14 md:py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-site max-w-3xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					className: "mb-4",
					children: "Software"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-semibold tracking-tight sm:text-4xl",
					children: "Tools built by FAFO"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-muted leading-relaxed",
					children: "Alongside field service, FAFO ships browser tools for media and AI workflows — privacy-first, local-first, and free to try on the Chrome Web Store."
				})
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-14 md:py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "container-site grid gap-5 lg:grid-cols-3",
			children: products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "flex flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-3 flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-primary-soft text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(p.icon, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium uppercase tracking-[0.12em] text-subtle",
							children: p.tag
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "mt-1",
							children: p.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: p.description })
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "flex-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2 text-sm text-muted",
							children: p.features.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" }), f]
							}, f))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "secondary",
						className: "w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: p.href,
							target: "_blank",
							rel: "noreferrer",
							children: [p.cta, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-4 w-4" })]
						})
					}) })
				]
			}, p.name))
		})
	})] });
}
//#endregion
export { SoftwarePage as component };
