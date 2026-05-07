'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Newspaper, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDistanceToNow } from '@/lib/format'

interface News {
  id: string
  title: string
  source: string
  url: string
  summary: string
  published_at: string
}

export function NewsFeed() {
  const [news, setNews] = useState<News[]>([])

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('news_items')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(10)
      if (data) setNews(data as News[])
    }
    load()
  }, [])

  return (
    <Card className="p-5 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Newspaper className="h-4 w-4 text-primary" />
        <h3 className="font-semibold">Forestry News</h3>
      </div>

      <ScrollArea className="flex-1 h-[420px] pr-3">
        <div className="space-y-3">
          {news.map((n) => (
            <a
              key={n.id}
              href={n.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 rounded-lg border bg-card/50 hover:bg-muted/40 transition group"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="text-[10px] font-mono text-primary uppercase">
                  {n.source}
                </span>
                <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition" />
              </div>
              <p className="text-sm font-medium leading-snug mb-1">{n.title}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {n.summary}
              </p>
              <p className="text-[10px] text-muted-foreground mt-2 font-mono">
                {formatDistanceToNow(new Date(n.published_at))}
              </p>
            </a>
          ))}
        </div>
      </ScrollArea>
    </Card>
  )
}