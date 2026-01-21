import { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export const metadata: Metadata = {
  title: "Blog",
  description: "Read our latest blog posts",
  openGraph: {
    title: "Blog",
    description: "Read our latest blog posts",
    type: "website",
  },
};

interface Post {
  slug: string;
  title: string;
  description: string;
  date?: string;
}

async function getPosts(): Promise<Post[]> {
  const postsDir = path.join(process.cwd(), "content/posts");
  const files = fs.readdirSync(postsDir);

  const posts = files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const filePath = path.join(postsDir, file);
      const content = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(content);

      return {
        slug: file.replace(".mdx", ""),
        title: data.title || file.replace(".mdx", ""),
        description: data.description || "",
        date: data.date || "",
      };
    })
    .sort((a, b) => {
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    });

  return posts;
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-white dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-black dark:text-white mb-12">
          Blog
        </h1>

        {posts.length === 0 ? (
          <p className="text-zinc-600 dark:text-zinc-400">
            No posts yet. Check back soon!
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <div className="h-full p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:shadow-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer">
                  <h2 className="text-xl font-semibold text-black dark:text-white mb-2">
                    {post.title}
                  </h2>
                  {post.date && (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                  <p className="text-zinc-600 dark:text-zinc-300 line-clamp-3">
                    {post.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
