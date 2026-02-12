"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "./lib/supabaseClient";

const supabase = getSupabaseClient();
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [adding, setAdding] = useState(false);

  const fetchBookmarks = async (userId: string) => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (data) setBookmarks(data);
    console.log("FETCH ERROR:", error);
  };

  const addBookmark = async () => {
    if (!title || !url || !user) return;
  
    try {
      const { error } = await supabase.from("bookmarks").insert([
        {
          title,
          url,
          user_id: user.id,
        },
      ]);
  
      if (error) {
        console.error("Insert failed:", error.message);
        return;
      }
  
      setTitle("");
      setUrl("");
      fetchBookmarks(user.id);
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };
  

  const deleteBookmark = async (id: string) => {
    if (!user) return;

    await supabase.from("bookmarks").delete().eq("id", id);
    fetchBookmarks(user.id);
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.push("/login");
      } else {
        setUser(data.session.user);
        fetchBookmarks(data.session.user.id);
      }

      setLoading(false);
    };

   

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          router.push("/login");
        } else {
          setUser(session.user);
          fetchBookmarks(session.user.id);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if(!user) return;

    const channel = supabase
    .channel("bookmarks-channel")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "bookmarks",
      },
      () => {
        fetchBookmarks(user.id);
      }
    )
    .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Welcome {user.email}</h1>

      <button
        onClick={async () => {
          await supabase.auth.signOut();
          window.location.href = "/login";
        }}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>

      {/* Add Bookmark */}
      <div className="mt-6">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 mr-2"
        />

        <input
          type="text"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border p-2 mr-2"
        />

        <button
          onClick={addBookmark}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* Bookmark List */}
      <div className="mt-6 space-y-2">
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="flex justify-between border p-3 rounded"
          >
            <div>
              <div className="font-semibold">{bookmark.title}</div>
              <a
                href={bookmark.url}
                target="_blank"
                className="text-blue-600 text-sm"
              >
                {bookmark.url}
              </a>
            </div>

            <button
              onClick={() => deleteBookmark(bookmark.id)}
              className="text-red-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
