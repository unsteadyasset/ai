'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Send, MapPin, Upload } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export function ReportForm() {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    report_type: 'illegal_logging',
    description: '',
    location_text: '',
    reporter_name: '',
    reporter_contact: '',
    is_anonymous: true,
  })

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('reports').insert([form])
    setLoading(false)
    if (error) {
      toast.error('Failed to submit. Try again.')
    } else {
      toast.success('Report submitted! Rangers have been notified.')
      setForm({
        report_type: 'illegal_logging',
        description: '',
        location_text: '',
        reporter_name: '',
        reporter_contact: '',
        is_anonymous: true,
      })
    }
  }

  return (
    <Card className="p-5">
      <div className="mb-4">
        <h3 className="font-semibold mb-1">Report an Incident</h3>
        <p className="text-xs text-muted-foreground">
          Submit reports of illegal logging, fires, or planned tree cutting. Anonymous allowed.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-3">
        <div>
          <Label className="text-xs">Type</Label>
          <select
            value={form.report_type}
            onChange={(e) => setForm({ ...form, report_type: e.target.value })}
            className="w-full mt-1 h-9 rounded-md border bg-card px-3 text-sm"
          >
            <option value="illegal_logging">Illegal Logging</option>
            <option value="fire">Forest Fire</option>
            <option value="encroachment">Encroachment</option>
            <option value="tree_cutting_permit">Personal Tree Cutting (Notify)</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <Label className="text-xs">Location</Label>
          <div className="relative mt-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="e.g., Karura Forest, near gate B"
              value={form.location_text}
              onChange={(e) => setForm({ ...form, location_text: e.target.value })}
              className="pl-9 h-9"
              required
            />
          </div>
        </div>

        <div>
          <Label className="text-xs">Description</Label>
          <Textarea
            placeholder="Describe what you witnessed..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="mt-1 text-sm"
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="anon"
            checked={form.is_anonymous}
            onChange={(e) => setForm({ ...form, is_anonymous: e.target.checked })}
            className="rounded"
          />
          <Label htmlFor="anon" className="text-xs cursor-pointer">
            Submit anonymously
          </Label>
        </div>

        {!form.is_anonymous && (
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Your name"
              value={form.reporter_name}
              onChange={(e) => setForm({ ...form, reporter_name: e.target.value })}
              className="h-9 text-sm"
            />
            <Input
              placeholder="Phone or email"
              value={form.reporter_contact}
              onChange={(e) => setForm({ ...form, reporter_contact: e.target.value })}
              className="h-9 text-sm"
            />
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full gap-2">
          <Send className="h-3.5 w-3.5" />
          {loading ? 'Sending...' : 'Submit Report'}
        </Button>
      </form>
    </Card>
  )
}