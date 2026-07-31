import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { t as Button } from "./button-veSv-uKG.mjs";
import { t as Badge } from "./badge-D6uGyf42.mjs";
import { a as CardHeader, n as CardContent, o as CardTitle, r as CardDescription, t as Card } from "./card-D-tAiT0s.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as ArrowRight, _ as CircuitBoard, b as BadgeCheck, f as Gauge, n as Wrench, o as Shield, p as Fuel, s as Phone, u as MapPin } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DmqHbhnw.js
var import_jsx_runtime = require_jsx_runtime();
var services = [
	{
		icon: Fuel,
		title: "Fuel dispensers",
		body: "Service and maintenance on the dispenser brands your store already runs — keep fuel flowing and downtime short."
	},
	{
		icon: CircuitBoard,
		title: "POS systems",
		body: "Point-of-sale troubleshooting, payment path issues, and keep-the-register-ringing field support."
	},
	{
		icon: Gauge,
		title: "ATG equipment",
		body: "Automatic tank gauges and monitoring gear — calibration, repair, and reliable tank-side support."
	}
];
var reasons = [
	{
		icon: BadgeCheck,
		title: "25+ years in the field",
		body: "Second-generation technician. Real site experience — not a call-center script."
	},
	{
		icon: MapPin,
		title: "Triad & surrounding NC",
		body: "Based in Siler City, positioned to serve the Triad and nearby North Carolina markets."
	},
	{
		icon: Shield,
		title: "Independent & competitive",
		body: "Owner-operator pricing without the corporate overhead. Brands you know and trust."
	}
];
function HomePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative overflow-hidden border-b border-border grid-bg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,color-mix(in_oklab,var(--color-primary)_14%,transparent),transparent_55%)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container-site relative py-16 md:py-24 lg:py-28",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-3xl fade-up",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							className: "mb-5",
							children: "Est. May 8, 2025 · Siler City, NC"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-balance text-4xl font-semibold tracking-tight text-fg sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]",
							children: "FAFO Petro Services"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 max-w-2xl text-lg text-muted leading-relaxed",
							children: "Conveniently located to serve the Triad and surrounding NC areas. Servicing and maintaining C-store dispenser, POS, and ATG equipment."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-2xl text-sm text-subtle leading-relaxed",
							children: "Founded by Ryan W. Key — 2nd generation field service technician with 25+ years of field experience. Knowledgeable in most of the brands you know and trust."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-col gap-3 sm:flex-row sm:items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/request",
									children: ["Request service", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								variant: "secondary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: "sms:+19728771848",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4" }), "Text (972) 877-1848"]
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-xs text-subtle",
							children: "Texting preferred · Competitive pricing"
						})
					]
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-b border-border py-16 md:py-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-site",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-[0.16em] text-primary",
						children: "What we service"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 text-2xl font-semibold tracking-tight sm:text-3xl",
						children: "Dispensers, POS, and ATG"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/services",
							children: ["Full services", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 md:grid-cols-3",
					children: services.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "bg-bg-elevated",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-3 flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-primary-soft text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: s.title }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: s.body })
						] })
					}, s.title))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-b border-border bg-bg-elevated py-16 md:py-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-site",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-10 max-w-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold uppercase tracking-[0.16em] text-primary",
							children: "Why FAFO"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 text-2xl font-semibold tracking-tight sm:text-3xl",
							children: "Field-first service without the corporate runaround"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-muted leading-relaxed",
							children: "Join us by filling out a service application today — independent support for stores that want a real technician who shows up and gets it done."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 md:grid-cols-3",
					children: reasons.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[var(--radius-xl)] border border-border bg-surface p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(r.icon, { className: "mb-3 h-5 w-5 text-primary" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold",
								children: r.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted leading-relaxed",
								children: r.body
							})
						]
					}, r.title))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-b border-border py-16 md:py-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container-site",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-[var(--radius-2xl)] border border-border bg-surface p-8 md:p-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-6 md:flex-row md:items-center md:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "max-w-xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-3 flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-primary-soft text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "h-5 w-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-2xl font-semibold tracking-tight",
									children: "Also building software tools"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-muted leading-relaxed",
									children: "FAFO Local Media, FAFO Progen, and other browser tools — privacy-first utilities from the same shop."
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							variant: "secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/software",
								children: ["Explore software", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
							})
						})]
					})
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "py-16 md:py-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "container-site",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "overflow-hidden border-primary/20 bg-[linear-gradient(135deg,var(--color-surface),var(--color-bg-elevated))]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl font-semibold tracking-tight",
							children: "Ready to get your site back online?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 max-w-lg text-muted",
							children: "Request service online, or text the number below. Competitive pricing. Brands you already trust."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3 sm:flex-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/request",
									children: "Fill out service form"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								variant: "outline",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "tel:+19728771848",
									children: "(972) 877-1848"
								})
							})]
						})]
					})
				})
			})
		})
	] });
}
//#endregion
export { HomePage as component };
