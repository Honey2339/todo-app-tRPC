import { getServerAuthSession } from "~/server/auth";
import { CreatePost } from "./_components/create-post";
import ShowPost from "./_components/show-post";

export default async function Home() {
  const session = await getServerAuthSession();
  return (
    <main className="mt-20 flex flex-col items-center justify-center">
      <h1>Logged in as : {session?.user?.name}</h1>
      <br />
      <CreatePost />
      <br />
      <ShowPost />
    </main>
  );
}
