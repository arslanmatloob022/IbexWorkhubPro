// vite.config.ts
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "file:///home/dev/My%20Repose/vms.arez.io-web/node_modules/vite/dist/node/index.js";
import Vue from "file:///home/dev/My%20Repose/vms.arez.io-web/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import VueRouter from "file:///home/dev/My%20Repose/vms.arez.io-web/node_modules/unplugin-vue-router/dist/vite.mjs";
import { VueRouterAutoImports } from "file:///home/dev/My%20Repose/vms.arez.io-web/node_modules/unplugin-vue-router/dist/index.mjs";
import Components from "file:///home/dev/My%20Repose/vms.arez.io-web/node_modules/unplugin-vue-components/dist/vite.mjs";
import AutoImport from "file:///home/dev/My%20Repose/vms.arez.io-web/node_modules/unplugin-auto-import/dist/vite.js";
import Unfonts from "file:///home/dev/My%20Repose/vms.arez.io-web/node_modules/unplugin-fonts/dist/vite.mjs";
import { VitePluginRadar } from "file:///home/dev/My%20Repose/vms.arez.io-web/node_modules/vite-plugin-radar/dist/index.js";
import PurgeIcons from "file:///home/dev/My%20Repose/vms.arez.io-web/node_modules/vite-plugin-purge-icons/dist/index.mjs";
import ImageMin from "file:///home/dev/My%20Repose/vms.arez.io-web/node_modules/vite-plugin-imagemin/dist/index.mjs";
import VueI18nPlugin from "file:///home/dev/My%20Repose/vms.arez.io-web/node_modules/@intlify/unplugin-vue-i18n/lib/vite.mjs";
import { VitePWA } from "file:///home/dev/My%20Repose/vms.arez.io-web/node_modules/vite-plugin-pwa/dist/index.js";
import purgecss from "file:///home/dev/My%20Repose/vms.arez.io-web/node_modules/rollup-plugin-purgecss/lib/rollup-plugin-purgecss.js";
import UnheadVite from "file:///home/dev/My%20Repose/vms.arez.io-web/node_modules/@unhead/addons/dist/vite.mjs";
import { unheadVueComposablesImports } from "file:///home/dev/My%20Repose/vms.arez.io-web/node_modules/@unhead/vue/dist/index.mjs";

// vite-plugin-vuero-doc/index.ts
import { join, basename } from "file:///home/dev/My%20Repose/vms.arez.io-web/node_modules/pathe/dist/index.mjs";
import { compileTemplate, parse } from "file:///home/dev/My%20Repose/vms.arez.io-web/node_modules/@vue/compiler-sfc/dist/compiler-sfc.cjs.js";

// vite-plugin-vuero-doc/markdown.ts
import yaml from "file:///home/dev/My%20Repose/vms.arez.io-web/node_modules/js-yaml/dist/js-yaml.mjs";
import remarkShiki from "file:///home/dev/My%20Repose/vms.arez.io-web/node_modules/@stefanprobst/remark-shiki/src/index.js";
import rehypeExternalLinks from "file:///home/dev/My%20Repose/vms.arez.io-web/node_modules/rehype-external-links/index.js";
import rehypeRaw from "file:///home/dev/My%20Repose/vms.arez.io-web/node_modules/rehype-raw/index.js";
import rehypeSlug from "file:///home/dev/My%20Repose/vms.arez.io-web/node_modules/rehype-slug/index.js";
import rehypeAutolinkHeadings from "file:///home/dev/My%20Repose/vms.arez.io-web/node_modules/rehype-autolink-headings/index.js";
import rehypeStringify from "file:///home/dev/My%20Repose/vms.arez.io-web/node_modules/rehype-stringify/index.js";
import remarkParse from "file:///home/dev/My%20Repose/vms.arez.io-web/node_modules/remark-parse/index.js";
import remarkGfm from "file:///home/dev/My%20Repose/vms.arez.io-web/node_modules/remark-gfm/index.js";
import remarkRehype from "file:///home/dev/My%20Repose/vms.arez.io-web/node_modules/remark-rehype/index.js";
import remarkFrontmatter from "file:///home/dev/My%20Repose/vms.arez.io-web/node_modules/remark-frontmatter/index.js";
import { getHighlighter } from "file:///home/dev/My%20Repose/vms.arez.io-web/node_modules/shiki/dist/index.js";
import { unified } from "file:///home/dev/My%20Repose/vms.arez.io-web/node_modules/unified/index.js";
var langs = ["vue", "vue-html", "typescript", "bash", "scss"];
async function createProcessor(theme) {
  const highlighter = await getHighlighter({
    theme,
    langs
  });
  return unified().use(remarkParse).use(remarkFrontmatter).use(() => (tree, file) => {
    if (tree.children[0].type === "yaml") {
      file.data.frontmatter = yaml.load(tree.children[0].value);
    }
  }).use(remarkGfm).use(remarkShiki, { highlighter }).use(remarkRehype, { allowDangerousHtml: true }).use(rehypeRaw).use(rehypeExternalLinks, { rel: ["nofollow"], target: "_blank" }).use(rehypeSlug).use(rehypeAutolinkHeadings, {
    behavior: "append",
    content: {
      type: "element",
      tagName: "i",
      properties: {
        className: ["iconify toc-link-anchor"],
        dataIcon: "feather:link"
      },
      children: []
    },
    test: (node) => {
      if (Array.isArray(node.properties?.className) && node.properties?.className?.includes("toc-ignore")) {
        return false;
      }
      return Boolean(node.properties?.id);
    }
  }).use(rehypeStringify);
}
async function createProcessors(theme) {
  return {
    light: await createProcessor(typeof theme === "string" ? theme : theme.light),
    dark: await createProcessor(typeof theme === "string" ? theme : theme.dark)
  };
}

// vite-plugin-vuero-doc/transform.ts
import { kebabCase } from "file:///home/dev/My%20Repose/vms.arez.io-web/node_modules/scule/dist/index.mjs";
var SELF_CLOSING_TAG_REGEX = /<([^\s></]+)([^>]+)\/>/g;
var OPEN_TAG_REGEX = /<([^\s></]+)/g;
var CLOSE_TAG_REGEX = /<\/([^\s></]+)/g;
function transformExampleMarkup(raw) {
  let output = raw;
  let content = null;
  if (content = raw.match(/<!--example-->([\s\S]*?)<!--\/example-->/)) {
    const kebabContent = content[1].replaceAll(SELF_CLOSING_TAG_REGEX, (substring, tag) => {
      return substring.replace("/>", `></${tag.trim()}>`);
    }).replaceAll(OPEN_TAG_REGEX, (substring) => {
      return `<${kebabCase(substring.substring(1).trim())}`;
    }).replaceAll(CLOSE_TAG_REGEX, (substring) => {
      return `</${kebabCase(substring.substring(2).trim())}`;
    }).replaceAll("&#x27;", "'");
    output = output.replace(content[1], kebabContent);
  }
  return output;
}
function transformSlots(source, condition = "") {
  if (source.includes("<!--code-->") && source.includes("<!--example-->")) {
    return `<template ${condition} #default>${source}`.replace(
      `<!--code-->`,
      `</template><template ${condition} #code>
<slot name="code"><div v-pre>`
    ).replace(`<!--/code-->`, `</div></slot>
</template>`).replace(
      `<!--example-->`,
      `<template ${condition} #example>
<slot name="example">`
    ).replace(`<!--/example-->`, `</slot>
</template>`);
  }
  if (source.includes("<!--code-->")) {
    return `<template ${condition} #default>${source}`.replace(
      `<!--code-->`,
      `</template><template ${condition} #code>
<slot name="code"><div v-pre>`
    ).replace(
      `<!--/code-->`,
      `</div></slot>
</template>
<template ${condition} #example><slot name="example"></slot></template>`
    );
  }
  if (source.includes("<!--example-->")) {
    return `<template ${condition} #default>${source}`.replace(
      `<!--example-->`,
      `</template><template ${condition} #example>
<slot name="example">`
    ).replace(
      `<!--/example-->`,
      `</slot>
</template>
<template ${condition} #code><slot name="code"></slot></template>`
    );
  }
  return `<template ${condition} #default>${source}</template><template ${condition} #example><slot name="example"></slot></template><template ${condition} #code><slot name="code"></slot></template>`;
}

// vite-plugin-vuero-doc/index.ts
function parseId(id) {
  const index = id.indexOf("?");
  if (index < 0)
    return id;
  else
    return id.slice(0, index);
}
function VitePluginVueroDoc(options) {
  let config;
  let processors;
  const cwd = process.cwd();
  const pathPrefix = options.pathPrefix ? join(cwd, options.pathPrefix) : cwd;
  async function markdownToVue(id, raw) {
    const path = parseId(id);
    const input = transformExampleMarkup(raw);
    if (!processors)
      processors = await createProcessors(options.shiki.theme);
    const [vFileLight, vFileDark] = await Promise.all([
      processors.light.process(input),
      processors.dark.process(input)
    ]);
    const contentLight = vFileLight.toString();
    const contentDark = vFileDark.toString();
    const frontmatter = vFileLight.data?.frontmatter ?? {};
    const slotLight = transformSlots(contentLight, 'v-if="!darkmode.isDark"');
    const slotDark = transformSlots(contentDark, 'v-if="darkmode.isDark"');
    const sfc = [
      `<template>`,
      `  <${options.wrapperComponent} :frontmatter="frontmatter" :source-meta="sourceMeta">`,
      `    ${slotLight}`,
      `    ${slotDark}`,
      `  </${options.wrapperComponent}>`,
      `</template>`
    ].join("\n");
    const result = parse(sfc, {
      filename: path,
      sourceMap: true
    });
    if (result.errors.length || result.descriptor.template === null) {
      console.error(result.errors);
      throw new Error(`Markdown: unable to parse virtual file generated for "${id}"`);
    }
    const { code, errors } = compileTemplate({
      filename: path,
      id: path,
      source: result.descriptor.template.content,
      preprocessLang: result.descriptor.template.lang,
      transformAssetUrls: false
    });
    if (errors.length) {
      console.error(errors);
      throw new Error(`Markdown: unable to compile virtual file "${id}"`);
    }
    let sourceMeta = "undefined";
    if (options.sourceMeta?.enabled) {
      sourceMeta = JSON.stringify({
        relativePath: path.substring(cwd.length),
        basename: basename(path),
        path: config?.isProduction ? "" : path,
        editProtocol: config?.isProduction ? "" : options.sourceMeta.editProtocol
      });
    }
    const output = [
      `import { reactive } from 'vue'`,
      `import { useDarkmode } from '/@src/stores/darkmode'`,
      code.replace("export function render", "function render"),
      `const __frontmatter = ${JSON.stringify(frontmatter)};`,
      `const setup = () => ({`,
      `  frontmatter: reactive(__frontmatter),`,
      `  darkmode: useDarkmode(),`,
      `  sourceMeta: ${sourceMeta},`,
      `});`,
      `const __script = { render, setup };`,
      config?.isProduction ? "" : `__script.__hmrId = ${JSON.stringify(path)};`,
      `export default __script;`
    ].join("\n");
    return output;
  }
  return {
    name: "vite-plugin-vuero-doc",
    enforce: "pre",
    configResolved(_config) {
      config = _config;
    },
    async transform(raw, id) {
      if (id.endsWith(".md") && id.startsWith(pathPrefix)) {
        return await markdownToVue(id, raw);
      }
    }
  };
}

