let _SITE_NAME = `Mumba`;
let _GRAPHQL_ENDPOINT = `https://mumba.finance/graphql`;

if (window._SITE_NAME) {
	_SITE_NAME = window._SITE_NAME;
}

if (!window.location.host.match("localhost") && window._GRAPHQL_ENDPOINT) {
	_GRAPHQL_ENDPOINT = window._GRAPHQL_ENDPOINT;
}

export const SITE_NAME = _SITE_NAME;
export const GRAPHQL_ENDPOINT = _GRAPHQL_ENDPOINT;

export const MENU = [
	{
		title: "About",
		to: "/about",
	},
	{
		title: "Token",
		to: "/token",
	},
	{
		title: "Legal",
		to: "/terms",
		notStatic: true,
	},
	{
		title: "FAQ",
		to: "/faq",
		notStatic: true,
	},
	{
		title: "Contacts",
		to: "/contacts",
		notStatic: true,
	},
];

export const FOLLOW_LINKS = [
	{
		title: "Telegram",
		to: "https://t.me/Mumbatoken",
	},
	{
		title: "Facebook",
		to: "https://www.facebook.com/MubmaToken/",
	},
	{
		title: "Instagram",
		to: "https://www.instagram.com/mumba_platform/",
	},
	{
		title: "Twitter",
		to: "https://twitter.com/Mumba_Platform",
	},
];

export const LEGAL_LINKS = [
	{
		title: "Terms",
		to: "/terms",
	},
	{
		title: "Privacy policy",
		to: "/privacy",
	},
	{
		title: "Investment risks",
		to: "/risks",
	},
	{
		title: "How it works",
		to: "/how_it_works",
	}
];
