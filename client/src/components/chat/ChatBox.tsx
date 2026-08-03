import { useState, useEffect, useRef } from "react";
import { Paperclip, Send, X, Loader2, Search } from "lucide-react";
import { socket } from "../../socket/socket";
import type { Message } from "../../types/message";
import { useAuthStore } from "../../store/auth.store";
import { getWorkspaceMessages, searchMessages } from "../../services/workspace.service";
import { uploadFile } from "../../services/upload.service";

interface Props {
  workspaceId: string;
  userId: string;
}

const AVATAR_COLORS = ["#7C5CFC", "#22D3EE", "#FB923C", "#34D399", "#F472B6", "#F43F5E"];
const colorFor = (name: string) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const ChatBox = ({ workspaceId, userId }: Props) => {
  const user = useAuthStore((state) => state.user);
  const [messages, setMessages] = useState<Message[]>([]);

  const [text, setText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [uploading, setUploading] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const [search, setSearch] = useState("");

  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const loadMessages = async () => {
      const data = await getWorkspaceMessages(workspaceId);
      setMessages(data);
    };
    loadMessages();
  }, [workspaceId]);

  useEffect(() => {
    socket.on("receive-message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("user-typing", (name: string) => {
      setTypingUser(name);
    });

    socket.on("user-stop-typing", () => {
      setTypingUser("");
    });

    return () => {
      socket.off("receive-message");
      socket.off("user-typing");
      socket.off("user-stop-typing");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);

    socket.emit("typing", { workspaceId, userName: user?.name });

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    typingTimeout.current = setTimeout(() => {
      socket.emit("stop-typing", { workspaceId });
    }, 1000);
  };

  const sendMessage = async () => {
    if (!text.trim() && !selectedFile) return;

    let uploaded;

    if (selectedFile) {
      setUploading(true);
      uploaded = await uploadFile(selectedFile);
      setUploading(false);
    }

    socket.emit("send-message", {
      workspaceId,
      userId,
      content: text,
      fileUrl: uploaded?.url,
      fileName: uploaded?.originalName,
      fileType: selectedFile?.type,
    });

    setText("");
    setSelectedFile(null);
  };

  const handleSearch = async (value: string) => {
    setSearch(value);

    if (!value.trim()) {
      const data = await getWorkspaceMessages(workspaceId);
      setMessages(data);
      return;
    }

    const data = await searchMessages(workspaceId, value);
    setMessages(data);
  };

  return (
    <div className="flex h-130 flex-col rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="shrink-0 border-b border-gray-100 px-5 py-3.5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-tight text-gray-900">Chat</h2>

          {typingUser && (
            <p className="flex items-center gap-1.5 text-xs italic text-gray-400">
              {typingUser} is typing
              <span className="flex gap-0.5">
                <span className="h-1 w-1 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]" />
                <span className="h-1 w-1 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
                <span className="h-1 w-1 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
              </span>
            </p>
          )}
        </div>

        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search messages..."
            className="w-full rounded-xl border border-gray-200 py-2 pl-10 pr-3 text-sm outline-none transition-all focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
          />
        </div>
      </div>

      <div className="flex-1 styled-scrollbar space-y-3 overflow-y-auto px-5 py-4">
        {messages.map((message) => {
          const isOwn = message.sender.id === userId;

          return (
            <div key={message.id} className={`flex gap-2.5 ${isOwn ? "flex-row-reverse" : ""}`}>
              <div
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ background: colorFor(message.sender.name) }}
              >
                {message.sender.name.charAt(0).toUpperCase()}
              </div>

              <div className={`flex max-w-[75%] flex-col ${isOwn ? "items-end" : "items-start"}`}>
                <span className="mb-1 px-1 text-[11px] font-semibold text-gray-400">
                  {message.sender.name}
                </span>

                {message.content && (
                  <div
                    className={`rounded-2xl px-3.5 py-2 text-sm ${
                      isOwn
                        ? "rounded-tr-sm bg-linear-to-br from-indigo-500 to-violet-500 text-white"
                        : "rounded-tl-sm bg-gray-100 text-gray-800"
                    }`}
                  >
                    {message.content}
                  </div>
                )}

                {message.fileUrl && (
                  <div className="mt-1.5">
                    {message.fileType?.startsWith("image") ? (
                      <img
                        src={message.fileUrl}
                        alt={message.fileName}
                        className="h-auto max-h-48 w-40 rounded-xl border border-gray-100 object-cover shadow-sm"
                      />
                    ) : (
                      <a
                        href={message.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-xs font-medium text-indigo-600 underline-offset-2 hover:underline"
                      >
                        <Paperclip size={12} />
                        {message.fileName}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      <div className="shrink-0 border-t border-gray-100 p-3">
        {selectedFile && (
          <div className="mb-2 flex w-fit items-center gap-2 rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-medium text-indigo-600">
            <Paperclip size={12} />
            <span className="max-w-40 truncate">{selectedFile.name}</span>
            <button onClick={() => setSelectedFile(null)}>
              <X size={12} />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
          >
            <Paperclip size={16} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) {
                setSelectedFile(e.target.files[0]);
              }
            }}
          />

          <input
            value={text}
            onChange={handleTyping}
            placeholder="Type message"
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            className="min-w-0 flex-1 rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
          />

          <button
            disabled={uploading}
            onClick={sendMessage}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;