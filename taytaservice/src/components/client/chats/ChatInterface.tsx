// src/components/ChatInterface.tsx
'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';

// Definimos _id opcional para manejar mensajes temporales
export interface User {
  id_usuario: number;
  nombres: string;
  apellidos: string;
  url_img?: string;
}

export interface Chat {
  _id: string;
  idParticipantes: number[];
}

export interface Mensaje {
  _id?: string;
  idChat: string;
  idEmisor: number;
  contenido: string;
  timestamp: string;
  _idTemp?: string;
}

interface ChatInterfaceProps {
  userId: number;
  users: User[];
  chats: Chat[];
  mensajes: Mensaje[];
  socket: Socket | null;
  activeChatId: string;
  onSend: (texto: string, chatId: string) => void;
  onSelectUser: (otherId: number) => void;
  onSelectChat: (chatId: string) => void;
}

// --- Subcomponentes internos para mejor organización y escalabilidad ---

// Sidebar de chats y usuarios
function ChatSidebar({ chats, users, userId, activeChatId, onSelectUser, onSelectChat }: {
  chats: Chat[]; users: User[]; userId: number; activeChatId: string;
  onSelectUser: (otherId: number) => void; onSelectChat: (chatId: string) => void;
}) {
  const [search, setSearch] = useState('');
  const filteredUsers = users.filter(u =>
    u.id_usuario !== userId &&
    (`${u.nombres} ${u.apellidos}`.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <aside className="w-80 bg-white border-r flex flex-col h-full">
      <div className="p-4 border-b">
        <input
          className="w-full px-3 py-2 rounded border"
          placeholder="Buscar usuario..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="mt-2 w-full px-2 py-1 rounded border"
          onChange={e => onSelectUser(Number(e.target.value))}
          defaultValue=""
        >
          <option disabled value="">Nueva conversación...</option>
          {filteredUsers.map(u => (
            <option key={u.id_usuario} value={u.id_usuario}>
              {u.nombres} {u.apellidos}
            </option>
          ))}
        </select>
      </div>
      <ul className="flex-1 overflow-y-auto divide-y">
        {chats.map(c => {
          const otherId = c.idParticipantes.find(id => id !== userId)!;
          const u = users.find(u => u.id_usuario === otherId);
          return (
            <li
              key={c._id}
              onClick={() => onSelectChat(c._id)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-blue-50 transition ${c._id === activeChatId ? 'bg-blue-100 font-semibold' : ''}`}
            >
              <img src={u?.url_img || '/avatar.png'} alt="avatar" className="w-10 h-10 rounded-full object-cover bg-gray-200" />
              <span>{u ? `${u.nombres} ${u.apellidos}` : 'Usuario desconocido'}</span>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

// Header del chat activo
function ChatHeader({ user }: { user?: User }) {
  return (
    <header className="flex items-center gap-3 px-6 py-4 border-b bg-white sticky top-0 z-10">
      <img src={user?.url_img || '/avatar.png'} alt="avatar" className="w-10 h-10 rounded-full object-cover bg-gray-200" />
      <div>
        <div className="font-semibold">{user ? `${user.nombres} ${user.apellidos}` : 'Usuario desconocido'}</div>
        {/* Aquí podrías mostrar estado online, typing, etc. */}
      </div>
    </header>
  );
}

// Burbuja de mensaje mejorada con gradiente, sombra y microinteracciones
function MessageBubble({ mensaje, isOwn, user }: { mensaje: Mensaje; isOwn: boolean; user?: User }) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2 group`}>
      {!isOwn && (
        <img
          src={user?.url_img || '/avatar.png'}
          alt="avatar"
          className="w-8 h-8 rounded-full mr-2 self-end bg-gray-200 border-2 border-white shadow"
        />
      )}
      <div
        className={`relative max-w-xs px-4 py-2 rounded-2xl text-sm transition-all duration-200 shadow-lg ${isOwn
          ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-br-lg'
          : 'bg-gradient-to-br from-gray-100 to-gray-300 text-gray-900 rounded-bl-lg'} group-hover:scale-[1.03]`}
        title={new Date(mensaje.timestamp).toLocaleString()}
      >
        {mensaje.contenido}
        <div className="text-[10px] text-right mt-1 opacity-60 select-none">
          {new Date(mensaje.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        {/* Smart microinteracción: mostrar icono al hacer hover */}
        <span className={`absolute -top-3 right-2 text-xs opacity-0 group-hover:opacity-80 transition-opacity ${isOwn ? 'text-blue-400' : 'text-gray-400'}`}>✓</span>
      </div>
    </div>
  );
}

// Lista de mensajes del chat activo
function MessageList({ mensajes, userId, users, chat, chatEndRef }: {
  mensajes: Mensaje[]; userId: number; users: User[]; chat?: Chat; chatEndRef: React.RefObject<HTMLDivElement | null>;
}) {
  // Detectar si el usuario está abajo para solo hacer scroll si corresponde
  const listRef = useRef<HTMLDivElement | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const handleScroll = () => {
      setIsAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 60);
    };
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isAtBottom && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [mensajes, chatEndRef, isAtBottom]);

  return (
    <div
      ref={listRef}
      className="flex-1 overflow-y-auto px-6 py-4 bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col-reverse custom-scrollbar"
      style={{ minHeight: 0 }}
    >
      <div ref={chatEndRef} />
      {[...mensajes].reverse().map(m => {
        const isOwn = m.idEmisor === userId;
        const otherUser = users.find(u => u.id_usuario === m.idEmisor);
        return <MessageBubble key={m._idTemp || m._id} mensaje={m} isOwn={isOwn} user={otherUser} />;
      })}
    </div>
  );
}

// Input para enviar mensajes - smart, estático y atractivo
function MessageInput({ value, onChange, onSend, disabled }: {
  value: string; onChange: (v: string) => void; onSend: () => void; disabled: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && value.trim()) {
      e.preventDefault();
      onSend();
    }
  };
  return (
    <div className="px-6 py-4 bg-white border-t flex items-center gap-2 sticky bottom-0 z-20 shadow-[0_-2px_16px_-4px_rgba(0,0,80,0.07)]">
      <button
        tabIndex={-1}
        className="p-2 rounded-full hover:bg-blue-50 transition text-blue-500"
        title="Adjuntar (próximamente)"
        disabled
      >
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="1.5" d="M17.5 12.5v5a5 5 0 0 1-10 0v-9a5 5 0 1 1 10 0v7a3 3 0 1 1-6 0v-6"/></svg>
      </button>
      <input
        className={`flex-1 border px-4 py-2 rounded-full transition-all duration-200 focus:outline-none ${focused ? 'ring-2 ring-blue-400 border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-100'} text-base`}
        placeholder={disabled ? 'Conectando...' : 'Escribe tu mensaje y presiona Enter'}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        maxLength={1000}
        autoComplete="off"
      />
      <button
        onClick={onSend}
        disabled={disabled || !value.trim()}
        className={`ml-2 p-2 rounded-full shadow-md transition-all duration-150 ${disabled || !value.trim()
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-700 scale-105 active:scale-95'}`}
        style={{ boxShadow: '0 4px 16px -4px rgba(37,99,235,0.12)' }}
        title="Enviar"
      >
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M4 20l16-8-16-8v6l10 2-10 2v6z"/></svg>
      </button>
    </div>
  );
}

// --- Componente principal tipo Messenger ---
export default function ChatInterface({
  userId, users, chats, mensajes, socket,
  activeChatId, onSend, onSelectUser, onSelectChat
}: ChatInterfaceProps) {
  const [texto, setTexto] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes, activeChatId]);

  useEffect(() => {
    if (!socket) return;
    const handler = (msg: Mensaje) => {
      if (msg.idChat === activeChatId) {
        // Parent actualiza estado
      }
    };
    socket.on('mensaje', handler);
    return () => { socket.off('mensaje', handler); };
  }, [socket, activeChatId]);

  // Mensajes del chat activo
  const mensajesActivos = mensajes.filter(m => m.idChat === activeChatId);

  // Chat y usuario activo
  const chatActivo = chats.find(c => c._id === activeChatId);
  const otherId = chatActivo?.idParticipantes.find(id => id !== userId);
  const otherUser = users.find(u => u.id_usuario === otherId);

  return (
    <div className="flex h-full bg-blue-50 rounded-lg shadow overflow-hidden" style={{ minHeight: '600px', minWidth: '900px' }}>
      <ChatSidebar
        chats={chats}
        users={users}
        userId={userId}
        activeChatId={activeChatId}
        onSelectUser={onSelectUser}
        onSelectChat={onSelectChat}
      />
      <main className="flex-1 flex flex-col h-full">
        {activeChatId && chatActivo ? (
          <>
            <ChatHeader user={otherUser} />
            <MessageList
              mensajes={mensajesActivos}
              userId={userId}
              users={users}
              chat={chatActivo}
              chatEndRef={chatEndRef}
            />
            <MessageInput
              value={texto}
              onChange={setTexto}
              onSend={() => {
                if (texto.trim()) {
                  onSend(texto, activeChatId);
                  setTexto('');
                }
              }}
              disabled={!socket}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <img src="/messenger-illustration.svg" alt="Selecciona un chat" className="w-32 h-32 mb-4 opacity-60" />
            <span>Selecciona un chat para comenzar a conversar</span>
          </div>
        )}
      </main>
    </div>
  );
}

/*
  Sugerencias de testing:
  - Testear que el scroll automático funciona correctamente.
  - Testear que los mensajes se muestran en orden y con el estilo correcto según emisor.
  - Testear que el input se limpia al enviar y no permite enviar vacío.
  - Testear selección de usuario y chat.
*/