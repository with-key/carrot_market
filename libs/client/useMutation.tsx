import { useState } from "react";

interface UseMutationState<T> {
  loading: boolean;
  data?: T;
  error?: object;
}

// useMutation의 return [] 타입
type UseMutationResult<T> = [(data: T) => void, UseMutationState<T>];

export default function useMutation<T = any>(
  url: string
): UseMutationResult<T> {
  const [state, setSate] = useState<UseMutationState<T>>({
    loading: false,
    data: undefined,
    error: undefined,
  });

  // server data를 fetch 하고,  data와 error, isLoading를 정의함
  function mutation(data: any) {
    setSate((prev) => ({ ...prev, loading: true }));
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json().catch(() => {}))
      .then((data) => setSate((prev) => ({ ...prev, data, loading: false })))
      .catch((error) =>
        setSate((prev) => ({ ...prev, error, loading: false }))
      );
  }
  return [mutation, { ...state }];
}
