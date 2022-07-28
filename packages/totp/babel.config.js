const tscOption = {
    isTSX: false,
    allExtensions: false,
    allowNamespaces: true,
    allowDeclareFields: true,
    onlyRemoveTypeImports: true,
};

const envOption = {
    targets: {
        node: "14.0",
    },
    useBuiltIns: "usage",
    bugfixes: true,
    corejs: {
        version: 3,
        proposals: true,
    },
};

const aliasOption = {
    root: [
        "./src",
    ],
    alias: {
        src: "./src",
    },
};

module.exports = {
    presets: [
        ["@babel/preset-typescript", tscOption],
        ["@babel/preset-env", envOption],
    ],
    plugins: [
        ["module-resolver", aliasOption],
    ],
};
