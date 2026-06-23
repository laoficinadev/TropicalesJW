import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { Mail, MessageSquare } from "lucide-react";

export default async function AdminMensajesPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const { data: messages } = await supabase
    .from("ContactMessage")
    .select("*")
    .order("createdAt", { ascending: false });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Mensajes</h1>
        <p className="text-sm text-gray-500">
          {messages?.length || 0} mensaje{(messages?.length || 0) !== 1 ? "s" : ""}
        </p>
      </div>

      {!messages || messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <MessageSquare className="mb-4 h-12 w-12 text-gray-300" />
          <p className="text-gray-500">No hay mensajes aún</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-xl border bg-white p-6 shadow-sm ${
                msg.read ? "border-gray-200" : "border-emerald-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full ${
                      msg.read ? "bg-gray-100" : "bg-emerald-100"
                    }`}
                  >
                    <Mail
                      className={`h-4 w-4 ${
                        msg.read ? "text-gray-400" : "text-emerald-600"
                      }`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {msg.name}
                      </h3>
                      {!msg.read && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                          Nuevo
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{msg.email}</p>
                    {msg.phone && (
                      <p className="text-xs text-gray-400">Tel: {msg.phone}</p>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(msg.createdAt).toLocaleDateString("es-CR", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="mt-3">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  {msg.subject}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-gray-700">
                  {msg.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
