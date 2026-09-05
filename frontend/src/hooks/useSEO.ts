import { useEffect } from 'react'

export function useSEO(title: string, description: string, keywords?: string[]) {
  useEffect(() => {
    document.title = title
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    meta.content = description

    let keywordMeta = document.querySelector('meta[name="keywords"]') as HTMLMetaElement | null
    if (!keywordMeta) {
      keywordMeta = document.createElement('meta')
      keywordMeta.name = 'keywords'
      document.head.appendChild(keywordMeta)
    }
    keywordMeta.content = keywords?.join(', ') || ''
  }, [title, description, keywords])
}
