import { merge } from "rxjs";
import { InputFactory } from "../types";


export function combineInputs(f1: InputFactory, f2: InputFactory): InputFactory {
    return ctx => {
        const first = f1(ctx);
        const second = f2(ctx);
        return merge(first, second);
    };
}
