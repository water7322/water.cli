declare const _default: {
    desc: string;
    arguments: {
        name: string;
        required: boolean;
    }[];
    action(oData: {
        index: number;
    }): Promise<void>;
    npm(oPackage: any, dir: string): Promise<void>;
};
export default _default;
