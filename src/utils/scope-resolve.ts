import get from "lodash/get";
export const resolvePath = (path: string, scope: any) => {
    if (!path) return undefined;

    if (path.startsWith("$$")) {
        const match = path.match(/^\$\$(\w+)/);
        if (!match) return undefined;

        const rootKey = match[1];
        const root = scope[`$$${rootKey}`];

        if (path === `$$${rootKey}`) return root;

        const realPath = path.replace(`$$${rootKey}.`, `${rootKey}.`);

        return get({ [rootKey]: root }, realPath);
    }

    // fallback
    return get(scope, path);
}