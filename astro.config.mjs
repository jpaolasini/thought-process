import { defineConfig } from 'astro/config'
import svelte from '@astrojs/svelte'
import mdx from '@astrojs/mdx'
import remarkGfm from 'remark-gfm'
import remarkSmartypants from 'remark-smartypants'
import rehypeExternalLinks from 'rehype-external-links'

// https://astro.build/config
const isGitHubPagesBuild = Boolean(process.env.GITHUB_ACTIONS)
const basePath = isGitHubPagesBuild ? process.env.BASE_PATH ?? '/thought-process/' : '/'

function prefixBasePath() {
  const prefix = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath

  return function transform(tree) {
    function visit(node) {
      if (!node || typeof node !== 'object') {
        return
      }

      if (node.type === 'element' && node.properties) {
        for (const key of ['href', 'src']) {
          const value = node.properties[key]
          if (typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')) {
            node.properties[key] = `${prefix}${value}`
          }
        }
      }

      if (Array.isArray(node.children)) {
        for (const child of node.children) {
          visit(child)
        }
      }
    }

    visit(tree)
  }
}

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://jpaolasini.github.io',
  base: isGitHubPagesBuild ? process.env.BASE_PATH ?? '/thought-process/' : undefined,
  integrations: [mdx(), svelte()],
  markdown: {
    shikiConfig: {
      theme: 'nord',
    },
    remarkPlugins: [remarkGfm, remarkSmartypants],
    rehypePlugins: [
      prefixBasePath,
      [
        rehypeExternalLinks,
        {
          target: '_blank',
        },
      ],
    ],
  },
})
