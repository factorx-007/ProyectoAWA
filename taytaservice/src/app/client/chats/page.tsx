// src/app/client/chats/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import api from '@/features/auth/api';
import { useSocket } from '@/providers/SocketProvider';
import ChatInterface, { User, Chat, Mensaje } from '@/components/client/chats/ChatInterface';//esta es la verdadera ruta

export default function ChatsPage() {
  const { user, initialized } = useAuth();
  const { socket } = useSocket();
  const [users, setUsers] = useState<User[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>('');

  // Carga inicial de datos
  useEffect(() => {
    if (!initialized || !user) return;
    api.get<User[]>('/usuarios').then(res => setUsers(res.data));
    api.get<Chat[]>('/chats').then(res => setChats(
      res.data.filter(c => c.idParticipantes.includes(Number(user.id)))
    ));
    api.get<Mensaje[]>('/mensajes').then(res => setMensajes(res.data));
  }, [initialized, user]);

  // Suscripción a nuevos mensajes en tiempo real
  useEffect(() => {
    if (!socket || !initialized) return;
    const handler = (msg: Mensaje) => {
      setMensajes(prev => {
        // Reemplazar mensaje temporal o agregar nuevo
        const idx = prev.findIndex(m => m._idTemp && msg._idTemp && m._idTemp === msg._idTemp);
        if (idx !== -1) {
          const arr = [...prev]; arr[idx] = msg; return arr;
        }
        return [...prev, msg];
      });
      // Si es chat nuevo, agregarlo
      setChats(prev => {
        if (!prev.find(c => c._id === msg.idChat)) {
          api.get<Chat>(`/chats/${msg.idChat}`).then(res => {
            setChats(prevChats => [res.data, ...prevChats]);
          });
        }
        return prev;
      });
    };
    socket.on('mensaje', handler);
    return () => { socket.off('mensaje', handler); };
  }, [socket, initialized, chats]);


  const handleSelectUser = async (otherId: number) => {
    if (!user) return;
    const res = await api.post<Chat>('/chats', { idParticipantes: [Number(user.id), otherId] });
    setChats(prev => [res.data, ...prev.filter(c => c._id !== res.data._id)]);
    setActiveChatId(res.data._id);
  };

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
  };

  const handleSend = (texto: string, chatId: string) => {
    if (!socket || !user || !chatId) return;
    const tempId = Date.now().toString();
    socket.emit('mensaje', {
      _idTemp: tempId,
      idChat: chatId,
      emisor: Number(user.id),
      contenido: texto,
      timestamp: new Date().toISOString()
    });
    setMensajes(prev => [
      ...prev,
      { _idTemp: tempId, idChat: chatId, idEmisor: Number(user.id), contenido: texto, timestamp: new Date().toISOString() }
    ]);
  };

  if (!initialized) {
    return <div>Cargando...</div>;
  }

  return (
    <ChatInterface
      userId={Number(user?.id ?? '')}
      users={users}
      chats={chats}
      mensajes={mensajes}
      socket={socket}
      activeChatId={activeChatId}
      onSelectUser={handleSelectUser}
      onSelectChat={handleSelectChat}
      onSend={handleSend}
    />
  );
}
