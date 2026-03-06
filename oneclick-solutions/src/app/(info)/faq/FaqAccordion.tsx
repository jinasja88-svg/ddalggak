'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FaqCategory } from './page'

interface FaqAccordionProps {
  categories: FaqCategory[]
}

export default function FaqAccordion({ categories }: FaqAccordionProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.name || '')
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  const toggleItem = (key: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  return (
    <div>
      {/* 카테고리 탭 */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
            className={cn(
              'px-4 py-2 text-[14px] font-semibold rounded-lg transition-all duration-200 cursor-pointer',
              activeCategory === cat.name
                ? 'bg-primary text-white shadow-sm'
                : 'bg-surface text-text-secondary hover:bg-primary-bg hover:text-primary'
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* 아코디언 */}
      <div className="space-y-3">
        {categories
          .find((cat) => cat.name === activeCategory)
          ?.items.map((item, index) => {
            const key = `${activeCategory}-${index}`
            const isOpen = openItems.has(key)

            return (
              <div
                key={key}
                className="border border-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(key)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-surface/50 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-[14px] font-bold text-primary">Q.</span>
                    <span className="text-[15px] font-medium text-text-primary">
                      {item.question}
                    </span>
                  </span>
                  <ChevronDown
                    size={18}
                    className={cn(
                      'text-text-tertiary transition-transform duration-200 flex-shrink-0 ml-4',
                      isOpen && 'rotate-180'
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 animate-fade-in">
                    <div className="flex gap-3 pt-1 border-t border-border pt-4">
                      <span className="text-[14px] font-bold text-primary-light flex-shrink-0">
                        A.
                      </span>
                      <p className="text-[14px] text-text-secondary leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}
