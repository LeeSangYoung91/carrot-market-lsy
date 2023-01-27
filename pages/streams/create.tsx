import type { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Stream } from "@prisma/client";

interface CreateForm {  //2
  name: string;
  price: string;
  description: string;
}

interface CreateResponse {  //11
  ok: boolean;
  stream: Stream;
}

const Create: NextPage = () => {
  const router = useRouter(); //10
  const [createStream, { loading, data }] = useMutation<CreateResponse>(`/api/streams`);  //6
  const { register, handleSubmit } = useForm<CreateForm>();  //1

  const onValid = (form: CreateForm) => {  //5 
    if (loading) return;  //8
    createStream(form);
  };

  useEffect(() => {
    if (data && data.ok) {  //9
      router.push(`/streams/${data.stream.id}`);  
    }
  }, [data, router]);
  return (
    <Layout canGoBack title="Go Live">
      <form onSubmit={handleSubmit(onValid)}//4 
      className=" space-y-4 py-10 px-4"> 
        <Input
          register={register("name", { required: true })} //3
          required
          label="Name"
          name="name"
          type="text"
        />
        <Input
           register={register("price", { required: true, valueAsNumber: true })}
          required
          label="Price"
          name="price"
          type="text"
          kind="price"
        />
        <TextArea
          register={register("description", { required: true })}
          name="description"
          label="Description"
        />
        <Button text={loading ? "Loading..." : "Go live"}  //7
        />
      </form>
    </Layout>
  );
};

export default Create;
