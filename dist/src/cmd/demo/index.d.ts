declare const _default: {
    desc: string;
    arguments: ({
        name: string;
        required: boolean;
        multi?: undefined;
    } | {
        name: string;
        multi: boolean;
        required?: undefined;
    })[];
    options: {
        name: string;
        desc: string;
    }[];
    action(data: any, param: any): Promise<void>;
};
export default _default;
