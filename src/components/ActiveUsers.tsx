"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

interface ActiveUsersProps {
  documentId: string;
}

export default function ActiveUsers({ documentId }: ActiveUsersProps) {
  const { activeUser } = useAuth();
  const [activeUsers, setActiveUsers] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (!documentId || !activeUser) return;

    // Use a unique channel for this document
    const channel = supabase.channel(`room:${documentId}`, {
      config: {
        presence: {
          key: activeUser.id,
        },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        // Extract users from state
        const users: { id: string; name: string }[] = [];
        
        for (const [key, presences] of Object.entries(state)) {
          // get the first presence state for this user
          if (presences.length > 0) {
            users.push(presences[0] as unknown as { id: string; name: string });
          }
        }
        
        // Don't show ourselves in the active list
        setActiveUsers(users.filter(u => u.id !== activeUser.id));
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            id: activeUser.id,
            name: activeUser.name,
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [documentId, activeUser]);

  // Generate deterministic color based on ID
  const getAvatarColor = (id: string) => {
    const colors = [
      "bg-red-500", "bg-orange-500", "bg-amber-500", "bg-green-500", 
      "bg-emerald-500", "bg-teal-500", "bg-cyan-500", "bg-sky-500", 
      "bg-blue-500", "bg-indigo-500", "bg-violet-500", "bg-purple-500", 
      "bg-fuchsia-500", "bg-pink-500", "bg-rose-500"
    ];
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  if (activeUsers.length === 0) return null;

  return (
    <div className="flex -space-x-2 mr-2">
      {activeUsers.map((user) => (
        <div
          key={user.id}
          className={`h-8 w-8 rounded-full ${getAvatarColor(user.id)} text-white flex items-center justify-center text-sm font-bold border-2 border-white shadow-sm ring-1 ring-gray-100 z-10 hover:z-20 transition-transform hover:scale-110 cursor-default`}
          title={user.name}
        >
          {user.name.charAt(0).toUpperCase()}
        </div>
      ))}
    </div>
  );
}
