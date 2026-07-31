import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime, t as Label$1 } from "../_libs/@radix-ui/react-label+[...].mjs";
import { n as cn, t as Button } from "./button-veSv-uKG.mjs";
import { t as Badge } from "./badge-D6uGyf42.mjs";
import { v as CircleCheck } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/request-CRymbMjF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-11 w-full rounded-[var(--radius-sm)] border border-border-strong bg-bg-elevated px-3 py-2 text-sm text-fg placeholder:text-subtle transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label$1, {
	ref,
	className: cn("text-sm font-medium leading-none text-fg peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className),
	...props
}));
Label.displayName = Label$1.displayName;
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-28 w-full rounded-[var(--radius-sm)] border border-border-strong bg-bg-elevated px-3 py-2.5 text-sm text-fg placeholder:text-subtle transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
var empty = {
	name: "",
	business: "",
	phone: "",
	email: "",
	city: "",
	equipment: "Dispenser",
	urgency: "Normal",
	details: ""
};
function ServiceRequestForm() {
	const [form, setForm] = (0, import_react.useState)(empty);
	const [submitted, setSubmitted] = (0, import_react.useState)(false);
	const [sending, setSending] = (0, import_react.useState)(false);
	function update(key, value) {
		setForm((prev) => ({
			...prev,
			[key]: value
		}));
	}
	function onSubmit(e) {
		e.preventDefault();
		if (!form.name.trim() || !form.phone.trim()) {
			toast.error("Name and phone are required.");
			return;
		}
		setSending(true);
		const subject = encodeURIComponent(`Service Request — ${form.business || form.name} (${form.urgency})`);
		const body = encodeURIComponent([
			`Name: ${form.name}`,
			`Business: ${form.business || "—"}`,
			`Phone: ${form.phone}`,
			`Email: ${form.email || "—"}`,
			`City / area: ${form.city || "—"}`,
			`Equipment: ${form.equipment}`,
			`Urgency: ${form.urgency}`,
			"",
			"Details:",
			form.details || "—"
		].join("\n"));
		try {
			const key = "fafo-service-requests";
			const prev = JSON.parse(localStorage.getItem(key) || "[]");
			prev.unshift({
				...form,
				createdAt: (/* @__PURE__ */ new Date()).toISOString()
			});
			localStorage.setItem(key, JSON.stringify(prev.slice(0, 50)));
		} catch {}
		window.location.href = `mailto:Rkey@FAFOPETRO.com?subject=${subject}&body=${body}`;
		setSubmitted(true);
		setSending(false);
		toast.success("Request ready — your email app should open.");
	}
	if (submitted) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[var(--radius-xl)] border border-border bg-surface p-8 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-7 w-7" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-xl font-semibold",
				children: "Request prepared"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mx-auto mt-2 max-w-md text-sm text-muted leading-relaxed",
				children: [
					"Your email client should open with the details filled in. If it doesn't, text or call",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "tel:+19728771848",
						className: "text-primary no-underline",
						children: "(972) 877-1848"
					}),
					" ",
					"— texting preferred — or email",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "mailto:Rkey@FAFOPETRO.com",
						className: "text-primary no-underline",
						children: "Rkey@FAFOPETRO.com"
					}),
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-6",
				variant: "secondary",
				onClick: () => {
					setForm(empty);
					setSubmitted(false);
				},
				children: "Submit another request"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit,
		className: "space-y-5 rounded-[var(--radius-xl)] border border-border bg-surface p-6 md:p-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-5 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "name",
						children: "Your name *"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "name",
						value: form.name,
						onChange: (e) => update("name", e.target.value),
						placeholder: "Ryan Key",
						required: true,
						autoComplete: "name"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "business",
						children: "Business / store name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "business",
						value: form.business,
						onChange: (e) => update("business", e.target.value),
						placeholder: "Main St C-Store",
						autoComplete: "organization"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "phone",
						children: "Phone *"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "phone",
						type: "tel",
						value: form.phone,
						onChange: (e) => update("phone", e.target.value),
						placeholder: "(972) 877-1848",
						required: true,
						autoComplete: "tel"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "email",
						children: "Email"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "email",
						type: "email",
						value: form.email,
						onChange: (e) => update("email", e.target.value),
						placeholder: "you@store.com",
						autoComplete: "email"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "city",
						children: "City / service area"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "city",
						value: form.city,
						onChange: (e) => update("city", e.target.value),
						placeholder: "Greensboro, NC"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "equipment",
						children: "Equipment type"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						id: "equipment",
						value: form.equipment,
						onChange: (e) => update("equipment", e.target.value),
						className: "flex h-11 w-full rounded-[var(--radius-sm)] border border-border-strong bg-bg-elevated px-3 text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Dispenser" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "POS / payment" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "ATG / tank monitoring" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Multiple / other" })
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 sm:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "urgency",
						children: "Urgency"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						id: "urgency",
						value: form.urgency,
						onChange: (e) => update("urgency", e.target.value),
						className: "flex h-11 w-full rounded-[var(--radius-sm)] border border-border-strong bg-bg-elevated px-3 text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:max-w-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Normal" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Soon — this week" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Urgent — site down" })
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 sm:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "details",
						children: "What needs service?"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "details",
						value: form.details,
						onChange: (e) => update("details", e.target.value),
						placeholder: "Brand/model if known, error codes, when it started..."
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-subtle",
				children: "Opens your email to send to Rkey@FAFOPETRO.com. Or text (972) 877-1848."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				size: "lg",
				disabled: sending,
				children: sending ? "Preparing…" : "Send service request"
			})]
		})]
	});
}
function RequestPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-b border-border grid-bg py-14 md:py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-site max-w-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					className: "mb-4",
					children: "Service request"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-semibold tracking-tight sm:text-4xl",
					children: "Tell us what needs fixing"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-muted leading-relaxed",
					children: [
						"Fill this out and we'll open your email to send the details to",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-fg",
							children: "Rkey@FAFOPETRO.com"
						}),
						". Prefer text?",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "sms:+19728771848",
							className: "text-primary no-underline",
							children: "(972) 877-1848"
						}),
						"."
					]
				})
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-10 md:py-14",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "container-site max-w-2xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceRequestForm, {})
		})
	})] });
}
//#endregion
export { RequestPage as component };
