"use client";

import { useState, useEffect } from "react";

interface Comment {
  id: string;
  author: string;
  email: string;
  content: string;
  date: string;
  approved: boolean;
}

interface CommentsProps {
  slug: string;
}

export function Comments({ slug }: CommentsProps) {
  // State for form inputs
  const [author, setAuthor] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  
  // State for comments management
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch comments when component mounts
  useEffect(() => {
    fetchComments();
  }, [slug]);

  // Fetch all comments for this post
  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?slug=${slug}`);
      if (response.ok) {
        const data = await response.json();
        // Only show approved comments
        setComments(data.filter((c: Comment) => c.approved));
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle comment form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    // Basic validation
    if (!author.trim() || !email.trim() || !content.trim()) {
      setMessage("Please fill in all fields.");
      setSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address.");
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug,
          author: author.trim(),
          email: email.trim(),
          content: content.trim(),
        }),
      });

      if (response.ok) {
        setMessage("Comment submitted! It will appear after moderation.");
        setAuthor("");
        setEmail("");
        setContent("");
        // Refresh comments list
        fetchComments();
      } else {
        setMessage("Failed to submit comment. Please try again.");
      }
    } catch (error) {
      console.error("Failed to submit comment:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
      <h2 className="text-3xl font-bold text-black dark:text-white mb-8">
        Comments
      </h2>

      {/* Comments List */}
      <div className="mb-12">
        {loading ? (
          <p className="text-zinc-600 dark:text-zinc-400">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-zinc-600 dark:text-zinc-400">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-black dark:text-white">
                    {comment.author}
                  </h3>
                  <time className="text-sm text-zinc-500 dark:text-zinc-500">
                    {new Date(comment.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comment Form */}
      <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-8 border border-zinc-200 dark:border-zinc-800">
        <h3 className="text-xl font-semibold text-black dark:text-white mb-6">
          Leave a Comment
        </h3>

        {message && (
          <div
            className={`mb-4 p-4 rounded-lg ${
              message.includes("submitted")
                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Author Name */}
          <div>
            <label
              htmlFor="author"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Name
            </label>
            <input
              id="author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={submitting}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Email (not published)
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={submitting}
              required
            />
          </div>

          {/* Comment Content */}
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Comment
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts..."
              rows={5}
              className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              disabled={submitting}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            {submitting ? "Submitting..." : "Submit Comment"}
          </button>
        </form>

        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-4">
          Comments are moderated and will appear after approval.
        </p>
      </div>
    </section>
  );
}