// vite-plugin-purge-comments/index.ts
import MagicString from "file:///home/dev/My%20Repose/vms.arez.io-web/node_modules/magic-string/dist/magic-string.es.mjs";
function parseId2(id) {
  const index = id.indexOf("?");
  if (index < 0)
    return id;
  else
    return id.slice(0, index);
}
function VitePluginPurgeComments({ sourcemap = false } = {}) {
  return {
    name: "purge-comments",
    enforce: "pre",
    transform: (code, id) => {
      const parsedId = parseId2(id);
      if (!(parsedId.endsWith(".vue") || parsedId.endsWith(".html") || parsedId.endsWith(".svg"))) {
        return;
      }
      if (!code.includes("<!--")) {
        return;
      }
      const s = new MagicString(code);
      s.replace(/<!--[\w\W\s]*?-->/g, "");
      if (s.hasChanged()) {
        return {
          code: s.toString(),
          map: sourcemap && s.generateMap({ source: id, includeContent: true })
        };
      }
    }
  };
}

// vite.config.ts
var __vite_injected_original_import_meta_url = "file:///home/dev/My%20Repose/vms.arez.io-web/vite.config.ts";
var MINIFY_IMAGES = process.env.MINIFY ? process.env.MINIFY === "true" : false;
var isProd = process.env.NODE_ENV === "production";
var vite_config_default = defineConfig({
  // Project root directory (where index.html is located).
  root: process.cwd(),
  // Base public path when served in development or production.
  // You also need to add this base like `history: createWebHistory('my-subdirectory')`
  // in ./src/router.ts
  // base: '/my-subdirectory/',
  base: "/",
  // Directory to serve as plain static assets.
  publicDir: "public",
  // Adjust console output verbosity.
  logLevel: "info",
  // development server configuration
  server: {
    // Vite 4 defaults to 5173, but you can override it with the port option.
    port: 3e3
  },
  /**
   * Define allow to replace string in the code at build time.
   */
  define: {
    // VSCODE_TEXTMATE_DEBUG is used in shiki, but it's not defined in the browser
    "process.env.VSCODE_TEXTMATE_DEBUG": "false"
  },
  /**
   * By default, Vite will crawl your index.html to detect dependencies that
   * need to be pre-bundled. If build.rollupOptions.input is specified,
   * Vite will crawl those entry points instead.
   *
   * @see https://vitejs.dev/config/#optimizedeps-entries
   */
  optimizeDeps: {
    include: [
      "@ckeditor/ckeditor5-vue",
      "@ckeditor/ckeditor5-build-classic",
      "@iconify/iconify",
      "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.min.js",
      "@vee-validate/zod",
      "@vueuse/core",
      "@vueform/multiselect",
      "@vueform/slider",
      "billboard.js",
      "dayjs",
      "dropzone",
      "dragula",
      "defu",
      "filepond",
      "filepond-plugin-file-validate-size",
      "filepond-plugin-file-validate-type",
      "filepond-plugin-image-exif-orientation",
      "filepond-plugin-image-crop",
      "filepond-plugin-image-edit",
      "filepond-plugin-image-preview",
      "filepond-plugin-image-resize",
      "filepond-plugin-image-transform",
      "focus-trap-vue",
      "imask",
      "nprogress",
      "notyf",
      "mapbox-gl",
      "photoswipe/lightbox",
      "photoswipe",
      "plyr",
      "v-calendar",
      "vee-validate",
      "vue",
      "vue-scrollto",
      "vue3-apexcharts",
      "vue-tippy",
      "vue-i18n",
      "vue-router",
      "unplugin-vue-router/runtime",
      "simplebar",
      "tiny-slider/src/tiny-slider",
      "vue-accessible-color-picker",
      "zod",
      "@stefanprobst/remark-shiki",
      "rehype-external-links",
      "rehype-raw",
      "rehype-sanitize",
      "rehype-stringify",
      "rehype-slug",
      "rehype-autolink-headings",
      "remark-gfm",
      "remark-parse",
      "remark-rehype",
      "shiki",
      "unified",
      "workbox-window",
      "textarea-markdown-editor/dist/esm/bootstrap"
    ]
    // disabled: false,
  },
  // Will be passed to @rollup/plugin-alias as its entries option.
  resolve: {
    alias: [
      {
        find: "/@src/",
        replacement: `/src/`
      }
    ]
  },
  build: {
    target: "esnext",
    minify: "terser",
    // Do not warn about large chunks
    // chunkSizeWarningLimit: Infinity,
    // Double the default size threshold for inlined assets
    // https://vitejs.dev/config/build-options.html#build-assetsinlinelimit
    assetsInlineLimit: 4096 * 2
    // commonjsOptions: { include: [] },
  },
  plugins: [
    /**
     * plugin-vue plugin inject vue library and allow sfc files to work (*.vue)
     *
     * @see https://github.com/vitejs/vite/tree/main/packages/plugin-vue
     */
    Vue({
      include: [/\.vue$/],
      script: {
        defineModel: true,
        propsDestructure: true
      }
    }),
    /**
     * unplugin-vue-i18n plugin does i18n resources pre-compilation / optimizations
     *
     * @see https://github.com/intlify/bundle-tools/blob/main/packages/unplugin-vue-i18n/README.md
     */
    VueI18nPlugin({
      include: resolve(dirname(fileURLToPath(__vite_injected_original_import_meta_url)), "./src/locales/**"),
      fullInstall: false,
      compositionOnly: true
    }),
    /**
     * unplugin-vue-router plugin generate routes based on file system
     * allow to use typed routes and usage of defineLoader
     *
     * @see https://github.com/posva/unplugin-vue-router
     * @see https://github.com/vuejs/rfcs/blob/ad69da2aee9242ef88f036713db68f3ef274bb1b/active-rfcs/0000-router-use-loader.md
     */
    VueRouter({
      routesFolder: "src/pages",
      dts: "./types/router.d.ts",
      /**
       * Data Fetching is an experimental feature from vue & vue-router
       *
       * @see https://github.com/vuejs/rfcs/discussions/460
       * @see https://github.com/posva/unplugin-vue-router/tree/main/src/data-fetching
       */
      dataFetching: true
    }),
    /**
     * Unhead provides a Vite plugin to optimise your builds, by removing composables that aren't needed and simplifying your code.
     *
     * @see https://unhead.harlanzw.com/guide/getting-started/vite-plugin
     */
    UnheadVite(),
    /**
     * unplugin-auto-import allow to automaticaly import modules/components
     *
     * @see https://github.com/antfu/unplugin-auto-import
     */
    AutoImport({
      dts: "./types/imports.d.ts",
      imports: ["vue", "@vueuse/core", VueRouterAutoImports, unheadVueComposablesImports]
    }),
    /**
     * This is an internal vite plugin that load markdown files as vue components.
     *
     * @see /documentation
     * @see /vite-plugin-vuero-doc
     * @see /src/components/partials/documentation/DocumentationItem.vue
     * @see /src/composable/useMarkdownToc.ts
     */
    VitePluginVueroDoc({
      pathPrefix: "documentation",
      wrapperComponent: "DocumentationItem",
      shiki: {
        theme: {
          light: "min-light",
          dark: "github-dark"
        }
      },
      sourceMeta: {
        enabled: true,
        editProtocol: "vscode://vscode-remote/wsl+Ubuntu"
        // or 'vscode://file'
      }
    }),
    /**
     * This is an internal vite plugin that remove html comments from code.
     *
     * @see /vite-plugin-purge-comments
     */
    VitePluginPurgeComments(),
    /**
     * unplugin-vue-components plugin is responsible of autoloading components
     * documentation and md file are loaded for elements and components sections
     *
     * @see https://github.com/antfu/unplugin-vue-components
     */
    Components({
      dirs: ["documentation", "src/components", "src/layouts"],
      extensions: ["vue", "md"],
      dts: "./types/components.d.ts",
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/]
    }),
    /**
     * vite-plugin-purge-icons plugin is responsible of autoloading icones from multiples providers
     *
     * @see https://icones.netlify.app/
     * @see https://github.com/antfu/purge-icons/tree/main/packages/vite-plugin-purge-icons
     */
    PurgeIcons(),
    /**
     * vite-plugin-fonts plugin inject webfonts from differents providers
     *
     * @see https://github.com/stafyniaksacha/vite-plugin-fonts
     */
    Unfonts({
      google: {
        families: [
          {
            name: "Fira Code",
            styles: "wght@400;600"
          },
          {
            name: "Montserrat",
            styles: "wght@500;600;700;800;900"
          },
          {
            name: "Roboto",
            styles: "wght@300;400;500;600;700"
          }
        ]
      }
    }),
    /**
     * vite-plugin-radar plugin inject snippets from analytics providers
     *
     * @see https://github.com/stafyniaksacha/vite-plugin-radar
     */
    !process.env.GTM_ID ? void 0 : VitePluginRadar({
      gtm: {
        id: process.env.GTM_ID
      }
    }),
    /**
     * vite-plugin-pwa generate manifest.json and register services worker to enable PWA
     *
     * @see https://github.com/antfu/vite-plugin-pwa
     */
    VitePWA({
      base: "/",
      includeAssets: ["favicon.svg", "favicon.ico", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "AREZ - Workforce Management Software",
        short_name: "Arez",
        start_url: "/?utm_source=pwa",
        display: "standalone",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      },
      mode: isProd ? "production" : "development",
      // registerType: 'autoUpdate',
      workbox: {
        /**
         * precache files that match the glob pattern
         *
         * @see https://vite-pwa-org.netlify.app/guide/service-worker-precache.html
         */
        globPatterns: ["**/*.{js,css,ico,png,svg,webp,jpg,jpeg}"],
        /**
         * add external cache of google fonts
         *
         * @see https://vite-pwa-org.netlify.app/workbox/generate-sw.html
         */
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
                // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
                // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    }),
    /**
     * rollup-plugin-purgecss plugin is responsible of purging css rules
     * that are not used in the bundle
     *
     * @see https://github.com/FullHuman/purgecss/tree/main/packages/rollup-plugin-purgecss
     */
    purgecss({
      output: false,
      content: [`./src/**/*.vue`],
      variables: false,
      safelist: {
        standard: [
          /(autv|lnil|lnir|fas?)/,
          /-(leave|enter|appear)(|-(to|from|active))$/,
          /^(?!(|.*?:)cursor-move).+-move$/,
          /^router-link(|-exact)-active$/,
          /data-v-.*/
        ]
      },
      defaultExtractor(content) {
        const contentWithoutStyleBlocks = content.replace(/<style[^]+?<\/style>/gi, "");
        return contentWithoutStyleBlocks.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g) || [];
      }
    }),
    /**
     * vite-plugin-imagemin optimize all images sizes from public or asset folder
     *
     * @see https://github.com/anncwb/vite-plugin-imagemin
     */
    !MINIFY_IMAGES ? void 0 : ImageMin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false
      },
      optipng: {
        optimizationLevel: 7
      },
      mozjpeg: {
        quality: 60
      },
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4
      },
      svgo: {
        plugins: [
          {
            name: "removeViewBox",
            active: false
          },
          {
            name: "removeEmptyAttrs",
            active: false
          }
        ]
      }
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAidml0ZS1wbHVnaW4tdnVlcm8tZG9jL2luZGV4LnRzIiwgInZpdGUtcGx1Z2luLXZ1ZXJvLWRvYy9tYXJrZG93bi50cyIsICJ2aXRlLXBsdWdpbi12dWVyby1kb2MvdHJhbnNmb3JtLnRzIiwgInZpdGUtcGx1Z2luLXB1cmdlLWNvbW1lbnRzL2luZGV4LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvZGV2L015IFJlcG9zZS92bXMuYXJlei5pby13ZWJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2Rldi9NeSBSZXBvc2Uvdm1zLmFyZXouaW8td2ViL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2Rldi9NeSUyMFJlcG9zZS92bXMuYXJlei5pby13ZWIvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyByZXNvbHZlLCBkaXJuYW1lIH0gZnJvbSAnbm9kZTpwYXRoJ1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ25vZGU6dXJsJ1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCBWdWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IFZ1ZVJvdXRlciBmcm9tICd1bnBsdWdpbi12dWUtcm91dGVyL3ZpdGUnXG5pbXBvcnQgeyBWdWVSb3V0ZXJBdXRvSW1wb3J0cyB9IGZyb20gJ3VucGx1Z2luLXZ1ZS1yb3V0ZXInXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSdcbmltcG9ydCBVbmZvbnRzIGZyb20gJ3VucGx1Z2luLWZvbnRzL3ZpdGUnXG5pbXBvcnQgeyBWaXRlUGx1Z2luUmFkYXIgfSBmcm9tICd2aXRlLXBsdWdpbi1yYWRhcidcbmltcG9ydCBQdXJnZUljb25zIGZyb20gJ3ZpdGUtcGx1Z2luLXB1cmdlLWljb25zJ1xuaW1wb3J0IEltYWdlTWluIGZyb20gJ3ZpdGUtcGx1Z2luLWltYWdlbWluJ1xuaW1wb3J0IFZ1ZUkxOG5QbHVnaW4gZnJvbSAnQGludGxpZnkvdW5wbHVnaW4tdnVlLWkxOG4vdml0ZSdcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tICd2aXRlLXBsdWdpbi1wd2EnXG5pbXBvcnQgcHVyZ2Vjc3MgZnJvbSAncm9sbHVwLXBsdWdpbi1wdXJnZWNzcydcbmltcG9ydCBVbmhlYWRWaXRlIGZyb20gJ0B1bmhlYWQvYWRkb25zL3ZpdGUnXG5pbXBvcnQgeyB1bmhlYWRWdWVDb21wb3NhYmxlc0ltcG9ydHMgfSBmcm9tICdAdW5oZWFkL3Z1ZSdcblxuLy8gbG9jYWwgdml0ZSBwbHVnaW5cbmltcG9ydCB7IFZpdGVQbHVnaW5WdWVyb0RvYyB9IGZyb20gJy4vdml0ZS1wbHVnaW4tdnVlcm8tZG9jJ1xuaW1wb3J0IHsgVml0ZVBsdWdpblB1cmdlQ29tbWVudHMgfSBmcm9tICcuL3ZpdGUtcGx1Z2luLXB1cmdlLWNvbW1lbnRzJ1xuXG4vLyBvcHRpb25zIHZpYSBlbnYgdmFyaWFibGVzXG5jb25zdCBNSU5JRllfSU1BR0VTID0gcHJvY2Vzcy5lbnYuTUlOSUZZID8gcHJvY2Vzcy5lbnYuTUlOSUZZID09PSAndHJ1ZScgOiBmYWxzZVxuXG5jb25zdCBpc1Byb2QgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nXG5cbi8qKlxuICogVGhpcyBpcyB0aGUgbWFpbiBjb25maWd1cmF0aW9uIGZpbGUgZm9yIHZpdGVqc1xuICpcbiAqIEBzZWUgaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZ1xuICovXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICAvLyBQcm9qZWN0IHJvb3QgZGlyZWN0b3J5ICh3aGVyZSBpbmRleC5odG1sIGlzIGxvY2F0ZWQpLlxuICByb290OiBwcm9jZXNzLmN3ZCgpLFxuICAvLyBCYXNlIHB1YmxpYyBwYXRoIHdoZW4gc2VydmVkIGluIGRldmVsb3BtZW50IG9yIHByb2R1Y3Rpb24uXG4gIC8vIFlvdSBhbHNvIG5lZWQgdG8gYWRkIHRoaXMgYmFzZSBsaWtlIGBoaXN0b3J5OiBjcmVhdGVXZWJIaXN0b3J5KCdteS1zdWJkaXJlY3RvcnknKWBcbiAgLy8gaW4gLi9zcmMvcm91dGVyLnRzXG4gIC8vIGJhc2U6ICcvbXktc3ViZGlyZWN0b3J5LycsXG4gIGJhc2U6ICcvJyxcbiAgLy8gRGlyZWN0b3J5IHRvIHNlcnZlIGFzIHBsYWluIHN0YXRpYyBhc3NldHMuXG4gIHB1YmxpY0RpcjogJ3B1YmxpYycsXG4gIC8vIEFkanVzdCBjb25zb2xlIG91dHB1dCB2ZXJib3NpdHkuXG4gIGxvZ0xldmVsOiAnaW5mbycsXG4gIC8vIGRldmVsb3BtZW50IHNlcnZlciBjb25maWd1cmF0aW9uXG4gIHNlcnZlcjoge1xuICAgIC8vIFZpdGUgNCBkZWZhdWx0cyB0byA1MTczLCBidXQgeW91IGNhbiBvdmVycmlkZSBpdCB3aXRoIHRoZSBwb3J0IG9wdGlvbi5cbiAgICBwb3J0OiAzMDAwLFxuICB9LFxuICAvKipcbiAgICogRGVmaW5lIGFsbG93IHRvIHJlcGxhY2Ugc3RyaW5nIGluIHRoZSBjb2RlIGF0IGJ1aWxkIHRpbWUuXG4gICAqL1xuICBkZWZpbmU6IHtcbiAgICAvLyBWU0NPREVfVEVYVE1BVEVfREVCVUcgaXMgdXNlZCBpbiBzaGlraSwgYnV0IGl0J3Mgbm90IGRlZmluZWQgaW4gdGhlIGJyb3dzZXJcbiAgICAncHJvY2Vzcy5lbnYuVlNDT0RFX1RFWFRNQVRFX0RFQlVHJzogJ2ZhbHNlJyxcbiAgfSxcbiAgLyoqXG4gICAqIEJ5IGRlZmF1bHQsIFZpdGUgd2lsbCBjcmF3bCB5b3VyIGluZGV4Lmh0bWwgdG8gZGV0ZWN0IGRlcGVuZGVuY2llcyB0aGF0XG4gICAqIG5lZWQgdG8gYmUgcHJlLWJ1bmRsZWQuIElmIGJ1aWxkLnJvbGx1cE9wdGlvbnMuaW5wdXQgaXMgc3BlY2lmaWVkLFxuICAgKiBWaXRlIHdpbGwgY3Jhd2wgdGhvc2UgZW50cnkgcG9pbnRzIGluc3RlYWQuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy8jb3B0aW1pemVkZXBzLWVudHJpZXNcbiAgICovXG4gIG9wdGltaXplRGVwczoge1xuICAgIGluY2x1ZGU6IFtcbiAgICAgICdAY2tlZGl0b3IvY2tlZGl0b3I1LXZ1ZScsXG4gICAgICAnQGNrZWRpdG9yL2NrZWRpdG9yNS1idWlsZC1jbGFzc2ljJyxcbiAgICAgICdAaWNvbmlmeS9pY29uaWZ5JyxcbiAgICAgICdAbWFwYm94L21hcGJveC1nbC1nZW9jb2Rlci9kaXN0L21hcGJveC1nbC1nZW9jb2Rlci5taW4uanMnLFxuICAgICAgJ0B2ZWUtdmFsaWRhdGUvem9kJyxcbiAgICAgICdAdnVldXNlL2NvcmUnLFxuICAgICAgJ0B2dWVmb3JtL211bHRpc2VsZWN0JyxcbiAgICAgICdAdnVlZm9ybS9zbGlkZXInLFxuICAgICAgJ2JpbGxib2FyZC5qcycsXG4gICAgICAnZGF5anMnLFxuICAgICAgJ2Ryb3B6b25lJyxcbiAgICAgICdkcmFndWxhJyxcbiAgICAgICdkZWZ1JyxcbiAgICAgICdmaWxlcG9uZCcsXG4gICAgICAnZmlsZXBvbmQtcGx1Z2luLWZpbGUtdmFsaWRhdGUtc2l6ZScsXG4gICAgICAnZmlsZXBvbmQtcGx1Z2luLWZpbGUtdmFsaWRhdGUtdHlwZScsXG4gICAgICAnZmlsZXBvbmQtcGx1Z2luLWltYWdlLWV4aWYtb3JpZW50YXRpb24nLFxuICAgICAgJ2ZpbGVwb25kLXBsdWdpbi1pbWFnZS1jcm9wJyxcbiAgICAgICdmaWxlcG9uZC1wbHVnaW4taW1hZ2UtZWRpdCcsXG4gICAgICAnZmlsZXBvbmQtcGx1Z2luLWltYWdlLXByZXZpZXcnLFxuICAgICAgJ2ZpbGVwb25kLXBsdWdpbi1pbWFnZS1yZXNpemUnLFxuICAgICAgJ2ZpbGVwb25kLXBsdWdpbi1pbWFnZS10cmFuc2Zvcm0nLFxuICAgICAgJ2ZvY3VzLXRyYXAtdnVlJyxcbiAgICAgICdpbWFzaycsXG4gICAgICAnbnByb2dyZXNzJyxcbiAgICAgICdub3R5ZicsXG4gICAgICAnbWFwYm94LWdsJyxcbiAgICAgICdwaG90b3N3aXBlL2xpZ2h0Ym94JyxcbiAgICAgICdwaG90b3N3aXBlJyxcbiAgICAgICdwbHlyJyxcbiAgICAgICd2LWNhbGVuZGFyJyxcbiAgICAgICd2ZWUtdmFsaWRhdGUnLFxuICAgICAgJ3Z1ZScsXG4gICAgICAndnVlLXNjcm9sbHRvJyxcbiAgICAgICd2dWUzLWFwZXhjaGFydHMnLFxuICAgICAgJ3Z1ZS10aXBweScsXG4gICAgICAndnVlLWkxOG4nLFxuICAgICAgJ3Z1ZS1yb3V0ZXInLFxuICAgICAgJ3VucGx1Z2luLXZ1ZS1yb3V0ZXIvcnVudGltZScsXG4gICAgICAnc2ltcGxlYmFyJyxcbiAgICAgICd0aW55LXNsaWRlci9zcmMvdGlueS1zbGlkZXInLFxuICAgICAgJ3Z1ZS1hY2Nlc3NpYmxlLWNvbG9yLXBpY2tlcicsXG4gICAgICAnem9kJyxcbiAgICAgICdAc3RlZmFucHJvYnN0L3JlbWFyay1zaGlraScsXG4gICAgICAncmVoeXBlLWV4dGVybmFsLWxpbmtzJyxcbiAgICAgICdyZWh5cGUtcmF3JyxcbiAgICAgICdyZWh5cGUtc2FuaXRpemUnLFxuICAgICAgJ3JlaHlwZS1zdHJpbmdpZnknLFxuICAgICAgJ3JlaHlwZS1zbHVnJyxcbiAgICAgICdyZWh5cGUtYXV0b2xpbmstaGVhZGluZ3MnLFxuICAgICAgJ3JlbWFyay1nZm0nLFxuICAgICAgJ3JlbWFyay1wYXJzZScsXG4gICAgICAncmVtYXJrLXJlaHlwZScsXG4gICAgICAnc2hpa2knLFxuICAgICAgJ3VuaWZpZWQnLFxuICAgICAgJ3dvcmtib3gtd2luZG93JyxcbiAgICAgICd0ZXh0YXJlYS1tYXJrZG93bi1lZGl0b3IvZGlzdC9lc20vYm9vdHN0cmFwJyxcbiAgICBdLFxuICAgIC8vIGRpc2FibGVkOiBmYWxzZSxcbiAgfSxcbiAgLy8gV2lsbCBiZSBwYXNzZWQgdG8gQHJvbGx1cC9wbHVnaW4tYWxpYXMgYXMgaXRzIGVudHJpZXMgb3B0aW9uLlxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IFtcbiAgICAgIHtcbiAgICAgICAgZmluZDogJy9Ac3JjLycsXG4gICAgICAgIHJlcGxhY2VtZW50OiBgL3NyYy9gLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuICBidWlsZDoge1xuICAgIHRhcmdldDogJ2VzbmV4dCcsXG4gICAgbWluaWZ5OiAndGVyc2VyJyxcbiAgICAvLyBEbyBub3Qgd2FybiBhYm91dCBsYXJnZSBjaHVua3NcbiAgICAvLyBjaHVua1NpemVXYXJuaW5nTGltaXQ6IEluZmluaXR5LFxuICAgIC8vIERvdWJsZSB0aGUgZGVmYXVsdCBzaXplIHRocmVzaG9sZCBmb3IgaW5saW5lZCBhc3NldHNcbiAgICAvLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL2J1aWxkLW9wdGlvbnMuaHRtbCNidWlsZC1hc3NldHNpbmxpbmVsaW1pdFxuICAgIGFzc2V0c0lubGluZUxpbWl0OiA0MDk2ICogMixcbiAgICAvLyBjb21tb25qc09wdGlvbnM6IHsgaW5jbHVkZTogW10gfSxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIC8qKlxuICAgICAqIHBsdWdpbi12dWUgcGx1Z2luIGluamVjdCB2dWUgbGlicmFyeSBhbmQgYWxsb3cgc2ZjIGZpbGVzIHRvIHdvcmsgKCoudnVlKVxuICAgICAqXG4gICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vdml0ZWpzL3ZpdGUvdHJlZS9tYWluL3BhY2thZ2VzL3BsdWdpbi12dWVcbiAgICAgKi9cbiAgICBWdWUoe1xuICAgICAgaW5jbHVkZTogWy9cXC52dWUkL10sXG4gICAgICBzY3JpcHQ6IHtcbiAgICAgICAgZGVmaW5lTW9kZWw6IHRydWUsXG4gICAgICAgIHByb3BzRGVzdHJ1Y3R1cmU6IHRydWUsXG4gICAgICB9LFxuICAgIH0pLFxuXG4gICAgLyoqXG4gICAgICogdW5wbHVnaW4tdnVlLWkxOG4gcGx1Z2luIGRvZXMgaTE4biByZXNvdXJjZXMgcHJlLWNvbXBpbGF0aW9uIC8gb3B0aW1pemF0aW9uc1xuICAgICAqXG4gICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vaW50bGlmeS9idW5kbGUtdG9vbHMvYmxvYi9tYWluL3BhY2thZ2VzL3VucGx1Z2luLXZ1ZS1pMThuL1JFQURNRS5tZFxuICAgICAqL1xuICAgIFZ1ZUkxOG5QbHVnaW4oe1xuICAgICAgaW5jbHVkZTogcmVzb2x2ZShkaXJuYW1lKGZpbGVVUkxUb1BhdGgoaW1wb3J0Lm1ldGEudXJsKSksICcuL3NyYy9sb2NhbGVzLyoqJyksXG4gICAgICBmdWxsSW5zdGFsbDogZmFsc2UsXG4gICAgICBjb21wb3NpdGlvbk9ubHk6IHRydWUsXG4gICAgfSksXG5cbiAgICAvKipcbiAgICAgKiB1bnBsdWdpbi12dWUtcm91dGVyIHBsdWdpbiBnZW5lcmF0ZSByb3V0ZXMgYmFzZWQgb24gZmlsZSBzeXN0ZW1cbiAgICAgKiBhbGxvdyB0byB1c2UgdHlwZWQgcm91dGVzIGFuZCB1c2FnZSBvZiBkZWZpbmVMb2FkZXJcbiAgICAgKlxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3Bvc3ZhL3VucGx1Z2luLXZ1ZS1yb3V0ZXJcbiAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS92dWVqcy9yZmNzL2Jsb2IvYWQ2OWRhMmFlZTkyNDJlZjg4ZjAzNjcxM2RiNjhmM2VmMjc0YmIxYi9hY3RpdmUtcmZjcy8wMDAwLXJvdXRlci11c2UtbG9hZGVyLm1kXG4gICAgICovXG4gICAgVnVlUm91dGVyKHtcbiAgICAgIHJvdXRlc0ZvbGRlcjogJ3NyYy9wYWdlcycsXG4gICAgICBkdHM6ICcuL3R5cGVzL3JvdXRlci5kLnRzJyxcblxuICAgICAgLyoqXG4gICAgICAgKiBEYXRhIEZldGNoaW5nIGlzIGFuIGV4cGVyaW1lbnRhbCBmZWF0dXJlIGZyb20gdnVlICYgdnVlLXJvdXRlclxuICAgICAgICpcbiAgICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3Z1ZWpzL3JmY3MvZGlzY3Vzc2lvbnMvNDYwXG4gICAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9wb3N2YS91bnBsdWdpbi12dWUtcm91dGVyL3RyZWUvbWFpbi9zcmMvZGF0YS1mZXRjaGluZ1xuICAgICAgICovXG4gICAgICBkYXRhRmV0Y2hpbmc6IHRydWUsXG4gICAgfSksXG5cbiAgICAvKipcbiAgICAgKiBVbmhlYWQgcHJvdmlkZXMgYSBWaXRlIHBsdWdpbiB0byBvcHRpbWlzZSB5b3VyIGJ1aWxkcywgYnkgcmVtb3ZpbmcgY29tcG9zYWJsZXMgdGhhdCBhcmVuJ3QgbmVlZGVkIGFuZCBzaW1wbGlmeWluZyB5b3VyIGNvZGUuXG4gICAgICpcbiAgICAgKiBAc2VlIGh0dHBzOi8vdW5oZWFkLmhhcmxhbnp3LmNvbS9ndWlkZS9nZXR0aW5nLXN0YXJ0ZWQvdml0ZS1wbHVnaW5cbiAgICAgKi9cbiAgICBVbmhlYWRWaXRlKCksXG5cbiAgICAvKipcbiAgICAgKiB1bnBsdWdpbi1hdXRvLWltcG9ydCBhbGxvdyB0byBhdXRvbWF0aWNhbHkgaW1wb3J0IG1vZHVsZXMvY29tcG9uZW50c1xuICAgICAqXG4gICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdW5wbHVnaW4tYXV0by1pbXBvcnRcbiAgICAgKi9cbiAgICBBdXRvSW1wb3J0KHtcbiAgICAgIGR0czogJy4vdHlwZXMvaW1wb3J0cy5kLnRzJyxcbiAgICAgIGltcG9ydHM6IFsndnVlJywgJ0B2dWV1c2UvY29yZScsIFZ1ZVJvdXRlckF1dG9JbXBvcnRzLCB1bmhlYWRWdWVDb21wb3NhYmxlc0ltcG9ydHNdLFxuICAgIH0pLFxuXG4gICAgLyoqXG4gICAgICogVGhpcyBpcyBhbiBpbnRlcm5hbCB2aXRlIHBsdWdpbiB0aGF0IGxvYWQgbWFya2Rvd24gZmlsZXMgYXMgdnVlIGNvbXBvbmVudHMuXG4gICAgICpcbiAgICAgKiBAc2VlIC9kb2N1bWVudGF0aW9uXG4gICAgICogQHNlZSAvdml0ZS1wbHVnaW4tdnVlcm8tZG9jXG4gICAgICogQHNlZSAvc3JjL2NvbXBvbmVudHMvcGFydGlhbHMvZG9jdW1lbnRhdGlvbi9Eb2N1bWVudGF0aW9uSXRlbS52dWVcbiAgICAgKiBAc2VlIC9zcmMvY29tcG9zYWJsZS91c2VNYXJrZG93blRvYy50c1xuICAgICAqL1xuICAgIFZpdGVQbHVnaW5WdWVyb0RvYyh7XG4gICAgICBwYXRoUHJlZml4OiAnZG9jdW1lbnRhdGlvbicsXG4gICAgICB3cmFwcGVyQ29tcG9uZW50OiAnRG9jdW1lbnRhdGlvbkl0ZW0nLFxuICAgICAgc2hpa2k6IHtcbiAgICAgICAgdGhlbWU6IHtcbiAgICAgICAgICBsaWdodDogJ21pbi1saWdodCcsXG4gICAgICAgICAgZGFyazogJ2dpdGh1Yi1kYXJrJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBzb3VyY2VNZXRhOiB7XG4gICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgIGVkaXRQcm90b2NvbDogJ3ZzY29kZTovL3ZzY29kZS1yZW1vdGUvd3NsK1VidW50dScsIC8vIG9yICd2c2NvZGU6Ly9maWxlJ1xuICAgICAgfSxcbiAgICB9KSxcblxuICAgIC8qKlxuICAgICAqIFRoaXMgaXMgYW4gaW50ZXJuYWwgdml0ZSBwbHVnaW4gdGhhdCByZW1vdmUgaHRtbCBjb21tZW50cyBmcm9tIGNvZGUuXG4gICAgICpcbiAgICAgKiBAc2VlIC92aXRlLXBsdWdpbi1wdXJnZS1jb21tZW50c1xuICAgICAqL1xuICAgIFZpdGVQbHVnaW5QdXJnZUNvbW1lbnRzKCksXG5cbiAgICAvKipcbiAgICAgKiB1bnBsdWdpbi12dWUtY29tcG9uZW50cyBwbHVnaW4gaXMgcmVzcG9uc2libGUgb2YgYXV0b2xvYWRpbmcgY29tcG9uZW50c1xuICAgICAqIGRvY3VtZW50YXRpb24gYW5kIG1kIGZpbGUgYXJlIGxvYWRlZCBmb3IgZWxlbWVudHMgYW5kIGNvbXBvbmVudHMgc2VjdGlvbnNcbiAgICAgKlxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2FudGZ1L3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzXG4gICAgICovXG4gICAgQ29tcG9uZW50cyh7XG4gICAgICBkaXJzOiBbJ2RvY3VtZW50YXRpb24nLCAnc3JjL2NvbXBvbmVudHMnLCAnc3JjL2xheW91dHMnXSxcbiAgICAgIGV4dGVuc2lvbnM6IFsndnVlJywgJ21kJ10sXG4gICAgICBkdHM6ICcuL3R5cGVzL2NvbXBvbmVudHMuZC50cycsXG4gICAgICBpbmNsdWRlOiBbL1xcLnZ1ZSQvLCAvXFwudnVlXFw/dnVlLywgL1xcLm1kJC9dLFxuICAgIH0pLFxuXG4gICAgLyoqXG4gICAgICogdml0ZS1wbHVnaW4tcHVyZ2UtaWNvbnMgcGx1Z2luIGlzIHJlc3BvbnNpYmxlIG9mIGF1dG9sb2FkaW5nIGljb25lcyBmcm9tIG11bHRpcGxlcyBwcm92aWRlcnNcbiAgICAgKlxuICAgICAqIEBzZWUgaHR0cHM6Ly9pY29uZXMubmV0bGlmeS5hcHAvXG4gICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvcHVyZ2UtaWNvbnMvdHJlZS9tYWluL3BhY2thZ2VzL3ZpdGUtcGx1Z2luLXB1cmdlLWljb25zXG4gICAgICovXG4gICAgUHVyZ2VJY29ucygpLFxuXG4gICAgLyoqXG4gICAgICogdml0ZS1wbHVnaW4tZm9udHMgcGx1Z2luIGluamVjdCB3ZWJmb250cyBmcm9tIGRpZmZlcmVudHMgcHJvdmlkZXJzXG4gICAgICpcbiAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9zdGFmeW5pYWtzYWNoYS92aXRlLXBsdWdpbi1mb250c1xuICAgICAqL1xuICAgIFVuZm9udHMoe1xuICAgICAgZ29vZ2xlOiB7XG4gICAgICAgIGZhbWlsaWVzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ0ZpcmEgQ29kZScsXG4gICAgICAgICAgICBzdHlsZXM6ICd3Z2h0QDQwMDs2MDAnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ01vbnRzZXJyYXQnLFxuICAgICAgICAgICAgc3R5bGVzOiAnd2dodEA1MDA7NjAwOzcwMDs4MDA7OTAwJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdSb2JvdG8nLFxuICAgICAgICAgICAgc3R5bGVzOiAnd2dodEAzMDA7NDAwOzUwMDs2MDA7NzAwJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KSxcblxuICAgIC8qKlxuICAgICAqIHZpdGUtcGx1Z2luLXJhZGFyIHBsdWdpbiBpbmplY3Qgc25pcHBldHMgZnJvbSBhbmFseXRpY3MgcHJvdmlkZXJzXG4gICAgICpcbiAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9zdGFmeW5pYWtzYWNoYS92aXRlLXBsdWdpbi1yYWRhclxuICAgICAqL1xuICAgICFwcm9jZXNzLmVudi5HVE1fSURcbiAgICAgID8gdW5kZWZpbmVkXG4gICAgICA6IFZpdGVQbHVnaW5SYWRhcih7XG4gICAgICAgICAgZ3RtOiB7XG4gICAgICAgICAgICBpZDogcHJvY2Vzcy5lbnYuR1RNX0lELFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuXG4gICAgLyoqXG4gICAgICogdml0ZS1wbHVnaW4tcHdhIGdlbmVyYXRlIG1hbmlmZXN0Lmpzb24gYW5kIHJlZ2lzdGVyIHNlcnZpY2VzIHdvcmtlciB0byBlbmFibGUgUFdBXG4gICAgICpcbiAgICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbnRmdS92aXRlLXBsdWdpbi1wd2FcbiAgICAgKi9cbiAgICBWaXRlUFdBKHtcbiAgICAgIGJhc2U6ICcvJyxcbiAgICAgIGluY2x1ZGVBc3NldHM6IFsnZmF2aWNvbi5zdmcnLCAnZmF2aWNvbi5pY28nLCAncm9ib3RzLnR4dCcsICdhcHBsZS10b3VjaC1pY29uLnBuZyddLFxuICAgICAgbWFuaWZlc3Q6IHtcbiAgICAgICAgbmFtZTogJ0FSRVogLSBXb3JrZm9yY2UgTWFuYWdlbWVudCBTb2Z0d2FyZScsXG4gICAgICAgIHNob3J0X25hbWU6ICdBcmV6JyxcbiAgICAgICAgc3RhcnRfdXJsOiAnLz91dG1fc291cmNlPXB3YScsXG4gICAgICAgIGRpc3BsYXk6ICdzdGFuZGFsb25lJyxcbiAgICAgICAgdGhlbWVfY29sb3I6ICcjZmZmZmZmJyxcbiAgICAgICAgYmFja2dyb3VuZF9jb2xvcjogJyNmZmZmZmYnLFxuICAgICAgICBpY29uczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogJ3B3YS0xOTJ4MTkyLnBuZycsXG4gICAgICAgICAgICBzaXplczogJzE5MngxOTInLFxuICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6ICdwd2EtNTEyeDUxMi5wbmcnLFxuICAgICAgICAgICAgc2l6ZXM6ICc1MTJ4NTEyJyxcbiAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiAncHdhLTUxMng1MTIucG5nJyxcbiAgICAgICAgICAgIHNpemVzOiAnNTEyeDUxMicsXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcbiAgICAgICAgICAgIHB1cnBvc2U6ICdhbnkgbWFza2FibGUnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgbW9kZTogaXNQcm9kID8gJ3Byb2R1Y3Rpb24nIDogJ2RldmVsb3BtZW50JyxcbiAgICAgIC8vIHJlZ2lzdGVyVHlwZTogJ2F1dG9VcGRhdGUnLFxuICAgICAgd29ya2JveDoge1xuICAgICAgICAvKipcbiAgICAgICAgICogcHJlY2FjaGUgZmlsZXMgdGhhdCBtYXRjaCB0aGUgZ2xvYiBwYXR0ZXJuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBzZWUgaHR0cHM6Ly92aXRlLXB3YS1vcmcubmV0bGlmeS5hcHAvZ3VpZGUvc2VydmljZS13b3JrZXItcHJlY2FjaGUuaHRtbFxuICAgICAgICAgKi9cbiAgICAgICAgZ2xvYlBhdHRlcm5zOiBbJyoqLyoue2pzLGNzcyxpY28scG5nLHN2Zyx3ZWJwLGpwZyxqcGVnfSddLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBhZGQgZXh0ZXJuYWwgY2FjaGUgb2YgZ29vZ2xlIGZvbnRzXG4gICAgICAgICAqXG4gICAgICAgICAqIEBzZWUgaHR0cHM6Ly92aXRlLXB3YS1vcmcubmV0bGlmeS5hcHAvd29ya2JveC9nZW5lcmF0ZS1zdy5odG1sXG4gICAgICAgICAqL1xuICAgICAgICBydW50aW1lQ2FjaGluZzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHVybFBhdHRlcm46IC9eaHR0cHM6XFwvXFwvZm9udHNcXC5nb29nbGVhcGlzXFwuY29tXFwvLiovaSxcbiAgICAgICAgICAgIGhhbmRsZXI6ICdDYWNoZUZpcnN0JyxcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgY2FjaGVOYW1lOiAnZ29vZ2xlLWZvbnRzLWNhY2hlJyxcbiAgICAgICAgICAgICAgZXhwaXJhdGlvbjoge1xuICAgICAgICAgICAgICAgIG1heEVudHJpZXM6IDEwLFxuICAgICAgICAgICAgICAgIG1heEFnZVNlY29uZHM6IDYwICogNjAgKiAyNCAqIDM2NSwgLy8gPD09IDM2NSBkYXlzXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGNhY2hlYWJsZVJlc3BvbnNlOiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzZXM6IFswLCAyMDBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHVybFBhdHRlcm46IC9eaHR0cHM6XFwvXFwvZm9udHNcXC5nc3RhdGljXFwuY29tXFwvLiovaSxcbiAgICAgICAgICAgIGhhbmRsZXI6ICdDYWNoZUZpcnN0JyxcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgY2FjaGVOYW1lOiAnZ3N0YXRpYy1mb250cy1jYWNoZScsXG4gICAgICAgICAgICAgIGV4cGlyYXRpb246IHtcbiAgICAgICAgICAgICAgICBtYXhFbnRyaWVzOiAxMCxcbiAgICAgICAgICAgICAgICBtYXhBZ2VTZWNvbmRzOiA2MCAqIDYwICogMjQgKiAzNjUsIC8vIDw9PSAzNjUgZGF5c1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBjYWNoZWFibGVSZXNwb25zZToge1xuICAgICAgICAgICAgICAgIHN0YXR1c2VzOiBbMCwgMjAwXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSksXG5cbiAgICAvKipcbiAgICAgKiByb2xsdXAtcGx1Z2luLXB1cmdlY3NzIHBsdWdpbiBpcyByZXNwb25zaWJsZSBvZiBwdXJnaW5nIGNzcyBydWxlc1xuICAgICAqIHRoYXQgYXJlIG5vdCB1c2VkIGluIHRoZSBidW5kbGVcbiAgICAgKlxuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL0Z1bGxIdW1hbi9wdXJnZWNzcy90cmVlL21haW4vcGFja2FnZXMvcm9sbHVwLXBsdWdpbi1wdXJnZWNzc1xuICAgICAqL1xuICAgIHB1cmdlY3NzKHtcbiAgICAgIG91dHB1dDogZmFsc2UsXG4gICAgICBjb250ZW50OiBbYC4vc3JjLyoqLyoudnVlYF0sXG4gICAgICB2YXJpYWJsZXM6IGZhbHNlLFxuICAgICAgc2FmZWxpc3Q6IHtcbiAgICAgICAgc3RhbmRhcmQ6IFtcbiAgICAgICAgICAvKGF1dHZ8bG5pbHxsbmlyfGZhcz8pLyxcbiAgICAgICAgICAvLShsZWF2ZXxlbnRlcnxhcHBlYXIpKHwtKHRvfGZyb218YWN0aXZlKSkkLyxcbiAgICAgICAgICAvXig/ISh8Lio/OiljdXJzb3ItbW92ZSkuKy1tb3ZlJC8sXG4gICAgICAgICAgL15yb3V0ZXItbGluayh8LWV4YWN0KS1hY3RpdmUkLyxcbiAgICAgICAgICAvZGF0YS12LS4qLyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBkZWZhdWx0RXh0cmFjdG9yKGNvbnRlbnQpIHtcbiAgICAgICAgY29uc3QgY29udGVudFdpdGhvdXRTdHlsZUJsb2NrcyA9IGNvbnRlbnQucmVwbGFjZSgvPHN0eWxlW15dKz88XFwvc3R5bGU+L2dpLCAnJylcbiAgICAgICAgcmV0dXJuIGNvbnRlbnRXaXRob3V0U3R5bGVCbG9ja3MubWF0Y2goL1tBLVphLXowLTktXy86XSpbQS1aYS16MC05LV8vXSsvZykgfHwgW11cbiAgICAgIH0sXG4gICAgfSksXG5cbiAgICAvKipcbiAgICAgKiB2aXRlLXBsdWdpbi1pbWFnZW1pbiBvcHRpbWl6ZSBhbGwgaW1hZ2VzIHNpemVzIGZyb20gcHVibGljIG9yIGFzc2V0IGZvbGRlclxuICAgICAqXG4gICAgICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYW5uY3diL3ZpdGUtcGx1Z2luLWltYWdlbWluXG4gICAgICovXG4gICAgIU1JTklGWV9JTUFHRVNcbiAgICAgID8gdW5kZWZpbmVkXG4gICAgICA6IEltYWdlTWluKHtcbiAgICAgICAgICBnaWZzaWNsZToge1xuICAgICAgICAgICAgb3B0aW1pemF0aW9uTGV2ZWw6IDcsXG4gICAgICAgICAgICBpbnRlcmxhY2VkOiBmYWxzZSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIG9wdGlwbmc6IHtcbiAgICAgICAgICAgIG9wdGltaXphdGlvbkxldmVsOiA3LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgbW96anBlZzoge1xuICAgICAgICAgICAgcXVhbGl0eTogNjAsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBwbmdxdWFudDoge1xuICAgICAgICAgICAgcXVhbGl0eTogWzAuOCwgMC45XSxcbiAgICAgICAgICAgIHNwZWVkOiA0LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgc3Znbzoge1xuICAgICAgICAgICAgcGx1Z2luczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ3JlbW92ZVZpZXdCb3gnLFxuICAgICAgICAgICAgICAgIGFjdGl2ZTogZmFsc2UsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAncmVtb3ZlRW1wdHlBdHRycycsXG4gICAgICAgICAgICAgICAgYWN0aXZlOiBmYWxzZSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSksXG4gIF0sXG59KVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9kZXYvTXkgUmVwb3NlL3Ztcy5hcmV6LmlvLXdlYi92aXRlLXBsdWdpbi12dWVyby1kb2NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2Rldi9NeSBSZXBvc2Uvdm1zLmFyZXouaW8td2ViL3ZpdGUtcGx1Z2luLXZ1ZXJvLWRvYy9pbmRleC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9kZXYvTXklMjBSZXBvc2Uvdm1zLmFyZXouaW8td2ViL3ZpdGUtcGx1Z2luLXZ1ZXJvLWRvYy9pbmRleC50c1wiO2ltcG9ydCB0eXBlIHsgUGx1Z2luLCBSZXNvbHZlZENvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgdHlwZSB7IFByb2Nlc3NvciB9IGZyb20gJ3VuaWZpZWQnXG5pbXBvcnQgdHlwZSB7IFRoZW1lIH0gZnJvbSAnc2hpa2knXG5cbmltcG9ydCB7IGpvaW4sIGJhc2VuYW1lIH0gZnJvbSAncGF0aGUnXG5pbXBvcnQgeyBjb21waWxlVGVtcGxhdGUsIHBhcnNlIH0gZnJvbSAnQHZ1ZS9jb21waWxlci1zZmMnXG5cbmltcG9ydCB7IGNyZWF0ZVByb2Nlc3NvcnMgfSBmcm9tICcuL21hcmtkb3duJ1xuaW1wb3J0IHsgdHJhbnNmb3JtRXhhbXBsZU1hcmt1cCwgdHJhbnNmb3JtU2xvdHMgfSBmcm9tICcuL3RyYW5zZm9ybSdcblxuZnVuY3Rpb24gcGFyc2VJZChpZDogc3RyaW5nKSB7XG4gIGNvbnN0IGluZGV4ID0gaWQuaW5kZXhPZignPycpXG4gIGlmIChpbmRleCA8IDApIHJldHVybiBpZFxuICBlbHNlIHJldHVybiBpZC5zbGljZSgwLCBpbmRleClcbn1cblxuZXhwb3J0IGludGVyZmFjZSBQbHVnaW5PcHRpb25zIHtcbiAgcGF0aFByZWZpeD86IHN0cmluZ1xuICB3cmFwcGVyQ29tcG9uZW50OiBzdHJpbmdcbiAgc2hpa2k6IHtcbiAgICB0aGVtZTpcbiAgICAgIHwgVGhlbWVcbiAgICAgIHwge1xuICAgICAgICAgIGxpZ2h0OiBUaGVtZVxuICAgICAgICAgIGRhcms6IFRoZW1lXG4gICAgICAgIH1cbiAgfVxuICBzb3VyY2VNZXRhPzoge1xuICAgIGVuYWJsZWQ/OiBib29sZWFuXG4gICAgZWRpdFByb3RvY29sPzogc3RyaW5nXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFZpdGVQbHVnaW5WdWVyb0RvYyhvcHRpb25zOiBQbHVnaW5PcHRpb25zKSB7XG4gIGxldCBjb25maWc6IFJlc29sdmVkQ29uZmlnIHwgdW5kZWZpbmVkXG4gIGxldCBwcm9jZXNzb3JzOiB7IGxpZ2h0OiBQcm9jZXNzb3I7IGRhcms6IFByb2Nlc3NvciB9IHwgdW5kZWZpbmVkXG5cbiAgY29uc3QgY3dkID0gcHJvY2Vzcy5jd2QoKVxuICBjb25zdCBwYXRoUHJlZml4ID0gb3B0aW9ucy5wYXRoUHJlZml4ID8gam9pbihjd2QsIG9wdGlvbnMucGF0aFByZWZpeCkgOiBjd2RcblxuICBhc3luYyBmdW5jdGlvbiBtYXJrZG93blRvVnVlKGlkOiBzdHJpbmcsIHJhdzogc3RyaW5nKSB7XG4gICAgY29uc3QgcGF0aCA9IHBhcnNlSWQoaWQpXG5cbiAgICAvLyB0cmFuc2Zvcm0gZXhhbXBsZSBtYXJrdXAgdG8gdXNlIGtlYmFiLWNhc2Ugd2l0aG91dCBzZWxmLWNsb3NpbmcgZWxlbWVudHMuXG4gICAgLy8gdGhpcyBpcyBuZWVkZWQgYmVjYXVzZSByZWh5cGUtcmF3IHJlcXVpcmVzIHZhbGlkIGh0bWwgKG9ubHkgc29tZSB0YWdzIGFyZSBzZWxmLWNsb3NhYmxlKVxuICAgIGNvbnN0IGlucHV0ID0gdHJhbnNmb3JtRXhhbXBsZU1hcmt1cChyYXcpXG5cbiAgICAvLyBwcm9jZXNzIG1hcmtkb3duIHdpdGggcmVtYXJrXG4gICAgaWYgKCFwcm9jZXNzb3JzKSBwcm9jZXNzb3JzID0gYXdhaXQgY3JlYXRlUHJvY2Vzc29ycyhvcHRpb25zLnNoaWtpLnRoZW1lKVxuXG4gICAgY29uc3QgW3ZGaWxlTGlnaHQsIHZGaWxlRGFya10gPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICBwcm9jZXNzb3JzLmxpZ2h0LnByb2Nlc3MoaW5wdXQpLFxuICAgICAgcHJvY2Vzc29ycy5kYXJrLnByb2Nlc3MoaW5wdXQpLFxuICAgIF0pXG5cbiAgICBjb25zdCBjb250ZW50TGlnaHQgPSB2RmlsZUxpZ2h0LnRvU3RyaW5nKClcbiAgICBjb25zdCBjb250ZW50RGFyayA9IHZGaWxlRGFyay50b1N0cmluZygpXG4gICAgY29uc3QgZnJvbnRtYXR0ZXIgPSB2RmlsZUxpZ2h0LmRhdGE/LmZyb250bWF0dGVyID8/IHt9XG5cbiAgICAvLyByZXBsYWNlIGNvZGUvZXhhbXBsZSBzbG90cyBwbGFjZWhvbGRlcnNcbiAgICBjb25zdCBzbG90TGlnaHQgPSB0cmFuc2Zvcm1TbG90cyhjb250ZW50TGlnaHQsICd2LWlmPVwiIWRhcmttb2RlLmlzRGFya1wiJylcbiAgICBjb25zdCBzbG90RGFyayA9IHRyYW5zZm9ybVNsb3RzKGNvbnRlbnREYXJrLCAndi1pZj1cImRhcmttb2RlLmlzRGFya1wiJylcblxuICAgIC8vIHdyYXAgY29udGVudCBpbiB3cmFwcGVyIGNvbXBvbmVudCBkZWZhdWx0IHNsb3RcbiAgICBjb25zdCBzZmMgPSBbXG4gICAgICBgPHRlbXBsYXRlPmAsXG4gICAgICBgICA8JHtvcHRpb25zLndyYXBwZXJDb21wb25lbnR9IDpmcm9udG1hdHRlcj1cImZyb250bWF0dGVyXCIgOnNvdXJjZS1tZXRhPVwic291cmNlTWV0YVwiPmAsXG4gICAgICBgICAgICR7c2xvdExpZ2h0fWAsXG4gICAgICBgICAgICR7c2xvdERhcmt9YCxcbiAgICAgIGAgIDwvJHtvcHRpb25zLndyYXBwZXJDb21wb25lbnR9PmAsXG4gICAgICBgPC90ZW1wbGF0ZT5gLFxuICAgIF0uam9pbignXFxuJylcblxuICAgIC8vIHBhcnNlIHRlbXBsYXRlIHdpdGggdnVlIHNmYyBjb21waWxlclxuICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlKHNmYywge1xuICAgICAgZmlsZW5hbWU6IHBhdGgsXG4gICAgICBzb3VyY2VNYXA6IHRydWUsXG4gICAgfSlcblxuICAgIGlmIChyZXN1bHQuZXJyb3JzLmxlbmd0aCB8fCByZXN1bHQuZGVzY3JpcHRvci50ZW1wbGF0ZSA9PT0gbnVsbCkge1xuICAgICAgY29uc29sZS5lcnJvcihyZXN1bHQuZXJyb3JzKVxuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE1hcmtkb3duOiB1bmFibGUgdG8gcGFyc2UgdmlydHVhbCBmaWxlIGdlbmVyYXRlZCBmb3IgXCIke2lkfVwiYClcbiAgICB9XG5cbiAgICAvLyBjb21waWxlIHRlbXBsYXRlIHdpdGggdnVlIHNmYyBjb21waWxlclxuICAgIGNvbnN0IHsgY29kZSwgZXJyb3JzIH0gPSBjb21waWxlVGVtcGxhdGUoe1xuICAgICAgZmlsZW5hbWU6IHBhdGgsXG4gICAgICBpZDogcGF0aCxcbiAgICAgIHNvdXJjZTogcmVzdWx0LmRlc2NyaXB0b3IudGVtcGxhdGUuY29udGVudCxcbiAgICAgIHByZXByb2Nlc3NMYW5nOiByZXN1bHQuZGVzY3JpcHRvci50ZW1wbGF0ZS5sYW5nLFxuICAgICAgdHJhbnNmb3JtQXNzZXRVcmxzOiBmYWxzZSxcbiAgICB9KVxuXG4gICAgaWYgKGVycm9ycy5sZW5ndGgpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3JzKVxuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE1hcmtkb3duOiB1bmFibGUgdG8gY29tcGlsZSB2aXJ0dWFsIGZpbGUgXCIke2lkfVwiYClcbiAgICB9XG5cbiAgICAvLyBzb3VyY2UgaXMgdXNlZCB0byBkaXNwbGF5IGVkaXQgc291cmNlIGxpbmsgaW4gdGhlIGRvY3NcbiAgICBsZXQgc291cmNlTWV0YSA9ICd1bmRlZmluZWQnXG4gICAgaWYgKG9wdGlvbnMuc291cmNlTWV0YT8uZW5hYmxlZCkge1xuICAgICAgc291cmNlTWV0YSA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgcmVsYXRpdmVQYXRoOiBwYXRoLnN1YnN0cmluZyhjd2QubGVuZ3RoKSxcbiAgICAgICAgYmFzZW5hbWU6IGJhc2VuYW1lKHBhdGgpLFxuICAgICAgICBwYXRoOiBjb25maWc/LmlzUHJvZHVjdGlvbiA/ICcnIDogcGF0aCxcbiAgICAgICAgZWRpdFByb3RvY29sOiBjb25maWc/LmlzUHJvZHVjdGlvbiA/ICcnIDogb3B0aW9ucy5zb3VyY2VNZXRhLmVkaXRQcm90b2NvbCxcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgLy8gaW5qZWN0IGZyb250bWF0dGVyL2Rhcmttb2RlIGFuZCBobXJJZCBpbnRvIHRoZSBjb21waWxlZCByZW5kZXIgZnVuY3Rpb25cbiAgICBjb25zdCBvdXRwdXQgPSBbXG4gICAgICBgaW1wb3J0IHsgcmVhY3RpdmUgfSBmcm9tICd2dWUnYCxcbiAgICAgIGBpbXBvcnQgeyB1c2VEYXJrbW9kZSB9IGZyb20gJy9Ac3JjL3N0b3Jlcy9kYXJrbW9kZSdgLFxuXG4gICAgICBjb2RlLnJlcGxhY2UoJ2V4cG9ydCBmdW5jdGlvbiByZW5kZXInLCAnZnVuY3Rpb24gcmVuZGVyJyksXG5cbiAgICAgIGBjb25zdCBfX2Zyb250bWF0dGVyID0gJHtKU09OLnN0cmluZ2lmeShmcm9udG1hdHRlcil9O2AsXG4gICAgICBgY29uc3Qgc2V0dXAgPSAoKSA9PiAoe2AsXG4gICAgICBgICBmcm9udG1hdHRlcjogcmVhY3RpdmUoX19mcm9udG1hdHRlciksYCxcbiAgICAgIGAgIGRhcmttb2RlOiB1c2VEYXJrbW9kZSgpLGAsXG4gICAgICBgICBzb3VyY2VNZXRhOiAke3NvdXJjZU1ldGF9LGAsXG4gICAgICBgfSk7YCxcbiAgICAgIGBjb25zdCBfX3NjcmlwdCA9IHsgcmVuZGVyLCBzZXR1cCB9O2AsXG5cbiAgICAgIGNvbmZpZz8uaXNQcm9kdWN0aW9uID8gJycgOiBgX19zY3JpcHQuX19obXJJZCA9ICR7SlNPTi5zdHJpbmdpZnkocGF0aCl9O2AsXG4gICAgICBgZXhwb3J0IGRlZmF1bHQgX19zY3JpcHQ7YCxcbiAgICBdLmpvaW4oJ1xcbicpXG5cbiAgICByZXR1cm4gb3V0cHV0XG4gIH1cblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICd2aXRlLXBsdWdpbi12dWVyby1kb2MnLFxuICAgIGVuZm9yY2U6ICdwcmUnLFxuICAgIGNvbmZpZ1Jlc29sdmVkKF9jb25maWcpIHtcbiAgICAgIGNvbmZpZyA9IF9jb25maWdcbiAgICB9LFxuICAgIGFzeW5jIHRyYW5zZm9ybShyYXcsIGlkKSB7XG4gICAgICBpZiAoaWQuZW5kc1dpdGgoJy5tZCcpICYmIGlkLnN0YXJ0c1dpdGgocGF0aFByZWZpeCkpIHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IG1hcmtkb3duVG9WdWUoaWQsIHJhdylcbiAgICAgIH1cbiAgICB9LFxuICB9IHNhdGlzZmllcyBQbHVnaW5cbn1cblxuZXhwb3J0IGRlZmF1bHQgVml0ZVBsdWdpblZ1ZXJvRG9jXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL2Rldi9NeSBSZXBvc2Uvdm1zLmFyZXouaW8td2ViL3ZpdGUtcGx1Z2luLXZ1ZXJvLWRvY1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvZGV2L015IFJlcG9zZS92bXMuYXJlei5pby13ZWIvdml0ZS1wbHVnaW4tdnVlcm8tZG9jL21hcmtkb3duLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2Rldi9NeSUyMFJlcG9zZS92bXMuYXJlei5pby13ZWIvdml0ZS1wbHVnaW4tdnVlcm8tZG9jL21hcmtkb3duLnRzXCI7aW1wb3J0IHlhbWwgZnJvbSAnanMteWFtbCdcbmltcG9ydCByZW1hcmtTaGlraSBmcm9tICdAc3RlZmFucHJvYnN0L3JlbWFyay1zaGlraSdcbmltcG9ydCByZWh5cGVFeHRlcm5hbExpbmtzIGZyb20gJ3JlaHlwZS1leHRlcm5hbC1saW5rcydcbmltcG9ydCByZWh5cGVSYXcgZnJvbSAncmVoeXBlLXJhdydcbmltcG9ydCByZWh5cGVTbHVnIGZyb20gJ3JlaHlwZS1zbHVnJ1xuaW1wb3J0IHJlaHlwZUF1dG9saW5rSGVhZGluZ3MgZnJvbSAncmVoeXBlLWF1dG9saW5rLWhlYWRpbmdzJ1xuaW1wb3J0IHJlaHlwZVN0cmluZ2lmeSBmcm9tICdyZWh5cGUtc3RyaW5naWZ5J1xuaW1wb3J0IHJlbWFya1BhcnNlIGZyb20gJ3JlbWFyay1wYXJzZSdcbmltcG9ydCByZW1hcmtHZm0gZnJvbSAncmVtYXJrLWdmbSdcbmltcG9ydCByZW1hcmtSZWh5cGUgZnJvbSAncmVtYXJrLXJlaHlwZSdcbmltcG9ydCByZW1hcmtGcm9udG1hdHRlciBmcm9tICdyZW1hcmstZnJvbnRtYXR0ZXInXG5pbXBvcnQgeyBnZXRIaWdobGlnaHRlciwgdHlwZSBJVGhlbWVSZWdpc3RyYXRpb24sIHR5cGUgTGFuZywgdHlwZSBUaGVtZSB9IGZyb20gJ3NoaWtpJ1xuaW1wb3J0IHsgdW5pZmllZCwgdHlwZSBQcm9jZXNzb3IgfSBmcm9tICd1bmlmaWVkJ1xuXG5jb25zdCBsYW5ncyA9IFsndnVlJywgJ3Z1ZS1odG1sJywgJ3R5cGVzY3JpcHQnLCAnYmFzaCcsICdzY3NzJ10gc2F0aXNmaWVzIExhbmdbXVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlUHJvY2Vzc29yKHRoZW1lOiBJVGhlbWVSZWdpc3RyYXRpb24pOiBQcm9taXNlPFByb2Nlc3Nvcj4ge1xuICBjb25zdCBoaWdobGlnaHRlciA9IGF3YWl0IGdldEhpZ2hsaWdodGVyKHtcbiAgICB0aGVtZSxcbiAgICBsYW5ncyxcbiAgfSlcblxuICByZXR1cm4gdW5pZmllZCgpXG4gICAgLnVzZShyZW1hcmtQYXJzZSlcbiAgICAudXNlKHJlbWFya0Zyb250bWF0dGVyKVxuICAgIC51c2UoKCkgPT4gKHRyZWUsIGZpbGUpID0+IHtcbiAgICAgIGlmICh0cmVlLmNoaWxkcmVuWzBdLnR5cGUgPT09ICd5YW1sJykge1xuICAgICAgICAvLyBzdG9yZSBmcm9udG1hdHRlciBpbiB2ZmlsZVxuICAgICAgICBmaWxlLmRhdGEuZnJvbnRtYXR0ZXIgPSB5YW1sLmxvYWQodHJlZS5jaGlsZHJlblswXS52YWx1ZSlcbiAgICAgIH1cbiAgICB9KVxuICAgIC51c2UocmVtYXJrR2ZtKVxuICAgIC51c2UocmVtYXJrU2hpa2ksIHsgaGlnaGxpZ2h0ZXIgfSlcbiAgICAudXNlKHJlbWFya1JlaHlwZSwgeyBhbGxvd0Rhbmdlcm91c0h0bWw6IHRydWUgfSlcbiAgICAudXNlKHJlaHlwZVJhdylcbiAgICAudXNlKHJlaHlwZUV4dGVybmFsTGlua3MsIHsgcmVsOiBbJ25vZm9sbG93J10sIHRhcmdldDogJ19ibGFuaycgfSlcbiAgICAudXNlKHJlaHlwZVNsdWcpXG4gICAgLnVzZShyZWh5cGVBdXRvbGlua0hlYWRpbmdzLCB7XG4gICAgICBiZWhhdmlvcjogJ2FwcGVuZCcsXG4gICAgICBjb250ZW50OiB7XG4gICAgICAgIHR5cGU6ICdlbGVtZW50JyxcbiAgICAgICAgdGFnTmFtZTogJ2knLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgY2xhc3NOYW1lOiBbJ2ljb25pZnkgdG9jLWxpbmstYW5jaG9yJ10sXG4gICAgICAgICAgZGF0YUljb246ICdmZWF0aGVyOmxpbmsnLFxuICAgICAgICB9LFxuICAgICAgICBjaGlsZHJlbjogW10sXG4gICAgICB9LFxuICAgICAgdGVzdDogKG5vZGUpID0+IHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIEFycmF5LmlzQXJyYXkobm9kZS5wcm9wZXJ0aWVzPy5jbGFzc05hbWUpICYmXG4gICAgICAgICAgbm9kZS5wcm9wZXJ0aWVzPy5jbGFzc05hbWU/LmluY2x1ZGVzKCd0b2MtaWdub3JlJylcbiAgICAgICAgKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEJvb2xlYW4obm9kZS5wcm9wZXJ0aWVzPy5pZClcbiAgICAgIH0sXG4gICAgfSlcbiAgICAudXNlKHJlaHlwZVN0cmluZ2lmeSlcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVByb2Nlc3NvcnMoXG4gIHRoZW1lOlxuICAgIHwgVGhlbWVcbiAgICB8IHtcbiAgICAgICAgbGlnaHQ6IFRoZW1lXG4gICAgICAgIGRhcms6IFRoZW1lXG4gICAgICB9XG4pOiBQcm9taXNlPHsgbGlnaHQ6IFByb2Nlc3NvcjsgZGFyazogUHJvY2Vzc29yIH0+IHtcbiAgcmV0dXJuIHtcbiAgICBsaWdodDogYXdhaXQgY3JlYXRlUHJvY2Vzc29yKHR5cGVvZiB0aGVtZSA9PT0gJ3N0cmluZycgPyB0aGVtZSA6IHRoZW1lLmxpZ2h0KSxcbiAgICBkYXJrOiBhd2FpdCBjcmVhdGVQcm9jZXNzb3IodHlwZW9mIHRoZW1lID09PSAnc3RyaW5nJyA/IHRoZW1lIDogdGhlbWUuZGFyayksXG4gIH1cbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvZGV2L015IFJlcG9zZS92bXMuYXJlei5pby13ZWIvdml0ZS1wbHVnaW4tdnVlcm8tZG9jXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9kZXYvTXkgUmVwb3NlL3Ztcy5hcmV6LmlvLXdlYi92aXRlLXBsdWdpbi12dWVyby1kb2MvdHJhbnNmb3JtLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2Rldi9NeSUyMFJlcG9zZS92bXMuYXJlei5pby13ZWIvdml0ZS1wbHVnaW4tdnVlcm8tZG9jL3RyYW5zZm9ybS50c1wiO2ltcG9ydCB7IGtlYmFiQ2FzZSB9IGZyb20gJ3NjdWxlJ1xuXG5jb25zdCBTRUxGX0NMT1NJTkdfVEFHX1JFR0VYID0gLzwoW15cXHM+PC9dKykoW14+XSspXFwvPi9nXG5jb25zdCBPUEVOX1RBR19SRUdFWCA9IC88KFteXFxzPjwvXSspL2dcbmNvbnN0IENMT1NFX1RBR19SRUdFWCA9IC88XFwvKFteXFxzPjwvXSspL2dcblxuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zZm9ybUV4YW1wbGVNYXJrdXAocmF3OiBzdHJpbmcpIHtcbiAgbGV0IG91dHB1dCA9IHJhd1xuICBsZXQgY29udGVudDogUmVnRXhwTWF0Y2hBcnJheSB8IG51bGwgPSBudWxsXG4gIGlmICgoY29udGVudCA9IHJhdy5tYXRjaCgvPCEtLWV4YW1wbGUtLT4oW1xcc1xcU10qPyk8IS0tXFwvZXhhbXBsZS0tPi8pKSkge1xuICAgIGNvbnN0IGtlYmFiQ29udGVudCA9IGNvbnRlbnRbMV1cbiAgICAgIC5yZXBsYWNlQWxsKFNFTEZfQ0xPU0lOR19UQUdfUkVHRVgsIChzdWJzdHJpbmcsIHRhZykgPT4ge1xuICAgICAgICByZXR1cm4gc3Vic3RyaW5nLnJlcGxhY2UoJy8+JywgYD48LyR7dGFnLnRyaW0oKX0+YClcbiAgICAgIH0pXG4gICAgICAucmVwbGFjZUFsbChPUEVOX1RBR19SRUdFWCwgKHN1YnN0cmluZykgPT4ge1xuICAgICAgICByZXR1cm4gYDwke2tlYmFiQ2FzZShzdWJzdHJpbmcuc3Vic3RyaW5nKDEpLnRyaW0oKSl9YFxuICAgICAgfSlcbiAgICAgIC5yZXBsYWNlQWxsKENMT1NFX1RBR19SRUdFWCwgKHN1YnN0cmluZykgPT4ge1xuICAgICAgICByZXR1cm4gYDwvJHtrZWJhYkNhc2Uoc3Vic3RyaW5nLnN1YnN0cmluZygyKS50cmltKCkpfWBcbiAgICAgIH0pXG4gICAgICAucmVwbGFjZUFsbCgnJiN4Mjc7JywgXCInXCIpXG5cbiAgICBvdXRwdXQgPSBvdXRwdXQucmVwbGFjZShjb250ZW50WzFdLCBrZWJhYkNvbnRlbnQpXG4gIH1cblxuICByZXR1cm4gb3V0cHV0XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0cmFuc2Zvcm1TbG90cyhzb3VyY2U6IHN0cmluZywgY29uZGl0aW9uOiBzdHJpbmcgPSAnJykge1xuICBpZiAoc291cmNlLmluY2x1ZGVzKCc8IS0tY29kZS0tPicpICYmIHNvdXJjZS5pbmNsdWRlcygnPCEtLWV4YW1wbGUtLT4nKSkge1xuICAgIHJldHVybiBgPHRlbXBsYXRlICR7Y29uZGl0aW9ufSAjZGVmYXVsdD4ke3NvdXJjZX1gXG4gICAgICAucmVwbGFjZShcbiAgICAgICAgYDwhLS1jb2RlLS0+YCxcbiAgICAgICAgYDwvdGVtcGxhdGU+PHRlbXBsYXRlICR7Y29uZGl0aW9ufSAjY29kZT5cXG48c2xvdCBuYW1lPVwiY29kZVwiPjxkaXYgdi1wcmU+YFxuICAgICAgKVxuICAgICAgLnJlcGxhY2UoYDwhLS0vY29kZS0tPmAsIGA8L2Rpdj48L3Nsb3Q+XFxuPC90ZW1wbGF0ZT5gKVxuICAgICAgLnJlcGxhY2UoXG4gICAgICAgIGA8IS0tZXhhbXBsZS0tPmAsXG4gICAgICAgIGA8dGVtcGxhdGUgJHtjb25kaXRpb259ICNleGFtcGxlPlxcbjxzbG90IG5hbWU9XCJleGFtcGxlXCI+YFxuICAgICAgKVxuICAgICAgLnJlcGxhY2UoYDwhLS0vZXhhbXBsZS0tPmAsIGA8L3Nsb3Q+XFxuPC90ZW1wbGF0ZT5gKVxuICB9XG5cbiAgaWYgKHNvdXJjZS5pbmNsdWRlcygnPCEtLWNvZGUtLT4nKSkge1xuICAgIHJldHVybiBgPHRlbXBsYXRlICR7Y29uZGl0aW9ufSAjZGVmYXVsdD4ke3NvdXJjZX1gXG4gICAgICAucmVwbGFjZShcbiAgICAgICAgYDwhLS1jb2RlLS0+YCxcbiAgICAgICAgYDwvdGVtcGxhdGU+PHRlbXBsYXRlICR7Y29uZGl0aW9ufSAjY29kZT5cXG48c2xvdCBuYW1lPVwiY29kZVwiPjxkaXYgdi1wcmU+YFxuICAgICAgKVxuICAgICAgLnJlcGxhY2UoXG4gICAgICAgIGA8IS0tL2NvZGUtLT5gLFxuICAgICAgICBgPC9kaXY+PC9zbG90PlxcbjwvdGVtcGxhdGU+XFxuPHRlbXBsYXRlICR7Y29uZGl0aW9ufSAjZXhhbXBsZT48c2xvdCBuYW1lPVwiZXhhbXBsZVwiPjwvc2xvdD48L3RlbXBsYXRlPmBcbiAgICAgIClcbiAgfVxuXG4gIGlmIChzb3VyY2UuaW5jbHVkZXMoJzwhLS1leGFtcGxlLS0+JykpIHtcbiAgICByZXR1cm4gYDx0ZW1wbGF0ZSAke2NvbmRpdGlvbn0gI2RlZmF1bHQ+JHtzb3VyY2V9YFxuICAgICAgLnJlcGxhY2UoXG4gICAgICAgIGA8IS0tZXhhbXBsZS0tPmAsXG4gICAgICAgIGA8L3RlbXBsYXRlPjx0ZW1wbGF0ZSAke2NvbmRpdGlvbn0gI2V4YW1wbGU+XFxuPHNsb3QgbmFtZT1cImV4YW1wbGVcIj5gXG4gICAgICApXG4gICAgICAucmVwbGFjZShcbiAgICAgICAgYDwhLS0vZXhhbXBsZS0tPmAsXG4gICAgICAgIGA8L3Nsb3Q+XFxuPC90ZW1wbGF0ZT5cXG48dGVtcGxhdGUgJHtjb25kaXRpb259ICNjb2RlPjxzbG90IG5hbWU9XCJjb2RlXCI+PC9zbG90PjwvdGVtcGxhdGU+YFxuICAgICAgKVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICBgPHRlbXBsYXRlICR7Y29uZGl0aW9ufSAjZGVmYXVsdD4ke3NvdXJjZX08L3RlbXBsYXRlPmAgK1xuICAgIGA8dGVtcGxhdGUgJHtjb25kaXRpb259ICNleGFtcGxlPjxzbG90IG5hbWU9XCJleGFtcGxlXCI+PC9zbG90PjwvdGVtcGxhdGU+YCArXG4gICAgYDx0ZW1wbGF0ZSAke2NvbmRpdGlvbn0gI2NvZGU+PHNsb3QgbmFtZT1cImNvZGVcIj48L3Nsb3Q+PC90ZW1wbGF0ZT5gXG4gIClcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvZGV2L015IFJlcG9zZS92bXMuYXJlei5pby13ZWIvdml0ZS1wbHVnaW4tcHVyZ2UtY29tbWVudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2Rldi9NeSBSZXBvc2Uvdm1zLmFyZXouaW8td2ViL3ZpdGUtcGx1Z2luLXB1cmdlLWNvbW1lbnRzL2luZGV4LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2Rldi9NeSUyMFJlcG9zZS92bXMuYXJlei5pby13ZWIvdml0ZS1wbHVnaW4tcHVyZ2UtY29tbWVudHMvaW5kZXgudHNcIjtpbXBvcnQgdHlwZSB7IFBsdWdpbiB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgTWFnaWNTdHJpbmcgZnJvbSAnbWFnaWMtc3RyaW5nJ1xuXG5mdW5jdGlvbiBwYXJzZUlkKGlkOiBzdHJpbmcpIHtcbiAgY29uc3QgaW5kZXggPSBpZC5pbmRleE9mKCc/JylcbiAgaWYgKGluZGV4IDwgMCkgcmV0dXJuIGlkXG4gIGVsc2UgcmV0dXJuIGlkLnNsaWNlKDAsIGluZGV4KVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFBsdWdpbk9wdGlvbnMge1xuICBzb3VyY2VtYXA/OiBib29sZWFuXG59XG5cbi8qKlxuICogVGhpcyBwbHVnaW4gcmVtb3ZlcyBIVE1MIGNvbW1lbnRzIGZyb20geW91ciBjb2RlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gVml0ZVBsdWdpblB1cmdlQ29tbWVudHMoeyBzb3VyY2VtYXAgPSBmYWxzZSB9OiBQbHVnaW5PcHRpb25zID0ge30pIHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAncHVyZ2UtY29tbWVudHMnLFxuICAgIGVuZm9yY2U6ICdwcmUnLFxuICAgIHRyYW5zZm9ybTogKGNvZGUsIGlkKSA9PiB7XG4gICAgICBjb25zdCBwYXJzZWRJZCA9IHBhcnNlSWQoaWQpXG4gICAgICBpZiAoXG4gICAgICAgICEoXG4gICAgICAgICAgcGFyc2VkSWQuZW5kc1dpdGgoJy52dWUnKSB8fFxuICAgICAgICAgIHBhcnNlZElkLmVuZHNXaXRoKCcuaHRtbCcpIHx8XG4gICAgICAgICAgcGFyc2VkSWQuZW5kc1dpdGgoJy5zdmcnKVxuICAgICAgICApXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBpZiAoIWNvZGUuaW5jbHVkZXMoJzwhLS0nKSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgY29uc3QgcyA9IG5ldyBNYWdpY1N0cmluZyhjb2RlKVxuICAgICAgcy5yZXBsYWNlKC88IS0tW1xcd1xcV1xcc10qPy0tPi9nLCAnJylcblxuICAgICAgaWYgKHMuaGFzQ2hhbmdlZCgpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY29kZTogcy50b1N0cmluZygpLFxuICAgICAgICAgIG1hcDogc291cmNlbWFwICYmIChzLmdlbmVyYXRlTWFwKHsgc291cmNlOiBpZCwgaW5jbHVkZUNvbnRlbnQ6IHRydWUgfSkgYXMgYW55KSxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gIH0gc2F0aXNmaWVzIFBsdWdpblxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE2UixTQUFTLFNBQVMsZUFBZTtBQUM5VCxTQUFTLHFCQUFxQjtBQUM5QixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxlQUFlO0FBQ3RCLFNBQVMsNEJBQTRCO0FBQ3JDLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sYUFBYTtBQUNwQixTQUFTLHVCQUF1QjtBQUNoQyxPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGNBQWM7QUFDckIsT0FBTyxt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
