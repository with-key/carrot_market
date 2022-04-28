import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

type useUserTestProps = {
  pathname: string;
};

export default function useUser({ pathname }: useUserTestProps) {
  const router = useRouter();
  const isPublic = ["/enter"].includes(pathname);

  const { data, error } = useSWR(
    isPublic ? null : "/api/users/me",
    (url: string) => fetch(url).then((res) => res.json())
  );

  useEffect(() => {
    if (data && !data.ok) {
      router.replace("/enter");
    }
  }, [data, router]);

  return { user: data?.profile, isLoading: !data && !error };
}
/**
 * useUser()는 로그인 여부에 대한 상태관리를 할 수 있는 훅이다. === 서버로 요청하여 로그인 여부를 확인한다.
 * 즉, useUser()가 쓰인 페이지에서는 로그인 상태에 따라 해당 페이지에 머물게 하거나 또는 Redirect 시킨다.
 * 그래서 모든 페이지에서 useUser()가 쓰여져야 한다.
 */
