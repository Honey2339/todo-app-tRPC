"use client";

import { api } from "~/trpc/react";

export default function ShowPost() {
  const { data, refetch, error } = api.post.show.useQuery();
  if (error) {
    return <p>Error: {error.message}</p>;
  }
  const deletePostMutation = api.post.delete.useMutation();

  const handleDeletePost = async (postId: number) => {
    await deletePostMutation.mutate({ postId: postId });
    refetch();
  };

  return (
    <div>
      <h1 className="text-lg underline">All Posts</h1>
      <br />
      {data && data.length > 0 ? (
        <ul>
          {data.map((post) => (
            <li>
              <h3>Title : {post.title}</h3>
              <h3>Description : {post.description}</h3>
              <button
                onClick={() => handleDeletePost(post.id)}
                className="mb-5 mt-2 rounded bg-red-400 px-4 py-1"
              >
                Del
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>no post found</p>
      )}
    </div>
  );
}
