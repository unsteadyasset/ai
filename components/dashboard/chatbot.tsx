'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { MessageCircle, X, Send, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function Chatbot({ context = 'public' }: { context?: 'public' | 'ranger' }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        context === 'public'
          ? "Hi! I'm your forestry assistant. Ask me about Kenya's forests, deforestation, or how to use this app."
          : 'Intelligence Unit online. Awaiting query, ranger.',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  async function send() {
    if (!input.trim() || loading) return
    const userMsg: Message = { role: 'user', content: input }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          context,
        }),
      })
      const data = await res.json()
      setMessages((m) => [...m, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: 'Connection error. Try again.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 transition flex items-center justify-center z-50"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[380px] max-w-[calc(100vw-2rem)] z-50"
          >
            <Card className="flex flex-col h-[520px] shadow-2xl border-primary/20">
              <div className="p-4 border-b flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    {context === 'public' ? 'Forestry Assistant' : 'Intelligence Unit'}
                  </p>
                  <p className="text-[10px] font-mono text-muted-foreground">
                    POWERED BY GROQ • LLAMA 3.3
                  </p>
                </div>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm ${
                        m.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-1 px-2">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" />
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0.15s]" />
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0.3s]" />
                  </div>
                )}
              </div>

              <div className="p-3 border-t flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                  placeholder="Ask about forests..."
                  disabled={loading}
                  className="h-9 text-sm"
                />
                <Button onClick={send} disabled={loading} size="icon" className="h-9 w-9 flex-shrink-0">
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}