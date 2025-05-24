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

export default function ChatInterface({
  userId, users, chats, mensajes, socket,
  activeChatId, onSend, onSelectUser, onSelectChat
}: ChatInterfaceProps) {
  const [texto, setTexto] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

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

  const mensajesActivos = mensajes.filter(m => m.idChat === activeChatId);

  const getOtherUser = () => {
    const chat = chats.find(c => c._id === activeChatId);
    const otherId = chat?.idParticipantes.find(id => id !== userId);
    return users.find(u => u.id_usuario === otherId);
  };

  return (
    <div className="flex h-full">
      <div className="w-1/3 border-r">
        <div className="p-4">
          <label>Nueva conversación:</label>
          <select onChange={e => onSelectUser(Number(e.target.value))} defaultValue="">
            <option disabled value="">Seleccionar...</option>
            {users.filter(u => u.id_usuario!==userId).map(u=> (
              <option key={u.id_usuario} value={u.id_usuario}>{u.nombres} {u.apellidos}</option>
            ))}
          </select>
        </div>
        <ul className="p-4 space-y-2 overflow-auto">
          {chats.map(c=>{
            const otherId = c.idParticipantes.find(id=>id!==userId)!;
            const u = users.find(u=>u.id_usuario===otherId);
            return (
              <li key={c._id} onClick={()=>onSelectChat(c._id)} className={c._id===activeChatId? 'font-bold':''}>
                {u? `${u.nombres} ${u.apellidos}`:'Usuario desconocido'}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex-1 flex flex-col">
        {activeChatId? (
          <>
            <div className="p-4 bg-gray-100">
              <h2>{getOtherUser()?.nombres} {getOtherUser()?.apellidos}</h2>
            </div>
            <div className="flex-1 p-4 overflow-auto space-y-3">
              {mensajesActivos.map(m=> (
                <div key={m._idTemp || m._id} className={m.idEmisor===userId?'text-right':'text-left'}>
                  <div className={m.idEmisor===userId?'bg-blue-600 text-white':'bg-gray-200 text-black'}>
                    {m.contenido}
                  </div>
                  <div className="text-xs">{new Date(m.timestamp).toLocaleTimeString()}</div>
                </div>
              ))}
              <div ref={chatEndRef}/>
            </div>
            <div className="p-4 border-t flex">
              <input
                className="flex-1 border p-2"
                value={texto}
                onChange={e=>setTexto(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&onSend(texto, activeChatId)}
              />
              <button onClick={()=>onSend(texto, activeChatId)} className="ml-2 p-2 bg-blue-600 text-white">
                Enviar
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">Selecciona un chat</div>
        )}
      </div>
    </div>
  );
}