import { useState } from "react";

type UseMutationState<T> = {
  loading: boolean;
  data?: T;
  error?: object;
};

// useMutation의 return [] 타입
type UseMutationResult<T> = [(data: any) => void, UseMutationState<T>];

const useMutation = <T,>(url: string): UseMutationResult<T> => {
  const [state, setState] = useState<UseMutationState<T>>({
    loading: false,
    data: undefined,
    error: undefined,
  });
  // server data를 fetch 하고,  data와 error, isLoading를 정의함
  const mutation = (data: any) => {
    setState((prev) => ({ ...prev, loading: true }));

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json().catch(() => {}))
      .then((data) => setState((prev) => ({ ...prev, data, loading: false })))
      .catch((error) =>
        setState((prev) => ({ ...prev, error, loading: false }))
      );
  };
  return [mutation, { ...state }];
};

export default useMutation;
