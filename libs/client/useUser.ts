import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function useUser() {
  const router = useRouter();
  // 현재 로그인 한 유저의 정보를 가져온다.
  const { data, error } = useSWR("/api/users/me", fetcher);

  // 유저의 정보를 가져오는데 성공했으면, router를 변경시킨다.
  useEffect(() => {
    if (data && !data.ok) {
      router.replace("/enter");
    }
  }, [data, router]);

  return { user: data?.profile, isLoading: !data && !error };
}
