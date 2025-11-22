import { useAppSelector } from '@/store/hooks'
import { useTranslation as useI18nTranslation } from '@/lib/i18n'
import type { Language } from '@/lib/i18n'

export function useTranslation() {
  const language = useAppSelector((state) => state.language.language)
  const { t } = useI18nTranslation(language)

  return { t, language }
}

