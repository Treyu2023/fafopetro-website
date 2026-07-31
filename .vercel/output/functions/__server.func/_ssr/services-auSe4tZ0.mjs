import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { t as Button } from "./button-veSv-uKG.mjs";
import { t as Badge } from "./badge-D6uGyf42.mjs";
import { a as CardHeader, n as CardContent, o as CardTitle, t as Card } from "./card-D-tAiT0s.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as ArrowRight, _ as CircuitBoard, f as Gauge, g as ClipboardCheck, n as Wrench, p as Fuel } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/services-auSe4tZ0.js
var import_jsx_runtime = require_jsx_runtime();
var offerings = [
	{
		icon: Fuel,
		title: "Fuel dispenser service",
		points: [
			"Repair and preventive maintenance",
			"Error diagnosis and parts replacement",
			"Brand-agnostic field support on common platforms",
			"Keep lanes open and customers pumping"
		]
	},
	{
		icon: CircuitBoard,
		title: "POS & payment support",
		points: [
			"Register and payment path troubleshooting",
			"Hardware swaps and cable / power issues",
			"Coordinate with your existing vendors when needed",
			"Minimize lost sales from dead terminals"
		]
	},
	{
		icon: Gauge,
		title: "ATG & tank monitoring",
		points: [
			"Automatic tank gauge service",
			"Sensor and probe-related issues",
			"Alarm follow-up and site checks",
			"Monitoring gear you already own"
		]
	},
	{
		icon: ClipboardCheck,
		title: "Site visits & assessments",
		points: [
			"Walk the property and document issues",
			"Prioritize safety and uptime",
			"Straight talk on cost vs. fix",
			"Follow-through you can call back about"
		]
	}
];
function ServicesPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-b border-border grid-bg py-14 md:py-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-site max-w-3xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						className: "mb-4",
						children: "Services"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-semibold tracking-tight sm:text-4xl",
						children: "Equipment service built for real C-stores"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-muted leading-relaxed",
						children: "FAFO Petro Services focuses on the gear that keeps your store open: dispensers, POS, and ATG. Competitive pricing, field experience across the brands you already run, and service for the Triad and surrounding North Carolina markets."
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-14 md:py-16",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container-site grid gap-4 md:grid-cols-2",
				children: offerings.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2 flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-primary-soft text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(o.icon, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: o.title })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2.5",
					children: o.points.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-2.5 text-sm text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "mt-0.5 h-4 w-4 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p })]
					}, p))
				}) })] }, o.title))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-t border-border bg-bg-elevated py-14",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-site flex flex-col gap-6 md:flex-row md:items-center md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-semibold",
					children: "Need a tech on site?"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Tell us what's down — we'll follow up by text or email."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 sm:flex-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/request",
							children: ["Request service", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "secondary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "sms:+19728771848",
							children: "Text (972) 877-1848"
						})
					})]
				})]
			})
		})
	] });
}
//#endregion
export { ServicesPage as component };
