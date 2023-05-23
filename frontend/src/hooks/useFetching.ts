import { useState } from 'react';

export const useFetching = (callback: () => void) => {
    const [isFetching, setIsFetching] = useState(false);
    const [err, setErr] = useState('');
    const fetch = async () => {
        try {
            setIsFetching(true);
            await callback();
        } catch (error) {
            const e = (error as Error).message;
            setErr(e)
        }
        finally {
            setIsFetching(false);
        }
    }

    return <[() => Promise<void>, boolean, string]>[fetch, isFetching, err];
}