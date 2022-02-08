module.exports = {
	"env": {
		"browser": true,
		"es2021": true
	},
	"extends": [
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:@typescript-eslint/recommended"
	],
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"ecmaFeatures": {
			"jsx": true
		},
		"ecmaVersion": 12,
		"sourceType": "module"
	},
	"plugins": [
		"react",
		"@typescript-eslint"
	],
	"rules": {
		"indent": [
			"off",
			"tab"
		],
		"linebreak-style": [
			"off",
			"windows"
		],
		"quotes": [
			"error",
			"single"
		],
		"semi": [
			"error",
			"always"
		],
		"no-tabs": 0,
		"no-mixed-spaces-and-tabs": 0,
		"no-trailing-spaces": 0,
		"camelcase": 2,
		"@typescript-eslint/no-non-null-asserted-optional-chain": "off",
		"@typescript-eslint/no-non-null-assertion": "off",
		"react/display-name": "off",
		"react/prop-types": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"react/jsx-key": "off",
		"@typescript-eslint/ban-types": "off"
	}
};