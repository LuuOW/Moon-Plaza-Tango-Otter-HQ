import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Character } from '../types';
import { MessageSquare, Users, Send, Bot, Sparkles, User, HelpCircle } from 'lucide-react';
import { sounds } from '../utils/sound';

interface CompanyChatBoxProps {
  messages: ChatMessage[];
  characters: Character[];
  onSendMessage: (text: string, targetCharacterId?: string) => void;
  selectedCharacter: Character | null;
  onSelectCharacter: (char: Character | null) => void;
}

export const CompanyChatBox: React.FC<CompanyChatBoxProps> = ({
  messages,
  characters,
  onSendMessage,
  selectedCharacter,
  onSelectCharacter,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sounds.playBubblePop();
    onSendMessage(inputText.trim(), selectedCharacter?.id);
    setInputText('');
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-2xl flex flex-col h-[420px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-purple-500/20 text-purple-400 rounded-lg border border-purple-500/30">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Habbo Social Chat & All-Hands Feed
              <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                {characters.length} Online
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {selectedCharacter
                ? `Directly talking to ${selectedCharacter.name} (${selectedCharacter.role})`
                : 'Broadcasting to all company employees'}
            </p>
          </div>
        </div>

        {selectedCharacter && (
          <button
            onClick={() => onSelectCharacter(null)}
            className="text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono-code border border-slate-700 transition"
          >
            Clear Target (All-Hands)
          </button>
        )}
      </div>

      {/* Characters Pill Quick Selector */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-thin">
        <button
          onClick={() => onSelectCharacter(null)}
          className={`px-2 py-1 text-xs rounded-lg font-medium whitespace-nowrap transition flex items-center gap-1 ${
            !selectedCharacter
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Users className="w-3 h-3" />
          <span>Everyone</span>
        </button>
        {characters.map((char) => {
          const isSelected = selectedCharacter?.id === char.id;
          return (
            <button
              key={char.id}
              onClick={() => onSelectCharacter(char)}
              className={`px-2 py-1 text-xs rounded-lg font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-purple-600 text-white font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: char.avatar.shirtColor }}
              />
              <span>{char.name.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        {messages.map((msg) => {
          const isFounder = msg.senderId === 'lucas';
          const isTango = msg.senderId === 'tango';

          return (
            <div
              key={msg.id}
              className={`p-2.5 rounded-lg border text-xs leading-relaxed transition ${
                isFounder
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-100 ml-4'
                  : isTango
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-100 mr-4'
                  : 'bg-slate-950/80 border-slate-800/80 text-slate-200 mr-4'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-100 font-sans-ui">
                    {msg.senderName}
                  </span>
                  <span className="text-[10px] font-mono-code px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                    {msg.senderRole}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono-code">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p className="text-slate-300 break-words">{msg.text}</p>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="mt-3 pt-2 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            selectedCharacter
              ? `Message ${selectedCharacter.name}...`
              : 'Say something to the room...'
          }
          className="flex-1 bg-slate-950 border border-slate-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-slate-100 placeholder-slate-500 text-xs rounded-lg px-3 py-2 outline-none"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition disabled:opacity-40"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
