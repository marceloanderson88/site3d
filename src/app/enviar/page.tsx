'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Upload, X, Image as ImageIcon, File, CheckCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import { useToast } from '@/components/ui/Toast'
import { CATEGORIES, LICENSES, MATERIALS } from '@/lib/utils'

const ALLOWED_FILE_EXTS = ['.stl', '.obj', '.3mf', '.step', '.zip']
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export default function EnviarPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const { showToast } = useToast()

  useEffect(() => {
    if (!isLoading && !user) router.push('/login')
  }, [user, isLoading, router])

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categorySlug, setCategorySlug] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [license, setLicense] = useState('')
  const [material, setMaterial] = useState('')
  const [printTime, setPrintTime] = useState('')
  const [layerHeight, setLayerHeight] = useState('')
  const [infill, setInfill] = useState('')
  const [supportsRequired, setSupportsRequired] = useState('')
  const [printerUsed, setPrinterUsed] = useState('')
  const [assemblyNotes, setAssemblyNotes] = useState('')
  const [modelFile, setModelFile] = useState<File | null>(null)
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'form' | 'success'>('form')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const handleModelFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const ext = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!ALLOWED_FILE_EXTS.includes(ext)) { showToast(`Formato não permitido. Use: ${ALLOWED_FILE_EXTS.join(', ')}`, 'error'); return }
    setModelFile(file)
  }

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const valid = files.filter(f => {
      if (!ALLOWED_IMAGE_TYPES.includes(f.type)) { showToast(`${f.name}: formato não suportado.`, 'error'); return false }
      return true
    })
    setImageFiles(prev => [...prev, ...valid].slice(0, 5))
    valid.forEach(f => {
      const reader = new FileReader()
      reader.onload = (ev) => setImagePreviews(prev => [...prev, ev.target?.result as string].slice(0, 5))
      reader.readAsDataURL(f)
    })
  }

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) { showToast('Informe o título da peça.', 'error'); return }
    if (!description.trim()) { showToast('Adicione uma descrição.', 'error'); return }
    if (!categorySlug) { showToast('Selecione uma categoria.', 'error'); return }
    if (!license) { showToast('Selecione uma licença.', 'error'); return }
    if (!modelFile) { showToast('Selecione o arquivo 3D.', 'error'); return }

    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setStep('success')
  }

  if (isLoading || !user) return null

  if (step === 'success') {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Peça enviada com sucesso!</h1>
        <p className="text-gray-500 mb-6">Sua peça foi enviada e está aguardando revisão. Após aprovação, ficará disponível para todos.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => { setStep('form'); setTitle(''); setDescription(''); setModelFile(null); setImageFiles([]); setImagePreviews([]) }}>
            Enviar outra peça
          </Button>
          <Button variant="outline" onClick={() => router.push('/minha-conta/pecas')}>Ver minhas peças</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Enviar Peça 3D</h1>
        <p className="text-gray-500 mt-1 text-sm">Compartilhe seu modelo com a comunidade maker. Peças passam por revisão antes de serem publicadas.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Informações básicas</h2>
          <Input id="title" label="Título *" placeholder="Nome da peça" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Textarea id="description" label="Descrição *" placeholder="Descreva sua peça, para que serve, como usar..." value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-[120px]" required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select id="category" label="Categoria *" options={CATEGORIES.map(c => ({ value: c.slug, label: `${c.icon} ${c.name}` }))} placeholder="Selecione..." value={categorySlug} onChange={(e) => setCategorySlug(e.target.value)} />
            <Select id="license" label="Licença *" options={LICENSES.map(l => ({ value: l, label: l }))} placeholder="Selecione..." value={license} onChange={(e) => setLicense(e.target.value)} />
          </div>
          <Input id="tags" label="Tags" placeholder="ex: suporte, parede, ferramenta (separadas por vírgula)" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} hint="Separe as tags por vírgula" />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Arquivos</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Arquivo 3D *</label>
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
              {modelFile ? (
                <div className="flex items-center justify-center gap-2 text-green-700">
                  <File size={20} /><span className="text-sm font-medium">{modelFile.name}</span>
                  <button type="button" onClick={(e) => { e.stopPropagation(); setModelFile(null) }} className="text-red-500 hover:text-red-700"><X size={16} /></button>
                </div>
              ) : (
                <div>
                  <Upload size={24} className="mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Clique para selecionar o arquivo 3D</p>
                  <p className="text-xs text-gray-400 mt-1">STL, OBJ, 3MF, STEP, ZIP — máx. 100MB</p>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept=".stl,.obj,.3mf,.step,.zip" className="hidden" onChange={handleModelFile} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Imagens (máx. 5)</label>
            <div onClick={() => imageInputRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors mb-3">
              <ImageIcon size={20} className="mx-auto mb-1 text-gray-400" />
              <p className="text-sm text-gray-600">Adicionar imagens de prévia</p>
              <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WebP</p>
            </div>
            <input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple className="hidden" onChange={handleImages} />
            {imagePreviews.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {imagePreviews.map((preview, i) => (
                  <div key={i} className="relative w-20 h-20">
                    <img src={preview} alt="" className="w-full h-full object-cover rounded-lg border border-gray-200" />
                    <button type="button" onClick={() => removeImage(i)} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"><X size={10} /></button>
                    {i === 0 && <span className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white text-xs text-center rounded-b-lg">Capa</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Configurações de Impressão <span className="text-gray-400 font-normal text-sm">(opcional)</span></h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Select id="material" label="Material" options={MATERIALS.map(m => ({ value: m, label: m }))} placeholder="Selecione..." value={material} onChange={(e) => setMaterial(e.target.value)} />
            <Input id="printTime" label="Tempo estimado" placeholder="ex: 3h30min" value={printTime} onChange={(e) => setPrintTime(e.target.value)} />
            <Input id="layerHeight" label="Altura de camada (mm)" placeholder="ex: 0.2" value={layerHeight} onChange={(e) => setLayerHeight(e.target.value)} />
            <Input id="infill" label="Preenchimento (%)" placeholder="ex: 20" value={infill} onChange={(e) => setInfill(e.target.value)} />
            <Select id="supports" label="Suporte" options={[{ value: 'false', label: 'Não necessário' }, { value: 'true', label: 'Necessário' }]} placeholder="Selecione..." value={supportsRequired} onChange={(e) => setSupportsRequired(e.target.value)} />
            <Input id="printer" label="Impressora utilizada" placeholder="ex: Ender 3" value={printerUsed} onChange={(e) => setPrinterUsed(e.target.value)} />
          </div>
          <Textarea id="assemblyNotes" label="Observações de montagem" placeholder="Dicas para montar ou pós-processar a peça..." value={assemblyNotes} onChange={(e) => setAssemblyNotes(e.target.value)} className="min-h-[80px]" />
        </div>

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
          <Button type="submit" loading={loading} size="lg">
            <Upload size={16} />Enviar Peça
          </Button>
        </div>
      </form>
    </div>
  )
}
