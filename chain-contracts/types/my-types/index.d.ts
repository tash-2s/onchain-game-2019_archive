declare type PromiseGenericsType<T> = T extends Promise<infer R> ? R : any
