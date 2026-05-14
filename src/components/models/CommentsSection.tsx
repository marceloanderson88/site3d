'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MessageSquare, Send, Trash2, Edit2, Check, X } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Textarea from '@/components/ui/Textarea'
import { useToast } from '@/components/ui/Toast'
import type { Comment, Profile } from '@/types'

interface CommentsSectionProps {
  modelId: string
}

export default function CommentsSection({ modelId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [currentUser, setCurrentUser] = useState<Profile | null>(null)
  const [newComment, setNewComment] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const supabase = createClient()
  const { showToast } = useToast()

  useEffect(() => {
    fetchComments()
    fetchUser()
  }, [modelId])

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setCurrentUser(data)
    }
  }

  const fetchComments = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('comments')
      .select('*, profile:profiles(id, name, avatar_url, role)')
      .eq('model_id', modelId)
      .order('created_at', { ascending: true })
    setComments(data || [])
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) { showToast('Faça login para comentar.', 'error'); return }
    if (!newComment.trim()) return
    setSubmitting(true)
    const { error } = await supabase.from('comments').insert({
      model_id: modelId,
      user_id: currentUser.id,
      content: newComment.trim(),
    })
    if (error) {
      showToast('Erro ao enviar comentário.', 'error')
    } else {
      setNewComment('')
      fetchComments()
    }
    setSubmitting(false)
  }

  const handleDelete = async (commentId: string) => {
    const { error } = await supabase.from('comments').delete().eq('id', commentId)
    if (error) {
      showToast('Erro ao excluir comentário.', 'error')
    } else {
      fetchComments()
    }
  }

  const handleEdit = async (commentId: string) => {
    if (!editContent.trim()) return
    const { error } = await supabase.from('comments').update({ content: editContent.trim() }).eq('id', commentId)
    if (error) {
      showToast('Erro ao editar comentário.', 'error')
    } else {
      setEditingId(null)
      fetchComments()
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <MessageSquare size={16} />
        Comentários ({comments.length})
      </h2>

      {/* Form */}
      {currentUser ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <Textarea
            placeholder="Deixe seu comentário sobre esta peça..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="mb-2 min-h-[80px]"
          />
          <div className="flex justify-end">
            <Button type="submit" loading={submitting} size="sm">
              <Send size={14} />
              Comentar
            </Button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm text-gray-600 text-center">
          <a href="/login" className="text-blue-600 font-medium hover:underline">Faça login</a> para comentar.
        </div>
      )}

      {/* Comments list */}
      {loading ? (
        <div className="text-center py-8 text-gray-400">Carregando...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm">Nenhum comentário ainda. Seja o primeiro!</div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => {
            const isOwner = currentUser?.id === comment.user_id
            const isAdmin = currentUser?.role === 'admin'
            return (
              <div key={comment.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {(comment.profile as Profile | undefined)?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">{(comment.profile as Profile | undefined)?.name || 'Usuário'}</span>
                    <span className="text-xs text-gray-400">{formatDate(comment.created_at)}</span>
                  </div>
                  {editingId === comment.id ? (
                    <div>
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="mb-2 min-h-[60px] text-sm"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(comment.id)} className="text-green-600 hover:text-green-700"><Check size={14} /></button>
                        <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600"><X size={14} /></button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
                      {(isOwner || isAdmin) && (
                        <div className="flex gap-1 shrink-0">
                          {isOwner && (
                            <button
                              onClick={() => { setEditingId(comment.id); setEditContent(comment.content) }}
                              className="text-gray-400 hover:text-blue-600 transition-colors"
                              title="Editar"
                            >
                              <Edit2 size={13} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(comment.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
