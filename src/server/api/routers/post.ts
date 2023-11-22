import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(
      z.object({ title: z.string().min(1), description: z.string().min(1) }),
    )
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.post.create({
        data: {
          title: input.title,
          description: input.description,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),
  show: protectedProcedure.query(async ({ ctx }) => {
    const userPosts = await ctx.db.user
      .findUnique({
        where: { id: ctx.session.user.id },
        include: {
          posts: {
            select: {
              id: true,
              title: true,
              description: true,
            },
          },
        },
      })
      .then((user) => user?.posts || []);
    return userPosts;
  }),
  delete: protectedProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const postId = input.postId;
      const deletePost = await ctx.db.post.findUnique({
        where: {
          id: postId,
          createdBy: { id: ctx.session.user.id },
        },
        select: {
          title: true,
          description: true,
        },
      });
      if (!deletePost) {
        throw new Error(
          "Post not found or you don't have permission to delete it",
        );
      }
      await ctx.db.post.delete({
        where: {
          id: postId,
        },
      });
      return deletePost;
    }),
});
