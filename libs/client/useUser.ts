import { User } from "@prisma/client";
import { useEffect } from 'react';
import { useRouter } from "next/router";
import useSWR from "swr";  //React Query
//url로 보내서 response 를 받으면 response.json() 으로 return
const fetcher = (url: string) => fetch(url).then((response) => response.json());

interface ProfileResponse {
  ok: boolean;
  profile: User;
}
export default function useUser() {
  //기본적으로 2개의 인자가 필요함 url,fetcher함수  data는 리턴한 데이터 
  //첫번째 인자 "/api/users/me" 은 fetcher가 url로 사용하기도 하지만 캐시에서 데이터를 가져올때 사용하는 id로도 사용됨
  //그래서 앱에 어디서든지 여기로 요청보내면 id가 유일하고 같기 때문에 유저가 어느곳이든 캐시데이터를 확인할 수 있다. 즉 모든곳에서 데이터공유가능
  //mutate는 캐시안에 저장된 데이터를 수정할 수 있음 
  //useSWR은 유저가 다른탭으로 갔다가 다시 돌아왔을때도 데이터를 새로고침하는걸 해줌 자동으로 
  const { data, error } = useSWR<ProfileResponse>("/api/users/me");
  const router = useRouter();
  
  //로그인 안하면 /enter로 리다이렉션 
  useEffect(() => {
    if (data && !data.ok) {   // 데이터가있고 data.ok가 false면 
      router.replace("/enter");
    }
    
    if (data && data.ok && router.pathname === "/enter") {
      router.replace("/profile");
    }
  }, [data, router]);
  //data가 있으면 profile 답변   데이터가 없고 에러가없다면 true  나머진 false 신기한듯 
  return { user: data?.profile, isLoading: !data && !error };

}