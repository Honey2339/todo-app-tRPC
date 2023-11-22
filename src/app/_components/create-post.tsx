"use client";

import Link from "next/link";
import { useState } from "react";

import { api } from "~/trpc/react";

export function CreatePost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showError, setShowError] = useState("");
  const { refetch: refetchedData } = api.post.show.useQuery();
  const { mutate, error } = api.post.create.useMutation({
    onSuccess: () => {
      void refetchedData();
    },
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    mutate({ title, description });
    setTitle("");
    setDescription("");
    if (title.length && description.length <= 1) {
      setShowError("String must contain at least 1 character(s)");
    }
  };

  return (
    <>
      <h1>Title :</h1>
      <input
        className="mb-5 border border-black bg-gray-200 p-1"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <h1>Description :</h1>
      <input
        className="mb-5 border border-black bg-gray-200 p-1"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
        }}
      />
      <button
        className="rounded-md bg-blue-600 p-2 text-white transition duration-300 hover:bg-blue-300"
        onClick={handleSubmit}
      >
        Submit
      </button>
      {error && (
        <p className="mt-2 text-red-500">
          Error: String must contain at least 1 character(s)
        </p>
      )}
    </>
  );
}
