export default async function unwrapPromise<TReturn, UError>(promise: Promise<TReturn>): Promise<{ result: null | TReturn, err: UError | null }> {
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
