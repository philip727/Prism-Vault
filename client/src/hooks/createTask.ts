import { createStore } from "solid-js/store"

export interface taskState<TResult, UError> {
    isLoading: boolean,
    error?: UError,
    response?: TResult
}

const createTask = <TReturn, UError>(fn: Promise<TReturn>): taskState<TReturn, UError> => {
    const [task, setTask] = createStore<taskState<TReturn, UError>>
        ({
            isLoading: true,
            error: undefined,
            response: undefined
        })

    fn
        .then(data => setTask("response", data))
        .catch(err => setTask("error", err))
        .finally(() => setTask("isLoading", false))


    return task
}

export default createTask;
