import type { NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect } from "react";
import { Post } from "@prisma/client";
import { useRouter } from "next/router";
import useCoords from "@libs/client/useCoords";

type WriteForm = {
  question: string;
};

type WriteResponse = {
  ok: boolean;
  post: Post;
};

const Write: NextPage = () => {
  const router = useRouter();
  const { latitude, longitude } = useCoords();
  const { register, handleSubmit } = useForm<WriteForm>();
  const [addPost, { data, loading, error }] =
    useMutation<WriteResponse>("/api/posts");

  const onValid = (form: WriteForm) => {
    if (loading) return; // 사용자의 여러분 요청을 방지
    addPost({ ...form, latitude, longitude });
  };

  useEffect(() => {
    if (data && data.ok) {
      router.push(`/community/${data.post.id}`);
    }
  }, [data, router]);

  return (
    <Layout canGoBack title="Write Post">
      <form onSubmit={handleSubmit(onValid)} className="p-4 space-y-4">
        <TextArea
          register={register("question", {
            required: true,
          })}
          required
          placeholder="Ask a question!"
        />
        <Button text={loading ? "Loading...!" : "전송하기"} />
      </form>
    </Layout>
  );
};

export default Write;
