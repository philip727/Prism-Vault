export default async function unwrapPromise<T, E>(promise: Promise<T>): Promise<{ result: null | T, err: E | null }> {
    let result = { result: null as any, err: null };

    await promise.then(data => {
        result.result = data;
        result.err = null;
    }).catch(err => {
        result.result = null;
        result.err = err;
    })

    return result;
}
